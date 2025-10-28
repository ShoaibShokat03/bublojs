$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host "Server running at http://localhost:8080"

while ($true) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($path)) { $path = 'index.html' }

    if (Test-Path $path) {
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        switch ($ext) {
            '.html' { $ctype = 'text/html' }
            '.css'  { $ctype = 'text/css' }
            '.js'   { $ctype = 'application/javascript' }
            '.png'  { $ctype = 'image/png' }
            '.jpg'  { $ctype = 'image/jpeg' }
            '.jpeg' { $ctype = 'image/jpeg' }
            default { $ctype = 'application/octet-stream' }
        }
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $context.Response.ContentType = $ctype
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
        $msg = [System.Text.Encoding]::UTF8.GetBytes('404 - Not Found')
        $context.Response.StatusCode = 404
        $context.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $context.Response.Close()
}
