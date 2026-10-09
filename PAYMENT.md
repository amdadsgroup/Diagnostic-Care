# Diagnostic Care — Payment Architecture & Financial Ledger Specification

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564 | **Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Currency:** Bangladeshi Taka (BDT / ৳)  
**Supported Payment Providers:** bKash, Nagad, Rocket, SSLCommerz/Cards, Cash-at-Chamber  

---

## 1. Bangladesh Payment Gateway Abstraction

Payment gateways in Bangladesh frequently encounter network timeout spikes and localized downtime. Diagnostic Care implements a resilient **Payment Gateway Abstraction Adapter**:

```typescript
export interface PaymentGatewayAdapter {
  createPaymentIntent(params: {
    referenceId: string;
    amount: number;
    currency: 'BDT';
    customerPhone: string;
    callbackUrl: string;
  }): Promise<{ gatewayUrl: string; gatewayTransactionId: string }>;

  verifyPaymentWebhook(payload: any, signature: string): Promise<{
    isVerified: boolean;
    gatewayTransactionId: string;
    amount: number;
    status: 'PAID' | 'FAILED';
  }>;

  queryPaymentStatus(gatewayTransactionId: string): Promise<PaymentStatusResult>;
  initiateRefund(params: { gatewayTransactionId: string; amount: number; reason: string }): Promise<RefundResult>;
}
```

Never rely on client-side redirect URLs to mark payments as `PAID`. All status transitions require cryptographically verified server-to-server webhooks or backend polling reconciliation.

---

## 2. Immutable Double-Entry Financial Ledger

Every monetary transaction creates balanced Debit and Credit entries in `ledger_entries`. Historical financial entries are strictly immutable.

### Ledger Accounts Chart
1. `GATEWAY_CLEARING`: Cash transit account with bKash/Nagad/SSLCommerz.
2. `PROVIDER_PAYABLE`: Payout balance owed to the Diagnostic Center or Doctor.
3. `PLATFORM_COMMISSION`: Diagnostic Care earned marketplace commission.
4. `REFUND_PAYABLE`: Escrowed balance pending patient refund.
5. `SUBSCRIPTION_REVENUE`: Diagnostic Center monthly/annual SaaS subscription fees.

### Scenario A: Patient Books CBC Diagnostic Test (৳500, Commission 5% = ৳25)
```
Entry 1 (Cash Inflow):
  DEBIT:  GATEWAY_CLEARING           ৳500.00
  CREDIT: PROVIDER_PAYABLE           ৳475.00  (Diagnostic Center Balance)
  CREDIT: PLATFORM_COMMISSION        ৳ 25.00  (Diagnostic Care Revenue)
```

### Scenario B: Patient Cancels Test Before Sample Collection (Full Refund)
```
Entry 2 (Compensating Reversal):
  DEBIT:  PROVIDER_PAYABLE           ৳475.00
  DEBIT:  PLATFORM_COMMISSION        ৳ 25.00
  CREDIT: REFUND_PAYABLE             ৳500.00
Entry 3 (Disbursement to Patient Wallet):
  DEBIT:  REFUND_PAYABLE             ৳500.00
  CREDIT: GATEWAY_CLEARING           ৳500.00
```

---

## 3. Commission Engine

Platform commission is calculated dynamically at the time of booking confirmation based on hierarchical rules:

1. **Rule Priority:**
   - Provider-Specific Agreement Override (if contracted with a high-volume diagnostic center in Moulvibazar).
   - Category-Specific Rate (e.g., Doctor Consultations = 5%, High-end MRI/CT Scans = 3%).
   - Platform Default Commission (Configured in system settings).

2. **Calculation Formula:**
   $$\text{CommissionAmount} = \text{round}\left(\text{GrossAmount} \times \frac{\text{RatePercent}}{100}, 2\right)$$
   $$\text{ProviderPayable} = \text{GrossAmount} - \text{CommissionAmount}$$

---

## 4. Provider Payout & Settlement Flow

- Diagnostic Centers review their accrued `PROVIDER_PAYABLE` balance inside the Provider Billing Dashboard.
- Payouts are scheduled weekly or upon reaching minimum threshold (e.g., ৳1,000) directly to the Diagnostic Center's registered institutional bank account or commercial bKash Merchant wallet.
- Admin verifies and releases payouts with dual-authorization review.
