param(
    [string]$OutputRoot = (Join-Path $PSScriptRoot "..\exports\tcg-screenshot-assets")
)

Add-Type -AssemblyName System.Drawing

$sources = @{
    ascended = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-4fcd4089-8aa7-4cc6-98ec-26b3a74a34be.png'
    chaos = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-610f288d-6535-431d-8d75-55ea96a0ff76.png'
    phantasmal = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-ee5d1066-1d12-4a3e-b10e-563550cc5ef7.png'
    mega = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-9124f40f-8a33-48da-9f34-4d67add6dd56.png'
    blackbolt = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-eb5aab05-a339-40c9-b297-1f77cb6138aa.png'
}

$items = @(
    @{ Category='packs'; File='ascended-heroes.jpg'; Source='ascended'; X=230; Y=148; W=198; H=361; Series='Ascended Heroes' },
    @{ Category='packs'; File='chaos-rising.jpg'; Source='chaos'; X=219; Y=58; W=196; H=360; Series='Chaos Rising' },
    @{ Category='packs'; File='phantasmal-flames.jpg'; Source='phantasmal'; X=205; Y=112; W=198; H=361; Series='Phantasmal Flames' },
    @{ Category='packs'; File='mega-evolutions.jpg'; Source='mega'; X=301; Y=111; W=198; H=362; Series='Mega Evolutions' },
    @{ Category='packs'; File='black-bolt.jpg'; Source='blackbolt'; X=204; Y=124; W=198; H=360; Series='Black Bolt' },
    @{ Category='packs'; File='perfect-order.jpg'; Source='chaos'; X=386; Y=589; W=74; H=132; Series='Perfect Order' },
    @{ Category='packs'; File='white-flare.jpg'; Source='chaos'; X=1216; Y=589; W=75; H=132; Series='White Flare' },
    @{ Category='packs'; File='destined-rivals.jpg'; Source='chaos'; X=1383; Y=589; W=74; H=132; Series='Destined Rivals' },
    @{ Category='packs'; File='prismatic-evolutions.jpg'; Source='chaos'; X=1549; Y=589; W=75; H=132; Series='Prismatic Evolutions' },

    @{ Category='cards\ascended-heroes'; File='card-01.jpg'; Source='ascended'; X=467; Y=243; W=132; H=192; Series='Ascended Heroes' },
    @{ Category='cards\ascended-heroes'; File='card-02.jpg'; Source='ascended'; X=615; Y=243; W=133; H=192; Series='Ascended Heroes' },
    @{ Category='cards\ascended-heroes'; File='card-03.jpg'; Source='ascended'; X=762; Y=243; W=133; H=192; Series='Ascended Heroes' },
    @{ Category='cards\ascended-heroes'; File='card-04.jpg'; Source='ascended'; X=909; Y=243; W=133; H=192; Series='Ascended Heroes' },
    @{ Category='cards\ascended-heroes'; File='card-05.jpg'; Source='ascended'; X=1056; Y=243; W=133; H=192; Series='Ascended Heroes' },
    @{ Category='cards\ascended-heroes'; File='card-06.jpg'; Source='ascended'; X=1203; Y=243; W=133; H=192; Series='Ascended Heroes' },

    @{ Category='cards\chaos-rising'; File='card-01.jpg'; Source='chaos'; X=456; Y=152; W=136; H=192; Series='Chaos Rising' },
    @{ Category='cards\chaos-rising'; File='card-02.jpg'; Source='chaos'; X=603; Y=152; W=135; H=192; Series='Chaos Rising' },
    @{ Category='cards\chaos-rising'; File='card-03.jpg'; Source='chaos'; X=748; Y=152; W=136; H=192; Series='Chaos Rising' },
    @{ Category='cards\chaos-rising'; File='card-04.jpg'; Source='chaos'; X=895; Y=152; W=136; H=192; Series='Chaos Rising' },
    @{ Category='cards\chaos-rising'; File='card-05.jpg'; Source='chaos'; X=1042; Y=152; W=136; H=192; Series='Chaos Rising' },
    @{ Category='cards\chaos-rising'; File='card-06.jpg'; Source='chaos'; X=1189; Y=152; W=136; H=192; Series='Chaos Rising' },

    @{ Category='cards\phantasmal-flames'; File='card-01.jpg'; Source='phantasmal'; X=443; Y=207; W=136; H=192; Series='Phantasmal Flames' },
    @{ Category='cards\phantasmal-flames'; File='card-02.jpg'; Source='phantasmal'; X=589; Y=207; W=136; H=192; Series='Phantasmal Flames' },
    @{ Category='cards\phantasmal-flames'; File='card-03.jpg'; Source='phantasmal'; X=736; Y=207; W=136; H=192; Series='Phantasmal Flames' },
    @{ Category='cards\phantasmal-flames'; File='card-04.jpg'; Source='phantasmal'; X=883; Y=207; W=136; H=192; Series='Phantasmal Flames' },
    @{ Category='cards\phantasmal-flames'; File='card-05.jpg'; Source='phantasmal'; X=1030; Y=207; W=136; H=192; Series='Phantasmal Flames' },
    @{ Category='cards\phantasmal-flames'; File='card-06.jpg'; Source='phantasmal'; X=1177; Y=207; W=136; H=192; Series='Phantasmal Flames' },

    @{ Category='cards\mega-evolutions'; File='card-01.jpg'; Source='mega'; X=538; Y=207; W=136; H=192; Series='Mega Evolutions' },
    @{ Category='cards\mega-evolutions'; File='card-02.jpg'; Source='mega'; X=685; Y=207; W=136; H=192; Series='Mega Evolutions' },
    @{ Category='cards\mega-evolutions'; File='card-03.jpg'; Source='mega'; X=832; Y=207; W=136; H=192; Series='Mega Evolutions' },
    @{ Category='cards\mega-evolutions'; File='card-04.jpg'; Source='mega'; X=979; Y=207; W=136; H=192; Series='Mega Evolutions' },
    @{ Category='cards\mega-evolutions'; File='card-05.jpg'; Source='mega'; X=1126; Y=207; W=136; H=192; Series='Mega Evolutions' },
    @{ Category='cards\mega-evolutions'; File='card-06.jpg'; Source='mega'; X=1273; Y=207; W=136; H=192; Series='Mega Evolutions' },

    @{ Category='cards\black-bolt'; File='card-01.jpg'; Source='blackbolt'; X=441; Y=220; W=136; H=190; Series='Black Bolt' },
    @{ Category='cards\black-bolt'; File='card-02.jpg'; Source='blackbolt'; X=588; Y=220; W=136; H=190; Series='Black Bolt' },
    @{ Category='cards\black-bolt'; File='card-03.jpg'; Source='blackbolt'; X=735; Y=220; W=136; H=190; Series='Black Bolt' },
    @{ Category='cards\black-bolt'; File='card-04.jpg'; Source='blackbolt'; X=882; Y=220; W=136; H=190; Series='Black Bolt' },
    @{ Category='cards\black-bolt'; File='card-05.jpg'; Source='blackbolt'; X=1029; Y=220; W=136; H=190; Series='Black Bolt' },
    @{ Category='cards\black-bolt'; File='card-06.jpg'; Source='blackbolt'; X=1176; Y=220; W=136; H=190; Series='Black Bolt' }
)

if (Test-Path $OutputRoot) {
    Remove-Item -LiteralPath $OutputRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]90)

$manifest = foreach ($item in $items) {
    $sourcePath = $sources[$item.Source]
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "Missing source image: $sourcePath"
    }

    $destinationDir = Join-Path $OutputRoot $item.Category
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    $destinationPath = Join-Path $destinationDir $item.File

    $sourceImage = [System.Drawing.Bitmap]::FromFile($sourcePath)
    try {
        $bounds = New-Object System.Drawing.Rectangle($item.X, $item.Y, $item.W, $item.H)
        $crop = $sourceImage.Clone($bounds, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        try {
            $crop.Save($destinationPath, $jpegCodec, $encoderParams)
        }
        finally {
            $crop.Dispose()
        }
    }
    finally {
        $sourceImage.Dispose()
    }

    [PSCustomObject]@{
        category = $item.Category
        filename = $item.File
        series = $item.Series
        source = [IO.Path]::GetFileName($sourcePath)
        crop = "$($item.X),$($item.Y),$($item.W),$($item.H)"
        resolution = "$($item.W)x$($item.H)"
    }
}

$manifest | Export-Csv -LiteralPath (Join-Path $OutputRoot 'manifest.csv') -NoTypeInformation -Encoding UTF8

$notice = @'
These images were cropped from screenshots supplied by the user.
The archive contains recognizable third-party trading-card artwork and trademarks.
No ownership or redistribution rights are granted by this extraction process.
Use only where you have the necessary permission or license.
'@
Set-Content -LiteralPath (Join-Path $OutputRoot 'SOURCE-NOTICE.txt') -Value $notice -Encoding UTF8

$zipPath = "$OutputRoot.zip"
if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -Path (Join-Path $OutputRoot '*') -DestinationPath $zipPath -CompressionLevel Optimal

Write-Output "Created $($items.Count) images"
Write-Output "Folder: $OutputRoot"
Write-Output "ZIP: $zipPath"
