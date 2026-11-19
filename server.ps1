param([int]$port = 5500)

$folder = $PSScriptRoot
if (-not $folder) { $folder = (Get-Location).Path }

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".pdf"  = "application/pdf"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json"
}

# Find an available port if the specified port is in use
$listener = $null
$maxAttempts = 10
for ($attempt = 0; $attempt -lt $maxAttempts; $attempt++) {
    $currentPort = $port + $attempt
    try {
        $tempListener = New-Object System.Net.HttpListener
        $tempListener.Prefixes.Add("http://localhost:$currentPort/")
        $tempListener.Start()
        $listener = $tempListener
        $port = $currentPort
        break
    } catch {
        if ($tempListener) {
            try { $tempListener.Close() } catch {}
        }
    }
}

if (-not $listener -or -not $listener.IsListening) {
    Write-Host "Could not bind to any port between $port and $($port + $maxAttempts). Please check your permissions or network settings." -ForegroundColor Red
    pause
    exit 1
}

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Zahid Bin Ali Portfolio Server is Live!" -ForegroundColor Green
Write-Host "  URL: $url" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C in this window anytime to stop the server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Automatically open the browser
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "/") {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $folder $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} catch {
    # Handled on exit/shutdown
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
