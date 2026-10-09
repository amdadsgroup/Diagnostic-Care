# Diagnostic Care — API Architecture & Specification

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564 | **Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Base URL:** `/api/v1`  
**Data Format:** JSON (UTF-8)  
**Standard Response Envelope:** `{ success: boolean, data?: T, error?: ApiError, meta?: PaginationMeta }`  

---

## 1. Authentication & Identity Endpoints

### `POST /api/v1/auth/register`
Creates a new patient account with Bangladesh phone number.
- **Request Body:**
  ```json
  {
    "phone": "01711000000",
    "fullName": "Rahim Ahmed",
    "password": "SecurePassword123!",
    "age": 32,
    "gender": "MALE",
    "languagePreference": "bn"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid-v4", "phone": "01711000000", "fullName": "Rahim Ahmed", "primaryRole": "PATIENT" },
      "token": "jwt-token"
    }
  }
  ```

### `POST /api/v1/auth/login`
Authenticates via phone/email and password. Returns session token and user profile.

---

## 2. Doctor Discovery & Chamber Schedules

### `GET /api/v1/doctors`
Search verified doctors across Bangladesh with filters.
- **Query Parameters:** `q`, `specialization`, `divisionId`, `districtId`, `upazilaId`, `day`, `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "doc-uuid",
        "name": "Dr. Anisur Rahman",
        "title": "Dr.",
        "specialization": "Cardiologist",
        "qualifications": "MBBS, FCPS (Cardiology)",
        "experienceYears": 12,
        "bmdcNumber": "A-45892",
        "isVerified": true,
        "chambers": [
          {
            "organizationName": "ABC Diagnostic Center",
            "branchName": "Moulvibazar Main Branch",
            "consultationFee": 800,
            "nextAvailableDate": "2026-10-06"
          }
        ]
      }
    ]
  }
  ```

### `GET /api/v1/doctors/:id/slots?date=YYYY-MM-DD&branchId=uuid`
Returns real-time slot availability for a doctor's chamber on a specific date.
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "date": "2026-10-06",
      "capacity": 16,
      "bookedCount": 4,
      "isFull": false,
      "slots": [
        { "id": "slot-1", "startTime": "08:00", "endTime": "08:15", "status": "CONFIRMED" },
        { "id": "slot-2", "startTime": "08:15", "endTime": "08:30", "status": "HELD", "holdExpiresInSec": 140 },
        { "id": "slot-3", "startTime": "08:30", "endTime": "08:45", "status": "AVAILABLE" }
      ]
    }
  }
  ```

---

## 3. Real-Time Slot Booking & Queue Endpoints

### `POST /api/v1/appointments/hold`
Atomically holds a slot for 5 minutes during patient checkout.
- **Request Body:** `{ "slotId": "slot-uuid" }`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "slotId": "slot-uuid",
      "status": "HELD",
      "holdExpiresAt": "2026-10-05T18:05:00Z",
      "remainingSeconds": 300
    }
  }
  ```
- **Error (409 Conflict):**
  ```json
  {
    "success": false,
    "error": { "code": "SLOT_ALREADY_HELD", "message": "This slot is currently being booked by another patient." }
  }
  ```

### `POST /api/v1/appointments/confirm`
Finalizes appointment, creates booking code, and issues token.
- **Request Body:**
  ```json
  {
    "slotId": "slot-uuid",
    "patientName": "Kawsar Mia",
    "patientPhone": "01886748564",
    "patientAge": 28,
    "patientGender": "MALE",
    "paymentMethod": "CASH_AT_DESK"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "bookingCode": "DC-2026-8921",
      "tokenNumber": 5,
      "status": "CONFIRMED",
      "doctorName": "Dr. Anisur Rahman",
      "branch": "ABC Diagnostic Center, Moulvibazar",
      "appointmentTime": "2026-10-06 08:30 AM",
      "supportHelpline": "01886748564"
    }
  }
  ```

### `POST /api/v1/queues/call-next`
Called by Doctor or Doctor Assistant to advance the chamber queue.
- **Request Body:** `{ "doctorAssociationId": "assoc-uuid", "date": "2026-10-06" }`
- **Response:** `{ "success": true, "data": { "currentToken": 4, "totalTokens": 16 } }`

---

## 4. Diagnostic Tests & Secure Report Endpoints

### `GET /api/v1/diagnostics/tests`
Searches diagnostic tests (CBC, Lipid Profile, USG, X-Ray) with price comparison and preparation guidelines.

### `POST /api/v1/diagnostics/reports/upload`
Authorized lab technician uploads verified PDF diagnostic report.
- **Payload:** Multipart form data (`bookingId`, `testId`, `file`, `technologistName`)

### `GET /api/v1/diagnostics/reports/:id/download-url`
Generates a 15-minute cryptographically signed download URL for the authorized patient or prescribing physician.
