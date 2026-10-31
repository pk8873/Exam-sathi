# Exam Saathi — Exam-day Travel Coordination

A Google Apps Script + Google Sheets application starter for coordinating student travel to examination centres in Bihar. The interface is Hindi-first, responsive, and uses a custom corporate design system.

## Repository contents

- `Code.gs` — web entry point and API dispatcher
- `Database.gs` — database schema
- `Auth.gs` — student registration, login, hashed passwords, short-lived sessions and one-time admin bootstrap
- `Booking.gs` — booking, coordinator operations, driver portal, trip grouping, capacity checks, manual payments, notifications and PDF receipts
- `Diagnostics.gs` — schema diagnostics, capacity checks and private Drive backup helper
- `Index.html`, `Styles.html`, `App.html` — UI, styles and client-side workflows
- `appsscript.json` — Apps Script V8 manifest

## Current functional scope

Implemented in source:
- Public landing page and student registration/login
- Parent/guardian contact and recorded consent
- Server-side role checks for Admin, Student and Driver
- Google Sheets schema initialization
- Student booking requests and cancellation while pending/review
- Admin dashboard and management forms for exams, centres, routes and vehicles
- Driver account creation and driver/vehicle verification controls
- Group trip assignment with same-route/same-exam validation, duplicate prevention, verified driver/vehicle checks and hard seat-capacity enforcement
- Driver trip status updates; drivers can only see trips assigned to their own driver profile
- Manual cash/UPI payment recording and UPI reference validation
- In-app notifications
- Student-owned PDF receipt generation
- CSV booking export and admin-generated PDF booking report
- Student self-service profile editing with explicit re-consent when guardian details change, and administrator account activation/deactivation
- Administrator settings for site name, coordination fee and support contact details
- Edit forms for existing exams, exam centres and routes
- Trip status propagation to linked bookings (Ready for Pickup, In Progress, Completed, Cancelled); current parent consent and active student status are checked before confirmation/assignment
- Cumulative received-payment checks to prevent recording more than the booking total
- Expanded admin metrics for upcoming/completed trips, vehicle fare totals and completed-trip coordination fees\n- Non-destructive authentication/input-validation diagnostic functions\n- CSV booking export and audit log entries


- Driver profile/account editing (name, mobile, licence and active/inactive state)
- Administrator trip rescheduling before a trip starts, with in-app notices to affected students
- Trip schedule view and recent audit-log viewer in the administrator dashboard
- Date-filtered PDF booking report (booking creation date range)

Not yet production-complete:
- No automatic WhatsApp delivery, SMS OTP, live GPS, online payment gateway, automatic email delivery, automated refund processing or emergency dispatch.
- No full PWA/offline service-worker installation. Apps Script web apps do not provide normal static asset hosting/service-worker controls; the manifest endpoint is only a best-effort metadata endpoint and is not proof of PWA installation.
- Reports include booking CSV and a PDF summary filterable by booking creation date; route-wise, exam-wise, driver-payable and accounting-grade reports are not complete.
- No self-service password reset; an administrator must handle account recovery securely.
- Driver passenger manifest is limited to student names for trips assigned to that driver. Guardian phone numbers are not shown in the driver interface.
- Driver deletion (intentionally avoided), student deletion (intentionally avoided), exam/centre/route archival controls, route-wise/exam-wise/driver-payable financial reports and full end-to-end automated test coverage remain to be completed. Drivers can be edited or deactivated; vehicles can be edited and verified.
- Password storage uses salted repeated SHA-256 because Apps Script has no built-in password-hashing/KDF API. This is not a substitute for a dedicated identity provider and requires a security review before commercial launch.

**Do not use this build to transport real students until you have completed the remaining security, privacy, legal, operational and field-verification work.** Verify all drivers, permits, insurance, fitness certificates, fare rules and parent consent in person. This app coordinates requests; it does not itself provide transport, guarantee safety, or provide emergency response.

## Recent functional additions\n\nThe current `main` branch includes student profile editing, admin student activation/deactivation, editable exam/centre/route records, site settings, a basic PDF booking report, trip-status synchronization and cumulative payment amount checks. These are source-level implementations; run the deployment and manual acceptance tests below before relying on them.\n\n## Deployment (beginner guide)

### 1. Create the database
1. Open [Google Sheets](https://sheets.google.com) and create a blank spreadsheet named `Exam Saathi Database`.
2. From that spreadsheet choose **Extensions → Apps Script**.
3. In Apps Script, open **Project Settings** and enable **Show "appsscript.json" manifest file in editor**.
4. Create the files listed above. For HTML files choose **+ → HTML**; for `.gs` files choose **+ → Script**.
5. Copy each repository file into the Apps Script file with the same name. Paste `appsscript.json` into the manifest editor.
6. Save the project.

### 2. Initialize Sheets
1. In Apps Script's function selector choose `setupDatabase`.
2. Click **Run** and authorize the Google permissions requested.
3. Return to the spreadsheet. The 15 required tabs should now exist.
4. If a header mismatch error appears, stop and inspect the named sheet; do not delete existing production data.

### 3. Create the first administrator
1. In Apps Script, temporarily add this helper function to a script file:
   ```javascript
   function createMyFirstAdminOnce() {
     bootstrapFirstAdmin('YOUR-ADMIN-EMAIL', 'USE-A-UNIQUE-14-CHARACTER-OR-LONGER-PASSWORD');
   }
   ```
2. Replace both placeholders locally with your own details. Do not commit this temporary helper or password to GitHub.
3. Run `createMyFirstAdminOnce` once from the Apps Script editor.
4. Confirm the function succeeds, then immediately delete the temporary helper and save.
5. The `ADMIN_BOOTSTRAPPED` property prevents a second bootstrap through this function.

### 4. Configure the web app
1. In Apps Script choose **Deploy → New deployment**.
2. Select type **Web app**.
3. Set **Execute as: Me** so the app can access the database spreadsheet owned by the deploying account.
4. For a public student service, choose the least broad access setting that still fits your audience. If you choose **Anyone**, understand that the landing page and registration endpoint are public; all private data must remain protected by server-side role checks.
5. Click **Deploy**, complete authorization and copy the Web App URL.
6. Open the URL in a private/incognito window and test public registration and login.

### 5. Add initial operating data
1. Sign in as administrator.
2. Add exam centres first.
3. Add exams and active routes (each route must reference an existing centre ID).
4. Add a driver account. Its verification starts as Pending.
5. In **Drivers**, verify the driver's identity and licence before approving.
6. Add a vehicle with the driver's exact Driver ID. Verify insurance, permit and fitness documents in person; then approve the vehicle.
7. Register a test student account and record parent consent.
8. Submit a test booking, select same-route/same-exam bookings in the Admin Bookings section, and assign a verified driver and vehicle. The server rejects assignments above vehicle capacity.
9. Record a test cash/UPI payment. Do not enter UPI PINs or banking passwords.

### 6. Updating the live deployment
1. Edit source files in Apps Script.
2. Save and run the relevant test/diagnostic functions.
3. Choose **Deploy → Manage deployments → Edit**.
4. Select **New version**, add a description, and click **Deploy**.
5. The existing Web App URL normally remains the same.

### 7. Backup
Run `backupDatabase` from the Apps Script editor on a schedule you control. The function creates a dated copy in your Google Drive. Restrict Drive sharing on both the original spreadsheet and backups.

## Security and operations checklist

- Keep the database spreadsheet private; do not share it publicly.
- Never place passwords, tokens, API keys or personal student data in GitHub.
- Do not use real student details in test/demo data.
- Use strong unique admin passwords and protect the Google account with 2-Step Verification.
- Deploy as the spreadsheet owner and review Apps Script authorization scopes.
- Review the audit log regularly.
- Verify driver identity, licence, vehicle registration, insurance, permit and fitness certificate before marking them Verified.
- Confirm actual local transport rules, child-safety obligations, consent wording, privacy requirements and liability with qualified local professionals.
- Establish a real human emergency contact and operating procedure outside this software.

## Backup helper

```javascript
function backupDatabase() {
  var id = PropertiesService.getScriptProperties().getProperty('DB_ID');
  if (!id) throw new Error('Run setupDatabase() first.');
  var file = DriveApp.getFileById(id);
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  var copy = file.makeCopy('Exam-Saathi-DB-Backup-' + stamp);
  return copy.getUrl();
}
```

## License

Choose and add an appropriate license before accepting external contributions or commercial distribution.
