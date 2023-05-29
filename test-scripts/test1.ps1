Write-Host "I have run"
$timestamp = [int64](Get-Date -UFormat %s)
New-Item "../test-output/test1.txt" -ItemType File -Value "$timestamp" -Force
