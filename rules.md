# Diagnostic Care — Rules and Engineering Standards

## 1. Product Rules

Diagnostic Care is a healthcare marketplace and provider management platform.

It must not present itself as a substitute for licensed medical professionals.

The platform must not make unsupported claims about treatment outcomes.

Healthcare providers remain responsible for their clinical decisions.

## 2. Provider Rules

Providers must have explicit verification states.

Credentials must not be presented as verified until the required verification process is complete.

Suspended providers must not appear as normally bookable.

Expired credentials should trigger the configured review workflow.

Provider supplied information must be distinguishable from platform verified information.

## 3. Patient Rules

Patients control their account information within the capabilities provided.

A patient's health information must never become publicly searchable.

Patients should be able to see meaningful information about how their sensitive data is used.

Family member access must be explicitly authorized.

## 4. Medical Data Rules

Medical records, prescriptions, reports, clinical notes, and similar information are sensitive.

Access must follow least privilege.

Every sensitive administrative access path should be auditable.

Do not place sensitive medical information in URLs, analytics event names, logs, error messages, or public search indexes.

## 5. Booking Rules

Every appointment must belong to a patient or authorized booking identity and a provider or organization.

A confirmed slot cannot be simultaneously confirmed for another appointment.

Cancellation and rescheduling rules must be explicit.

Payment status and appointment status must not be treated as the same state.

Booking operations must be idempotent.

## 6. Payment Rules

Never store raw payment card credentials.

Payment confirmation must come from a trusted payment provider mechanism.

Client side success screens are not sufficient evidence of payment.

Refunds must be recorded as transactions.

Every financial mutation should have an audit trail.

## 7. Review Rules

Reviews may be moderated for abuse, fraud, harassment, privacy violations, or prohibited content.

Staff must not edit legitimate reviews to create a desired reputation outcome.

Private medical information must not be requested in reviews.

Providers can respond without revealing private patient information.

## 8. Search Rules

Search results must not expose private health information.

Search ranking must not silently create misleading medical claims.

Sponsored or promoted results, if introduced, must be clearly distinguishable from organic results.

## 9. Notification Rules

Notifications must reveal the minimum information required.

Sensitive information should not be placed in SMS or lock screen previews unless the user explicitly enables such content.

Critical notifications must be retryable and observable.

## 10. File Upload Rules

Accept only permitted file types.

Validate MIME type and file signature where appropriate.

Apply file size limits.

Scan uploaded files when the threat model requires it.

Store private medical documents privately.

Never trust a filename as a security control.

## 11. Engineering Rules

TypeScript strict mode should be enabled.

Business logic should not be buried inside UI components.

Reusable business logic belongs in domain/application modules.

API validation must happen at the boundary.

Database migrations must be version controlled.

Production database changes must be backward compatible when rolling deployments are possible.

## 12. Next.js Rules

Prefer Server Components for data heavy non interactive UI.

Use Client Components only when browser interactivity requires them.

Do not expose secrets to client bundles.

Use server side authorization for protected operations.

Do not assume hiding a UI element is authorization.

Use appropriate error and loading boundaries.

Use optimized image handling.

## 13. Security Rules

Least privilege is mandatory.

Secrets must live in managed environment configuration.

Never commit secrets.

Never log passwords, tokens, session cookies, payment secrets, or unnecessary medical information.

Rate limit authentication and sensitive endpoints.

Administrative operations require stronger authentication and authorization.

## 14. API Rules

Validate all request bodies.

Validate query parameters.

Use consistent status codes.

Return safe error messages.

Use request IDs for tracing.

Use idempotency keys for operations where retries could cause duplicate effects.

## 15. Database Rules

Foreign keys should protect important relationships.

Indexes must be based on actual access patterns.

Sensitive fields should not be queried unnecessarily.

Use transactions for multi step state changes requiring atomicity.

Do not use soft deletion everywhere automatically. Choose based on legal, operational, and audit requirements.

## 16. Audit Rules

Audit security sensitive operations including:

Login security events
Credential changes
Role changes
Provider verification
Sensitive record access
Prescription changes
Report publication
Payment changes
Refunds
Administrative moderation
Account deletion

Audit logs should be append oriented and protected from ordinary users.

## 17. UX Rules

The user should always understand:

What is happening
What action is required
Whether an action succeeded
Whether an appointment is confirmed
What a price includes
Whether a provider is verified
How to cancel or reschedule

Avoid dark patterns.

Do not create artificial urgency for healthcare purchases.

## 18. Emergency Rules

The platform must clearly distinguish ordinary marketplace requests from emergencies.

If emergency functionality is provided, the interface must clearly communicate limitations and appropriate emergency resources for the applicable geography.

## 19. AI Rules

AI must not be represented as a licensed doctor.

AI generated health content must be clearly identified when shown to patients.

AI must not autonomously diagnose patients or make high impact clinical decisions in the initial platform.

Human review is required for high risk workflows.

## 20. Release Rules

No production release without:

Build passing
Type checking passing
Critical tests passing
Database migration reviewed
Security sensitive changes reviewed
Environment variables verified
Rollback path considered

## 21. Documentation Rule

Every major architectural decision must be documented.

Every important domain workflow must have:

Purpose
Inputs
State transitions
Authorization
Failure cases
Audit requirements

## 22. Change Rule

The six core documents are the project source of truth.

When a major decision changes:

Update the relevant document
Record the reason
Record the date
Identify affected modules
Update implementation tasks
