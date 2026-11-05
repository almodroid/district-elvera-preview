# District Elvera luxury typefaces

These fonts can be self-hosted and embedded on the District Elvera website under the SIL Open Font License 1.1. Keep the corresponding OFL notices with the distributed files. The font binaries are unmodified upstream releases. The font licenses do not require website content or application code to use the OFL.

## Files and use

- Amiri-Regular.ttf: Arabic display. Original static Regular, weight 400, version 1.001. 431,128 bytes.
- CormorantGaramond-Regular.woff2: English display. Original static Regular, weight 400. 205,872 bytes.
- CormorantGaramond-Italic.woff2: English display accents. Original static Italic, weight 400. 149,444 bytes.
- IBMPlexSansArabic-Regular.ttf: Arabic and English UI/body. Original static Regular, weight 400, version 1.101. 235,924 bytes. All printable ASCII is present, along with Arabic glyphs.

For CSS, use format('truetype') for the TTF files and format('woff2') for the WOFF2 files. All four faces use font-weight: 400. Set font-style: italic only for CormorantGaramond-Italic.woff2. There are no variable axes.

## Sources and license notices

### Amiri

The unmodified TTF is the Amiri 1.001 release distributed with LibreOffice.

Its font metadata identifies Amiri 1.001, Alif Type, designer Khaled Hosny, and SIL OFL 1.1. The embedded copyright matches the bundled Amiri-OFL.txt notice:
Copyright 2010-2022 The Amiri Project Authors.

Upstream: https://github.com/aliftype/amiri
License source: https://github.com/google/fonts/blob/main/ofl/amiri/OFL.txt
Local license: Amiri-OFL.txt

### Cormorant Garamond

Original, unmodified webfonts from the official author's repository:
https://github.com/CatharsisFonts/Cormorant/blob/master/fonts/webfonts/CormorantGaramond-Regular.woff2
https://github.com/CatharsisFonts/Cormorant/blob/master/fonts/webfonts/CormorantGaramond-Italic.woff2

License source: https://github.com/CatharsisFonts/Cormorant/blob/master/OFL.txt
The bundled CormorantGaramond-OFL.txt was obtained from Google Fonts and verified byte-identical to the upstream license:
https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt

Copyright 2015 the Cormorant Project Authors.
Local license: CormorantGaramond-OFL.txt

### IBM Plex Sans Arabic

Original, unmodified TTF from Google Fonts:
https://github.com/google/fonts/blob/main/ofl/ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf

License source: https://github.com/google/fonts/blob/main/ofl/ibmplexsansarabic/OFL.txt
Local license: IBMPlexSansArabic-OFL.txt

The OFL notice names Copyright 2017 IBM Corp. and Reserved Font Name "Plex"; the unmodified binary additionally contains Copyright 2019 IBM Corp. Both notices are retained. Preserve the reserved-name restriction if producing modified fonts later.

## Verification

The downloaded Cormorant and IBM Plex font files were verified against the Git blob SHA supplied by their official repository. All font files were readable by Fontconfig or FontTools. Family, style, weight and non-variable status were checked. IBM Plex Sans Arabic includes every printable ASCII character (U+0020 through U+007E), and all characters in the Arabic sample "ديستريكت إلفيرا هندسة وعمارة فاخرة".

SHA-256 checksums:
- Amiri-Regular.ttf: 72b2702e947f423f5e553224d4bb6f5e32bfbda230a42cad2830b052de24245f
- CormorantGaramond-Regular.woff2: 5c63b39532df3ebb8c6812f68f268335eb35324f9fcd4382e69ed3e7700250c4
- CormorantGaramond-Italic.woff2: d4faa626973a7cbb80cbfb88f957c4933e1e68c20d21317e867721869d51cbbf
- IBMPlexSansArabic-Regular.ttf: 6f611412270a132bbac838da9259d4c68569b4175f3b3b8fa3fa36a30b56dab9

License and metadata checked on 2026-11-05.
