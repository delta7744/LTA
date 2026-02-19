$response = Invoke-RestMethod -Uri "http://localhost:3333/api/city" -Method Get
$response.data | Select-Object Id, Name | ConvertTo-Json
