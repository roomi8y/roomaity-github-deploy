# User Verification Implementation Plan - Roomaity Platform

This document outlines the strategy and steps for implementing user verification features to enhance trust and safety on the Roomaity platform.

## 1. Proposed Verification Methods

| Method             | Purpose/Benefit                                                                 | Type        | "Verified Badge" Component? |
| :----------------- | :------------------------------------------------------------------------------ | :---------- | :-------------------------- |
| **Email Address**  | Confirms user owns the email; basic spam reduction; essential for communication. | Mandatory   | No (Standard expectation)   |
| **Phone Number**   | Adds a layer of identity; enables SMS notifications; reduces fake accounts.     | Optional    | Yes                         |
| **ID Document**    | Highest level of trust; verifies legal identity; crucial for safety-critical interactions. | Optional    | Yes (Strongest factor)      |
| **Social Profiles**| (e.g., LinkedIn, Facebook) Adds social proof; quick way to build some trust.   | Optional    | Yes (Partial)               |
| **Selfie/Liveness Check** | Used with ID Document to confirm the person submitting the ID is the owner. | Optional (with ID) | Part of ID Verification     |

**"Verified Badge" Criteria:**
A user could earn a "Verified Badge" by completing:
*   Phone Number Verification AND/OR
*   ID Document Verification (which might include a selfie/liveness check).
The badge could have levels or indicators of which verifications were completed (e.g., "Phone Verified", "ID Verified").

## 2. User Interface (UI) Integration

### 2.1. Registration Process (`register.html`)

*   **Email Verification:**
    *   After initial registration, the user is prompted: "A verification email has been sent to [user_email]. Please check your inbox and click the link or enter the code below."
    *   Input field: `[Enter Verification Code]`
    *   Button: `[Verify Email]`
    *   Link: `[Resend Code]`
    *   Status display: "Email verified successfully!" or "Invalid code. Please try again."

### 2.2. User Profile Page (`profile.html` or a dedicated "Verification Center" page linked from profile)

*   **Overall Status:**
    *   A section titled "Verification Status" or "Trust & Verification".
    *   Displays current overall verification level (e.g., "Basic", "Partially Verified", "Fully Verified").
    *   Shows the "Verified Badge" if criteria are met.

*   **Email Verification Section:**
    *   Status: "Email: [user_email] - Verified <i class='fas fa-check-circle text-success'></i>" or "Email: [user_email] - Not Verified <i class='fas fa-exclamation-circle text-warning'></i>"
    *   If not verified:
        *   Button: `[Verify Email]` (initiates sending OTP/link).
        *   Input field: `[Enter Email Code]` (appears after initiating).
        *   Button: `[Submit Code]`
        *   Link: `[Resend Code]`

*   **Phone Number Verification Section:**
    *   Status: "Phone: Verified <i class='fas fa-check-circle text-success'></i>" or "Phone: Not Verified <i class='fas fa-exclamation-circle text-warning'></i>"
    *   If not verified:
        *   Input field: `[Enter Phone Number (e.g., +966xxxxxxxxx)]`
        *   Button: `[Send Verification Code]`
        *   (After code sent) Input field: `[Enter SMS Code]`
        *   Button: `[Verify Phone]`
        *   Link: `[Resend Code]` / `[Change Phone Number]`
        *   Status display: "Phone verified!" or "Invalid code."

*   **ID Document Verification Section:**
    *   Status: "Identity: Verified <i class='fas fa-check-circle text-success'></i>", "Identity: Pending Review <i class='fas fa-clock text-info'></i>", "Identity: Not Verified <i class='fas fa-exclamation-circle text-warning'></i>", or "Identity: Verification Failed <i class='fas fa-times-circle text-danger'></i> - Reason: [e.g., document unclear]".
    *   If not verified:
        *   Introductory text: "Verify your identity to build more trust. You'll need to upload a government-issued ID (e.g., National ID, Passport, Driver's License)."
        *   Dropdown: `Select ID Type: [National ID] / [Passport] / [Driver's License]`
        *   File Input: `[Upload Front of ID]` (Styled button)
        *   File Input: `[Upload Back of ID (if applicable)]` (Styled button)
        *   (Optional, if liveness check is implemented) Button: `[Start Liveness Check]` (might open camera via browser API).
        *   Checkbox: `[I consent to Roomaity processing my ID for verification purposes according to the Privacy Policy.]`
        *   Button: `[Submit for Verification]`
        *   Progress/Status display: "Uploading...", "Processing...", "Submitted. Review may take 1-2 business days."

*   **Social Profile Verification Section (Example: LinkedIn):**
    *   Status: "LinkedIn: Connected - [Profile Name] <i class='fas fa-check-circle text-success'></i>" or "LinkedIn: Not Connected <i class='fas fa-exclamation-circle text-warning'></i>"
    *   If not connected:
        *   Button: `[Connect LinkedIn Account]` (initiates OAuth flow).
        *   Status display after connection or if connection fails.

### 2.3. Visual Indicators (Badges)

*   **On User Profiles (`profile.html`, search results, listing cards by owner):**
    *   A "Verified <i class='fas fa-shield-alt'></i>" or similar badge displayed next to the user's name or profile picture if they meet the criteria.
    *   Hovering over the badge could show a tooltip: "Verified by: Phone, ID Document".
*   **On Listings (`search.html`, `room-details.html`):**
    *   If the listing owner is verified, their badge can be displayed on the listing card/details page to increase trust for potential roommates.

## 3. Frontend JavaScript Logic (e.g., in `auth.js` or a new `verification.js`)

A new `verification.js` might be appropriate to keep concerns separate.

*   **`requestEmailVerification()`:**
    *   Sends a request to the backend to (re)send an email verification OTP/link.
    *   Handles UI updates (e.g., showing code input field, "code sent" message).
*   **`submitEmailOTP(otp)`:**
    *   Sends the OTP to the backend for validation.
    *   Handles success/error responses and updates UI accordingly.
*   **`requestPhoneVerification(phoneNumber)`:**
    *   Sends the phone number to the backend. Backend sends OTP via SMS.
    *   Updates UI to show OTP input field.
*   **`submitPhoneOTP(otp)`:**
    *   Sends the entered SMS OTP to the backend.
    *   Updates UI based on success/failure.
*   **`handleIdUpload(formData)`:**
    *   Takes ID type, file(s) (and potentially selfie data) and creates `FormData`.
    *   Uses `fetch` to POST data to the backend ID upload endpoint.
    *   Displays upload progress and handles server response (e.g., "Submitted for review", "Upload failed").
*   **`initiateSocialConnect(provider)`:** (e.g., `provider = 'linkedin'`)
    *   Redirects the user to the backend OAuth initiation endpoint for the specified provider.
*   **`checkSocialConnectionStatus(provider)`:**
    *   Called on page load (e.g., profile page) to fetch status of social connections from backend and update UI.
*   **`updateVerificationStatusUI(verificationData)`:**
    *   General function to update all verification sections on the profile page based on data fetched from the backend.

## 4. Backend API Endpoints

Extending `backend_roadmap.md` (sections for Auth and User Management).

*   **Email Verification:**
    *   **`POST /api/auth/request-email-verification`**
        *   Purpose: Requests a new email verification OTP/link for the authenticated user.
        *   Request: (Requires auth token)
        *   Response: `{ message: "Verification email sent." }` (200 OK) or error.
    *   **`POST /api/auth/verify-email`**
        *   Purpose: Verifies an email using an OTP or token.
        *   Request: `{ otp: "123456" }` or `{ verificationToken: "long_token_string" }` (Requires auth token)
        *   Response: `{ success: true, message: "Email verified successfully." }` (200 OK) or `{ success: false, error: "Invalid OTP/token." }` (400 Bad Request).
        *   Backend: Updates `users.is_email_verified` to `true`.

*   **Phone Number Verification:**
    *   **`POST /api/user/phone/request-otp`**
        *   Purpose: Sends an OTP to the provided phone number for verification.
        *   Request: `{ phoneNumber: "+9665XXXXXXXX" }` (Requires auth token)
        *   Response: `{ message: "OTP sent to phone." }` (200 OK) or error (e.g., invalid number format, rate limit exceeded).
        *   Backend: Generates OTP, stores it temporarily (with expiry), sends SMS.
    *   **`POST /api/user/phone/verify-otp`**
        *   Purpose: Verifies the SMS OTP.
        *   Request: `{ phoneNumber: "+9665XXXXXXXX", otp: "123456" }` (Requires auth token)
        *   Response: `{ success: true, message: "Phone verified." }` (200 OK) or `{ success: false, error: "Invalid OTP." }`.
        *   Backend: Validates OTP, updates `users.phone_number` and `users.is_phone_verified` to `true`.

*   **ID Document Verification:**
    *   **`POST /api/user/identity/upload-document`**
        *   Purpose: Uploads ID document(s) and optional selfie for verification.
        *   Request: `multipart/form-data` containing `idType` (e.g., "national_id", "passport"), `idFrontImage` (file), `idBackImage` (file, optional), `selfieImage` (file, optional). (Requires auth token)
        *   Response: `{ submissionId: "uuid", status: "pending_review", message: "Documents submitted for review." }` (202 Accepted) or error.
        *   Backend: Securely stores files, creates a verification task/record with `pending_review` status.
    *   **`GET /api/user/identity/status`**
        *   Purpose: Checks the status of ID verification for the authenticated user.
        *   Request: (Requires auth token)
        *   Response: `{ status: "pending_review" | "verified" | "rejected", reason?: "Document unclear" }` (200 OK).
    *   **(Admin/Internal) Endpoints for reviewing and updating ID verification status.**

*   **Social Profile Connections:**
    *   **`GET /api/auth/connect/{provider}`** (e.g., `/api/auth/connect/linkedin`)
        *   Purpose: Initiates OAuth flow for the specified provider.
        *   Request: (Requires auth token)
        *   Response: Redirects to provider's OAuth page.
    *   **`GET /api/auth/connect/{provider}/callback`**
        *   Purpose: Callback URL for the OAuth provider.
        *   Request: Contains provider-specific parameters (e.g., `code`, `state`).
        *   Response: Redirects user back to a specific frontend page (e.g., profile/verification page) with success/failure status.
        *   Backend: Handles token exchange, fetches basic profile info from provider, stores relevant info (e.g., provider_user_id, profile_url) associated with the Roomaity user, sets `is_linkedin_verified` etc.
    *   **`GET /api/user/social-connections`**
        *   Purpose: Fetches list of connected social accounts and their status for the authenticated user.
        *   Request: (Requires auth token)
        *   Response: `{ connections: [{ provider: "linkedin", username: "John Doe", profileUrl: "...", connectedAt: "timestamp" }, ...] }`

## 5. Security and Data Privacy Considerations

*   **ID Document Storage:**
    *   **Encryption at Rest:** All ID documents must be stored encrypted (e.g., AES-256) in a secure, non-publicly accessible storage (e.g., private S3 bucket, Azure Blob Storage with restricted access).
    *   **Encryption in Transit:** Use HTTPS for all API communication, including file uploads.
    *   **Access Control:** Strict access controls on who can view raw ID documents (only authorized admin personnel for manual review). Implement audit logs for access.
    *   **Temporary Storage:** If files are temporarily stored on the server during processing, ensure they are deleted promptly after transfer to secure storage.
    *   **Data Retention Policy:** Define how long ID documents are kept after verification (or rejection) and implement automated deletion according to this policy. Consider keeping only verification status, not the documents themselves, long-term.
*   **Selfie/Liveness Data:** Treat with the same level of security as ID documents. If using a third-party service for liveness checks, ensure they have strong security and privacy practices.
*   **Phone Numbers & Emails:** Store securely, hash OTPs if stored, and prevent enumeration attacks.
*   **Privacy Policy:**
    *   Clearly update the platform's Privacy Policy to explain:
        *   What verification data is collected.
        *   How it is used (for verification, trust building).
        *   How it is stored and protected.
        *   Data retention periods.
        *   User rights regarding their data.
    *   Obtain explicit user consent before collecting sensitive data like ID documents.
*   **Rate Limiting:**
    *   Apply rate limiting to API endpoints for requesting OTPs (email, phone) and submitting verification attempts to prevent abuse and brute-force attacks.
*   **Third-Party Services:** If using any third-party services for verification (e.g., ID verification AI, SMS gateway), vet their security and compliance (e.g., GDPR, CCPA).
*   **Secure Development Practices:** Follow OWASP guidelines for web application security.

## 6. High-Level Implementation Phases

1.  **Phase 1: Email Verification (Mandatory)**
    *   Implement UI elements in registration and profile.
    *   Develop frontend JS functions for requesting and submitting email OTP/token.
    *   Develop backend API endpoints for email verification.
    *   Update user schema with `is_email_verified`.
2.  **Phase 2: Phone Number Verification (Optional for Badge)**
    *   Add UI elements to profile page.
    *   Develop frontend JS for phone input and OTP submission.
    *   Develop backend API for sending and verifying SMS OTPs (integrate with an SMS gateway).
    *   Update user schema with `phone_number`, `is_phone_verified`.
    *   Introduce basic "Verified Badge" for users with phone verification.
3.  **Phase 3: ID Document Verification (Optional for Stronger Badge)**
    *   Design secure storage solution for documents.
    *   Add UI elements for ID type selection, file upload, and consent.
    *   Develop frontend JS for handling file uploads.
    *   Develop backend API for document upload and status checking.
    *   Develop an internal admin interface/process for reviewing submitted documents.
    *   Update user schema with `id_verification_status`, `id_type`, etc.
    *   Enhance "Verified Badge" for ID-verified users.
4.  **Phase 4: Selfie/Liveness Check (Optional Enhancement for ID Verification)**
    *   Integrate a liveness check solution (SDK or API).
    *   Update ID verification UI and backend flow to include this step.
5.  **Phase 5: Social Profile Connections (Optional for Badge)**
    *   Implement OAuth 2.0 flows for selected social providers (e.g., LinkedIn).
    *   Add UI elements for connecting/displaying social profiles.
    *   Update user schema for social connection details.
    *   Further refine "Verified Badge" logic.
6.  **Phase 6: Ongoing Monitoring & Refinement**
    *   Monitor verification success rates, identify friction points.
    *   Regularly review security measures.
    *   Adapt to new verification methods or regulations as needed.

This phased approach allows for progressive enhancement of platform trust and safety, starting with fundamental verifications and building up to more robust methods.Okay, I have created the user verification implementation plan.
