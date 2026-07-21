param(
  [int]$FrontendPort = 3000,
  [int]$BackendPort = 4000
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$LogDir = Join-Path $Root ".codex-logs"
$StatePath = Join-Path $LogDir "local-dev-processes.json"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

function Test-HttpOk {
  param([string]$Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

function Wait-HttpOk {
  param(
    [string]$Name,
    [string]$Url,
    [int]$TimeoutSeconds = 90
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  do {
    if (Test-HttpOk $Url) {
      Write-Host "$Name ready: $Url"
      return
    }

    Start-Sleep -Seconds 2
  } while ((Get-Date) -lt $deadline)

  throw "$Name did not become ready at $Url. Check logs in $LogDir."
}

function Start-DevProcess {
  param(
    [string]$Name,
    [string]$WorkingDirectory,
    [string[]]$Arguments
  )

  $stdout = Join-Path $LogDir "$Name.out.log"
  $stderr = Join-Path $LogDir "$Name.err.log"

  if (Test-Path $stdout) { Remove-Item -LiteralPath $stdout -Force }
  if (Test-Path $stderr) { Remove-Item -LiteralPath $stderr -Force }

  $process = Start-Process `
    -FilePath "npm.cmd" `
    -ArgumentList $Arguments `
    -WorkingDirectory $WorkingDirectory `
    -RedirectStandardOutput $stdout `
    -RedirectStandardError $stderr `
    -WindowStyle Hidden `
    -PassThru

  Write-Host "Started $Name (PID $($process.Id)). Logs: $stdout"
  return $process
}

$backendHealth = "http://localhost:$BackendPort/api/v1/health"
$frontendAdmin = "http://localhost:$FrontendPort/admin"
$backendProcess = $null
$frontendProcess = $null

if (Test-HttpOk $backendHealth) {
  Write-Host "Backend already ready: $backendHealth"
} else {
  $backendProcess = Start-DevProcess `
    -Name "backend-live" `
    -WorkingDirectory (Join-Path $Root "backend") `
    -Arguments @("run", "start")
}

if (Test-HttpOk $frontendAdmin) {
  Write-Host "Frontend already ready: $frontendAdmin"
} else {
  $frontendProcess = Start-DevProcess `
    -Name "frontend-live" `
    -WorkingDirectory $Root `
    -Arguments @("run", "dev", "--", "-p", "$FrontendPort")
}

$state = [ordered]@{
  startedAt = (Get-Date).ToString("o")
  frontendUrl = "http://localhost:$FrontendPort"
  backendUrl = "http://localhost:$BackendPort"
  backendPid = if ($backendProcess) { $backendProcess.Id } else { $null }
  frontendPid = if ($frontendProcess) { $frontendProcess.Id } else { $null }
  logs = @{
    backendOut = Join-Path $LogDir "backend-live.out.log"
    backendErr = Join-Path $LogDir "backend-live.err.log"
    frontendOut = Join-Path $LogDir "frontend-live.out.log"
    frontendErr = Join-Path $LogDir "frontend-live.err.log"
  }
}

$state | ConvertTo-Json -Depth 4 | Set-Content -Path $StatePath -Encoding UTF8

Wait-HttpOk -Name "Backend" -Url $backendHealth
Wait-HttpOk -Name "Frontend" -Url $frontendAdmin

Write-Host ""
Write-Host "Admin dashboard: $frontendAdmin"
Write-Host "Backend health:  $backendHealth"
Write-Host "Process state:   $StatePath"

Write-Host "Processes running. Keep task alive..."
while ($true) {
  Start-Sleep -Seconds 2
}
