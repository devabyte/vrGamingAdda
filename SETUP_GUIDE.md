# Google Sheets Setup Guide — TableOrder

Follow these steps once. Takes about 10 minutes.

---

## STEP 1 — Create your Google Sheet

1. Go to **sheets.google.com** and create a new blank spreadsheet
2. Name it anything, e.g. `Restaurant Orders`
3. In **Row 1**, add these headers exactly (one per column A to I):

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | Date | Time | Waiter | Item | Qty | Price | Subtotal | Order Total | Note |

4. Copy the **Spreadsheet ID** from the URL bar:
   `https://docs.google.com/spreadsheets/d/` **← THIS PART →** `/edit`

---

## STEP 2 — Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Paste this code:

```javascript
const SHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    data.rows.forEach(row => {
      sheet.appendRow([
        row.date,
        row.time,
        row.waiter,
        row.item,
        row.qty,
        row.price,
        row.subtotal,
        row.order_total,
        row.note
      ]);
    });
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
5. Click **Save** (floppy disk icon), name the project `TableOrder`

---

## STEP 3 — Deploy the Script

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Fill in:
   - Description: `TableOrder API`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → click **Allow**
6. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.......verylongstring...../exec`

---

## STEP 4 — Paste the URL into the app

1. Open `index.html` in any text editor (Notepad, VS Code, etc.)
2. Find this line near the top of the `<script>` section:
   ```
   const SCRIPT_URL = '';
   ```
3. Paste your URL between the quotes:
   ```
   const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
   ```
4. Save the file
5. Upload the updated `index.html` to GitHub — done!

---

## STEP 5 — Test it

1. Open the app on your phone
2. Place a test order
3. Check your Google Sheet — a new row should appear within a few seconds!

---

## Notes

- Orders are **always saved locally** on the phone first, so even if there's no internet, the waiter's order isn't lost. It just won't sync to the sheet until connectivity returns (you'd need to re-submit in that case — a future improvement).
- Each item in an order gets its own row in the sheet, making it easy to filter/sort by item, waiter, or date.
- You can add formulas in Google Sheets to calculate daily totals, most ordered items, etc.
