param(
  [string]$AdminUser = "postgres",
  [string]$DatabaseName = "baaz_gg",
  [string]$AppUser = "baaz_app",
  [string]$AdminPassword,
  [string]$AppPassword
)

$ErrorActionPreference = "Stop"

$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (-not (Test-Path $psql)) {
  throw "psql.exe was not found at $psql"
}

if ([string]::IsNullOrWhiteSpace($AdminPassword)) {
  $adminPasswordSecure = Read-Host "Postgres admin password for '$AdminUser'" -AsSecureString
  $adminPasswordPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPasswordSecure)
  $adminPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($adminPasswordPtr)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($adminPasswordPtr)
} else {
  $adminPassword = $AdminPassword
}

$generatedPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
if ($PSBoundParameters.ContainsKey("AppPassword")) {
  $appPasswordInput = $AppPassword
} else {
  $appPasswordInput = Read-Host "Password for app database user '$AppUser' (leave blank to generate)"
}
$appPassword = if ([string]::IsNullOrWhiteSpace($appPasswordInput)) { $generatedPassword } else { $appPasswordInput }
$escapedAppPassword = $appPassword.Replace("'", "''")

$env:PGPASSWORD = $adminPassword

function Invoke-PostgresScalar($Sql) {
  $output = & $psql -U $AdminUser -h localhost -p 5432 -d postgres -tAc $Sql
  if ($null -eq $output) {
    return ""
  }

  return ($output -join "`n").Trim()
}

function Invoke-PostgresCommand($Sql) {
  & $psql -U $AdminUser -h localhost -p 5432 -d postgres -v ON_ERROR_STOP=1 -c $Sql | Out-Null
}

$roleExists = Invoke-PostgresScalar "SELECT 1 FROM pg_roles WHERE rolname = '$AppUser';"
if ($roleExists -eq "1") {
  Invoke-PostgresCommand "ALTER USER $AppUser WITH PASSWORD '$escapedAppPassword' CREATEDB;"
} else {
  Invoke-PostgresCommand "CREATE USER $AppUser WITH PASSWORD '$escapedAppPassword' CREATEDB;"
}

$dbExists = Invoke-PostgresScalar "SELECT 1 FROM pg_database WHERE datname = '$DatabaseName';"
if ($dbExists -ne "1") {
  & $psql -U $AdminUser -h localhost -p 5432 -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $DatabaseName OWNER $AppUser;" | Out-Null
}

& $psql -U $AdminUser -h localhost -p 5432 -d $DatabaseName -v ON_ERROR_STOP=1 -c "GRANT ALL PRIVILEGES ON DATABASE $DatabaseName TO $AppUser;" | Out-Null
& $psql -U $AdminUser -h localhost -p 5432 -d $DatabaseName -v ON_ERROR_STOP=1 -c "GRANT ALL ON SCHEMA public TO $AppUser;" | Out-Null

Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

$encodedPassword = [uri]::EscapeDataString($appPassword)
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
$envPath = Join-Path $PSScriptRoot "..\.env"
$envContent = @"
DATABASE_URL="postgresql://$AppUser`:$encodedPassword@localhost:5432/$DatabaseName`?schema=public"
JWT_SECRET="$jwtSecret"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
UPLOAD_DIR="uploads"
SEED_ADMIN_EMAIL="admin@baaz.gg"
SEED_ADMIN_PASSWORD="Admin@123456"
"@

Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "Local Postgres is ready."
Write-Host "Database: $DatabaseName"
Write-Host "App user: $AppUser"
Write-Host "Environment file written to backend/.env"
if ([string]::IsNullOrWhiteSpace($appPasswordInput)) {
  Write-Host "Generated app database password was written into backend/.env."
}
Write-Host "Next: cd backend; npm install; npm run prisma:migrate; npm run seed; npm run dev"
