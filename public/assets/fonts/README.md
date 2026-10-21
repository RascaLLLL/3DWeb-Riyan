# Interface fonts

These unmodified Latin WOFF2 files are bundled locally through `next/font/local`.
There are no Google Fonts requests during a build or a visitor session. System
fallbacks cover unavailable glyphs and loading failures. Total font payload:
44,076 bytes before any HTTP compression; Next may additionally preload fonts.

## Cinzel

- Use: expressive titles, weight 600. Never used for body paragraphs.
- File: `cinzel-latin-600.woff2` (15,204 bytes).
- Copyright 2020 The Cinzel Project Authors.
- License: SIL Open Font License 1.1, reproduced in `Cinzel-OFL.txt`.
- [License source](https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/OFL.txt)
- [Unmodified file source](https://fonts.gstatic.com/s/cinzel/v26/8vIU7ww63mVu7gtR-kwKxNvkNOjw-gjgfY3lDQ.woff2)
- SHA-256: `61efc27ceb7d08bb841652fa8979c0b6833b92548b7f9544c07968a6c02f28e4`

## Source Sans 3

- Use: body text and controls, variable weights 200–900 (normally 400 and 600).
- File: `source-sans-3-latin.woff2` (28,872 bytes).
- Copyright 2010–2020 Adobe, Reserved Font Name “Source”.
- License: SIL Open Font License 1.1, reproduced in `SourceSans3-OFL.txt`.
- [License source](https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/OFL.txt)
- [Unmodified file source](https://fonts.gstatic.com/s/sourcesans3/v20/nwpStKy2OAdR1K-IwhWudF-R3w8aZQ.woff2)
- [Family metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/METADATA.pb)
- SHA-256: `19143dca075972bc84e3fd9eab7416dd40cc565dccb2435a044bdfabe060c7d5`

Retrieved 2026-10-21 from Google Fonts' CSS distribution for Cinzel 600 and Source
Sans 3 400/600. License texts were checked against Google Fonts' upstream family
directories. No changes, renaming of the font families, or proprietary assets
were introduced. Redistribution with the application retains these copyright
and license notices. `npm run test:ui` checks binary signatures, hashes, and the
presence of the accompanying licenses. Georgia remains a system serif for
journal prose; no Georgia font is redistributed.
