# GARUDA CLAN MATCH ANALYTICS — V2

## Exact workflow
After each game, upload **ONE screenshot**. The browser runs OCR, attempts to extract player names + damage + assists + finishes + play time, saves that match locally, and updates all period filters.

## Included
- 1 Day / 2 Days / 4 Days / Week / Month
- Individual player analytics
- Team contribution analytics
- Automatic improvement flags
- Combined AI-style score/report
- Recent match history
- Mobile responsive UI
- Local browser storage
- OCR for text, numbers and symbols
- No paid API key required for this version

## Important OCR note
This is a fully static/free version, so it uses Tesseract.js in the browser. OCR is strongest when the uploaded screenshot is clear and the table is readable. The parser is intentionally flexible, but a true game-specific AI extractor would be the next upgrade: it can be connected to an AI vision API/backend and trained around the exact match-result layout.

## Run
Open `index.html` in Chrome. Internet is required initially because the OCR library is loaded from jsDelivr.
