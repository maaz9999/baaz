param(
  [string]$ApiBase = "http://localhost:4000/api/v1",
  [string]$Email = "admin@baaz.gg",
  [string]$Password = $env:BAAZ_ADMIN_PASSWORD
)

$ErrorActionPreference = "Stop"

if (-not $Password) {
  $securePassword = Read-Host "Admin password" -AsSecureString
  $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
  try {
    $Password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
  }
}

function Invoke-Json {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null,
    [string]$Token = ""
  )

  $headers = @{}
  if ($Token) {
    $headers.Authorization = "Bearer $Token"
  }

  $uri = "$ApiBase$Path"
  if ($null -eq $Body) {
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
  }

  return Invoke-RestMethod `
    -Method $Method `
    -Uri $uri `
    -Headers $headers `
    -ContentType "application/json" `
    -Body ($Body | ConvertTo-Json -Depth 8)
}

function Invoke-MediaUpload {
  param(
    [string]$FilePath,
    [string]$Token
  )

  Add-Type -AssemblyName System.Net.Http

  $client = [System.Net.Http.HttpClient]::new()
  $content = [System.Net.Http.MultipartFormDataContent]::new()
  try {
    $client.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new("Bearer", $Token)

    $fileBytes = [System.IO.File]::ReadAllBytes($FilePath)
    $fileContent = [System.Net.Http.ByteArrayContent]::new($fileBytes)
    $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("image/png")
    $content.Add($fileContent, "file", [System.IO.Path]::GetFileName($FilePath))
    $content.Add([System.Net.Http.StringContent]::new("CMS smoke upload"), "alt")
    $content.Add([System.Net.Http.StringContent]::new("Temporary media upload test"), "caption")

    $response = $client.PostAsync("$ApiBase/media/upload", $content).GetAwaiter().GetResult()
    $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
    if (-not $response.IsSuccessStatusCode) {
      throw "Media upload failed with $([int]$response.StatusCode): $body"
    }

    return $body | ConvertFrom-Json
  } finally {
    $content.Dispose()
    $client.Dispose()
  }
}

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )

  if (-not $Condition) {
    throw $Message
  }
}

function Wait-Backend {
  param([int]$TimeoutSeconds = 60)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  do {
    try {
      $health = Invoke-Json -Method "GET" -Path "/health"
      if ($health.ok -eq $true) {
        return
      }
    } catch {
    }

    Start-Sleep -Seconds 2
  } while ((Get-Date) -lt $deadline)

  throw "Backend did not become ready at $ApiBase."
}

$token = ""
$postId = ""
$placementId = ""
$mediaId = ""
$mediaFilePath = ""
$stamp = Get-Date -Format "yyyyMMddHHmmss"
$slug = "cms-smoke-$stamp"

try {
  Write-Host "Checking backend health..."
  Wait-Backend

  Write-Host "Logging in..."
  $login = Invoke-Json -Method "POST" -Path "/auth/login" -Body @{
    email = $Email
    password = $Password
  }
  $token = $login.accessToken
  Assert-True ([string]::IsNullOrWhiteSpace($token) -eq $false) "Login did not return an access token."

  Write-Host "Uploading temporary media asset..."
  $mediaFilePath = Join-Path $env:TEMP "cms-smoke-$stamp.png"
  [System.IO.File]::WriteAllBytes($mediaFilePath, [Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="))
  $media = Invoke-MediaUpload -FilePath $mediaFilePath -Token $token
  $mediaId = $media.id
  Assert-True ([string]::IsNullOrWhiteSpace($mediaId) -eq $false) "Media upload did not return an id."
  Assert-True ($media.mimeType -eq "image/png") "Media upload did not preserve image/png MIME type."

  Write-Host "Creating temporary published post..."
  $post = Invoke-Json -Method "POST" -Path "/posts" -Token $token -Body @{
    title = "CMS Smoke Test $stamp"
    slug = $slug
    templateKey = "ptl-update"
    status = "PUBLISHED"
    eyebrow = "PTL"
    excerpt = "Temporary smoke-test post. This should be cleaned up automatically."
    body = @{
      blocks = @(@{
        type = "paragraph"
        text = "Temporary smoke-test body."
      })
    }
    cta = @{
      label = "Open"
      href = "/posts/$slug"
    }
    publishedAt = (Get-Date).ToUniversalTime().ToString("o")
  }
  $postId = $post.id
  Assert-True ([string]::IsNullOrWhiteSpace($postId) -eq $false) "Post create did not return an id."

  Write-Host "Creating temporary PTL placement..."
  $placement = Invoke-Json -Method "POST" -Path "/placements" -Token $token -Body @{
    title = $post.title
    pageKey = "ptl-2026"
    slotKey = "featured-posts"
    targetType = "post"
    targetId = $postId
    variant = "ptl-update"
    order = 9999
    enabled = $true
  }
  $placementId = $placement.id
  Assert-True ([string]::IsNullOrWhiteSpace($placementId) -eq $false) "Placement create did not return an id."

  Write-Host "Verifying published content appears publicly..."
  $publicPlacements = Invoke-Json -Method "GET" -Path "/public/placements?page=ptl-2026"
  $visible = @($publicPlacements | Where-Object { $_.targetId -eq $postId }).Count -gt 0
  Assert-True $visible "Published placement did not appear publicly."

  Write-Host "Verifying disabled placement is hidden..."
  Invoke-Json -Method "PATCH" -Path "/placements/$placementId" -Token $token -Body @{ enabled = $false } | Out-Null
  $publicAfterDisable = Invoke-Json -Method "GET" -Path "/public/placements?page=ptl-2026"
  $stillVisible = @($publicAfterDisable | Where-Object { $_.targetId -eq $postId }).Count -gt 0
  Assert-True (-not $stillVisible) "Disabled placement still appeared publicly."

  Write-Host "Verifying draft post is hidden even if placement is enabled..."
  Invoke-Json -Method "PATCH" -Path "/posts/$postId" -Token $token -Body @{ status = "DRAFT" } | Out-Null
  Invoke-Json -Method "PATCH" -Path "/placements/$placementId" -Token $token -Body @{ enabled = $true } | Out-Null
  $publicAfterDraft = Invoke-Json -Method "GET" -Path "/public/placements?page=ptl-2026"
  $draftVisible = @($publicAfterDraft | Where-Object { $_.targetId -eq $postId }).Count -gt 0
  Assert-True (-not $draftVisible) "Draft post appeared publicly."

  Write-Host "CMS smoke test passed."
} finally {
  if ($token -and $mediaId) {
    try {
      Invoke-Json -Method "DELETE" -Path "/media/asset/$mediaId" -Token $token | Out-Null
      Write-Host "Cleaned temporary media asset."
    } catch {
      Write-Warning "Could not clean temporary media asset $mediaId."
    }
  }

  if ($mediaFilePath -and (Test-Path $mediaFilePath)) {
    Remove-Item -LiteralPath $mediaFilePath -Force
  }

  if ($token -and $placementId) {
    try {
      Invoke-Json -Method "DELETE" -Path "/placements/$placementId" -Token $token | Out-Null
      Write-Host "Cleaned temporary placement."
    } catch {
      Write-Warning "Could not clean temporary placement $placementId."
    }
  }

  if ($token -and $postId) {
    try {
      Invoke-Json -Method "DELETE" -Path "/posts/$postId" -Token $token | Out-Null
      Write-Host "Cleaned temporary post."
    } catch {
      Write-Warning "Could not clean temporary post $postId."
    }
  }
}
