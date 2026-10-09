# Diagnostic Care — Role-Based Access Control (RBAC) Specification

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564 | **Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Security Standard:** Strict Server-Side Contextual Authorization (Never Trust Frontend Role Hiding)  

---

## 1. Principles of Access Control

1. **Least Privilege:** Every actor is granted only the permissions essential to perform their specific clinical, administrative, or patient role.
2. **Contextual Enforcement:** In addition to role checks, the server evaluates tenant context:
   - Does `user.organization_id == resource.organization_id`?
   - Does `assistant.doctor_association_id == appointment.doctor_association_id`?
   - Does `patient.id == prescription.patient_user_id`?
3. **No IDOR (Insecure Direct Object Reference):** Resource IDs passed in requests (e.g., `/api/v1/appointments/:id`) are validated against the caller's session permissions before returning data.
4. **Audit Logging:** Every administrative elevation, credential update, or sensitive patient record inspection triggers an immutable log entry.

---

## 2. Core Roles Definition

| Role Identifier | Description & Context Scope |
|---|---|
| `PATIENT` | Individual consumer booking services for self and authorized family members. |
| `DOCTOR` | Registered physician managing personal clinical profile, chamber schedules, appointments, and prescriptions. |
| `DOCTOR_ASSISTANT` | Sandboxed operational staff assisting a specific doctor at a specific branch. Restricted from financial or organization-wide data. |
| `DIAGNOSTIC_ADMIN` | Primary administrator of a Diagnostic Center organization; controls branches, test catalog, doctor chambers, billing, and staff. |
| `DIAGNOSTIC_STAFF` | Laboratory phlebotomist or front-desk clerk; handles test sample logging, report uploads, and patient intake. |
| `CLINIC_ADMIN` / `HOSPITAL_ADMIN` | Institutional administrators managing multi-specialty clinical departments and visiting physicians. |
| `CLINIC_STAFF` / `HOSPITAL_STAFF` | Floor managers, registration clerks, and ward coordinators. |
| `PHARMACY_ADMIN` / `PHARMACY_STAFF` | Manages medicine inventory and prescription dispensing workflows. |
| `AMBULANCE_PROVIDER` | Emergency transport dispatcher managing vehicle fleets and service calls. |
| `HOME_HEALTHCARE_PROVIDER` | Phlebotomists, nurses, and physiotherapists conducting home visits. |
| `SUPPORT_AGENT` | Diagnostic Care customer service desk resolving patient and provider inquiries via `01886748564`. |
| `OPERATIONS_MANAGER` | Platform operations supervisor reviewing provider applications and regional performance. |
| `FINANCE_MANAGER` | Financial officer auditing ledger entries, gateway settlements, and provider payouts. |
| `SUPER_ADMIN` | Master platform administrator with full governance authority. |

---

## 3. Permissions Matrix

| Permission Key | Description | PATIENT | DOCTOR | DOCTOR_ASSISTANT | DIAGNOSTIC_ADMIN | DIAGNOSTIC_STAFF | SUPER_ADMIN |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `appointments:create` | Book a doctor slot | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `appointments:read_own` | View own patient bookings | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `appointments:read_assigned` | View assigned doctor's bookings | ❌ | ✅ | ✅ (Sandboxed) | ✅ (Org-wide) | ❌ | ✅ |
| `queue:manage` | Call next token, mark checked-in/completed | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `prescriptions:create` | Write digital prescription | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `prescriptions:read` | View patient clinical prescription | ✅ (Own) | ✅ (Author/Authorized) | ❌ | ❌ | ❌ | ✅ (Audit log) |
| `tests:manage` | Create, edit diagnostic test catalog & prices | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `tests:book` | Book diagnostic test | ✅ | ❌ | ❌ | ❌ | ✅ (Desk) | ✅ |
| `reports:upload` | Upload verified PDF diagnostic report | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `reports:read` | Access sensitive diagnostic report | ✅ (Own) | ✅ (Authorized) | ❌ | ✅ (Org-wide) | ✅ (Org-wide) | ✅ (Audit log) |
| `org:manage_doctors` | Invite doctor, set chamber fees & schedules | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `org:manage_assistants` | Add or revoke doctor assistant credentials | ❌ | ✅ (Own) | ❌ | ✅ | ❌ | ✅ |
| `org:view_financials` | View center turnover, payout balances | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `platform:verify_provider`| Verify BMDC, trade license, approve listings | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `platform:config_pricing`| Modify B2B subscription fees and commissions | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. The Doctor Assistant Data Boundary Invariant

The Doctor Assistant represents a specialized operational role with strictly bounded data visibility:

```
ASSISTANT ACCESS PERMITTED:
- Current day's appointment list for assigned doctor
- Patient Name, Mobile Number, Age, Gender
- Assigned Token Number (e.g., Token 07)
- Appointment Status (Scheduled, Checked In, In Progress, Completed, Cancelled)
- Action: "Call Next Patient", "Mark Checked In", "Mark No-Show"

ASSISTANT ACCESS STRICTLY PROHIBITED (ENFORCED SERVER-SIDE):
- Patient past medical history, past prescriptions, or lab reports
- Other doctors' schedules, patient queues, or fees
- Diagnostic Center gross revenue, billing ledgers, or subscription invoices
- Diagnostic Center staff management or branch configuration
- Platform administration menus
```

### Server-Side Guard Logic (TypeScript Abstract)
```typescript
export async function authorizeAssistantQueueAccess(
  user: AuthenticatedUser,
  appointmentId: string
): Promise<boolean> {
  if (user.role === 'SUPER_ADMIN') return true;
  
  if (user.role === 'DOCTOR_ASSISTANT') {
    const assistant = await db.doctorAssistants.findFirst({
      where: { userId: user.id, isActive: true }
    });
    if (!assistant) return false;

    const appointment = await db.appointments.findUnique({
      where: { id: appointmentId },
      select: { doctorAssociationId: true }
    });

    return appointment?.doctorAssociationId === assistant.doctorAssociationId;
  }
  
  return false;
}
```
