# Google Sheets Setup Guide — TableOrder

Follow these steps once. Takes about 10 minutes.

---

## STEP 1 — Create your Google Sheet

1. Go to **sheets.google.com** and create a new blank spreadsheet
2. Name it anything, e.g. `Restaurant Orders`
3. In **Row 1**, add these column headers (A through I):

   A=Date, B=Time, C=Waiter, D=Item, E=Qty, F=Price, G=Subtotal, H=Order Total, I=Note

4. Copy the **Spreadsheet ID** from the URL bar:
   `https://docs.google.com/spreadsheets/d/` **THIS LONG ID PART** `/edit`

---

## STEP 2 — Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Paste this code exactly:

```javascript
const SHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  try {
    const p = e.parameter;
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    sheet.appendRow([
      p.date,
      p.time,
      p.waiter,
      p.item,
      p.qty,
      p.price,
      p.subtotal,
      p.order_total,
      p.note
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({status:'error',message:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Replace `PASTE_YOUR_SPREADSHEET_ID_HERE` with the ID you copied in Step 1
5. Click **Save**, name the project `TableOrder`

---

## STEP 3 — Deploy the Script

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → click **Allow**
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/LONG_ID/exec`)

---

## STEP 4 — Paste URL into the app

1. Open `index.html` in a text editor
2. Find this line:
   `const SCRIPT_URL = '';`
3. Paste your URL:
   `const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';`
4. Save and re-upload `index.html` to GitHub

---

## STEP 5 — Test it

1. Open the app, place a test order
2. Check your Google Sheet — rows should appear within seconds!

---

## IMPORTANT

- If you ever edit the Apps Script, create a **New deployment** each time — don't update the existing one. Use the new URL in index.html.
- Each item in an order = one row in the sheet (easy to filter by waiter, date, item).
