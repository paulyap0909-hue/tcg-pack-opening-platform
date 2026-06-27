param(
    [string]$OutputRoot = (Join-Path $PSScriptRoot "..\exports\tcg-screenshot-assets-batch-2")
)

Add-Type -AssemblyName System.Drawing

$sources = @{
    whiteflare = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-31a9de42-0e58-49bd-aa1d-a29380683207.png'
    destined = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-f551f81a-b1e2-44e5-be37-b50a2d14bad7.png'
    evolving = 'C:\Users\admin\AppData\Local\Temp\codex-clipboard-dcfeb3e5-d798-488e-bbc2-f06484c3d9ad.png'
}

$items = @(
    @{ Category='packs'; File='white-flare.jpg'; Source='whiteflare'; X=188; Y=119; W=198; H=360; Series='White Flare' },
    @{ Category='packs'; File='destined-rivals.jpg'; Source='destined'; X=144; Y=135; W=159; H=289; Series='Destined Rivals' },
    @{ Category='packs'; File='evolving-skies.jpg'; Source='evolving'; X=159; Y=131; W=159; H=289; Series='Evolving Skies' },

    @{ Category='cards\white-flare'; File='card-01.jpg'; Source='whiteflare'; X=425; Y=215; W=136; H=190; Series='White Flare' },
    @{ Category='cards\white-flare'; File='card-02.jpg'; Source='whiteflare'; X=572; Y=215; W=136; H=190; Series='White Flare' },
    @{ Category='cards\white-flare'; File='card-03.jpg'; Source='whiteflare'; X=718; Y=215; W=136; H=190; Series='White Flare' },
    @{ Category='cards\white-flare'; File='card-04.jpg'; Source='whiteflare'; X=865; Y=215; W=136; H=190; Series='White Flare' },
    @{ Category='cards\white-flare'; File='card-05.jpg'; Source='whiteflare'; X=1012; Y=215; W=136; H=190; Series='White Flare' },
    @{ Category='cards\white-flare'; File='card-06.jpg'; Source='whiteflare'; X=1159; Y=215; W=136; H=190; Series='White Flare' },

    @{ Category='cards\destined-rivals'; File='card-01.jpg'; Source='destined'; X=362; Y=197; W=135; H=189; Series='Destined Rivals' },
    @{ Category='cards\destined-rivals'; File='card-02.jpg'; Source='destined'; X=508; Y=197; W=135; H=189; Series='Destined Rivals' },
    @{ Category='cards\destined-rivals'; File='card-03.jpg'; Source='destined'; X=655; Y=197; W=135; H=189; Series='Destined Rivals' },
    @{ Category='cards\destined-rivals'; File='card-04.jpg'; Source='destined'; X=802; Y=197; W=135; H=189; Series='Destined Rivals' },
    @{ Category='cards\destined-rivals'; File='card-05.jpg'; Source='destined'; X=949; Y=197; W=135; H=189; Series='Destined Rivals' },
    @{ Category='cards\destined-rivals'; File='card-06.jpg'; Source='destined'; X=1096; Y=197; W=134; H=189; Series='Destined Rivals' },

    @{ Category='cards\evolving-skies'; File='card-01.jpg'; Source='evolving'; X=376; Y=193; W=136; H=190; Series='Evolving Skies' },
    @{ Category='cards\evolving-skies'; File='card-02.jpg'; Source='evolving'; X=523; Y=193; W=136; H=190; Series='Evolving Skies' },
    @{ Category='cards\evolving-skies'; File='card-03.jpg'; Source='evolving'; X=669; Y=193; W=136; H=190; Series='Evolving Skies' },
    @{ Category='cards\evolving-skies'; File='card-04.jpg'; Source='evolving'; X=816; Y=193; W=136; H=190; Series='Evolving Skies' },
    @{ Category='cards\evolving-skies'; File='card-05.jpg'; Source='evolving'; X=963; Y=193; W=136; H=190; Series='Evolving Skies' },
    @{ Category='cards\evolving-skies'; File='card-06.jpg'; Source='evolving'; X=1110; Y=193; W=136; H=190; Series='Evolving Skies' }
)

if (Test-Path -LiteralPath $OutputRoot) {
    Remove-Item -LiteralPath $OutputRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]90
)

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
