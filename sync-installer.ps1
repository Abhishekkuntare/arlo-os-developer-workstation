$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$installer = Join-Path $projectRoot "release\ABHISHEK-OS-Setup.exe"
$siteDownload = Join-Path $PSScriptRoot "downloads\ARLO-OS-Setup.exe"

if (!(Test-Path $installer)) {
  Write-Host "Installer not found:"
  Write-Host $installer
  Write-Host ""
  Write-Host "Run 'npm run package:exe' in your ARLO OS project first."
  exit 1
}

Copy-Item $installer $siteDownload -Force

$sizeMB = [math]::Round((Get-Item $siteDownload).Length / 1MB, 2)

Write-Host ""
Write-Host "ARLO OS installer copied successfully."
Write-Host "File: $siteDownload"
Write-Host "Size: $sizeMB MB"
