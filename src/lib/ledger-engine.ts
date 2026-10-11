/**
 * Diagnostic Care — Bangladesh Payment Engine & Double-Entry Financial Ledger (Phase 5)
 * Architectural Invariant: IMMUTABLE DOUBLE-ENTRY ACCOUNTING.
 * Every financial movement generates equal and balanced Debit and Credit records.
 * Sum of Debits MUST strictly equal Sum of Credits for every transaction.
 */

export type AccountType =
  | 'ASSET_BKASH_ESCROW'
  | 'ASSET_NAGAD_ESCROW'
  | 'ASSET_CASH_RECEIVABLE'
  | 'LIABILITY_PROVIDER_PAYABLE'
  | 'LIABILITY_PATIENT_REFUND'
  | 'REVENUE_PLATFORM_COMMISSION'
  | 'REVENUE_B2B_SUBSCRIPTION';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  account: AccountType;
  direction: 'DEBIT' | 'CREDIT';
  amount: number; // in BDT
  currency: 'BDT';
  description: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingCode: string;
  gateway: 'BKASH' | 'NAGAD' | 'CASH_AT_DESK' | 'SSLCOMMERZ';
  gatewayTransactionId?: string;
  amount: number;
  providerEarnings: number;
  commissionAmount: number;
  currency: 'BDT';
  status: 'INITIATED' | 'COMPLETED' | 'REFUNDED' | 'FAILED';
  patientPhone: string;
  organizationId: string;
  organizationName: string;
  createdAt: string;
  completedAt?: string;
}

export interface B2BSubscription {
  organizationId: string;
  organizationName: string;
  tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE';
  monthlyFee: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  lastPaymentTransactionId?: string;
}

class LedgerEngine {
  private ledgerEntries: LedgerEntry[] = [];
  private transactions: Map<string, PaymentTransaction> = new Map();
  private subscriptions: Map<string, B2BSubscription> = new Map();

  constructor() {
    // Production clean: Zero seed ledger transactions. Entries are generated from live payments.
  }

  /**
   * Process a payment and generate balanced double-entry ledger entries.
   * Splits amount: 90% Provider Payable, 10% Platform Commission.
   */
  public processPayment(params: {
    bookingCode: string;
    gateway: 'BKASH' | 'NAGAD' | 'CASH_AT_DESK' | 'SSLCOMMERZ';
    amount: number;
    patientPhone: string;
    organizationId: string;
    organizationName: string;
    gatewayTransactionId?: string;
  }): { transaction: PaymentTransaction; ledgerEntries: LedgerEntry[] } {
    const { bookingCode, gateway, amount, patientPhone, organizationId, organizationName, gatewayTransactionId } = params;

    const commissionRate = 0.10; // 10% Platform Take Rate
    const commissionAmount = Math.round(amount * commissionRate);
    const providerEarnings = amount - commissionAmount;

    const txId = `tx-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const transaction: PaymentTransaction = {
      id: txId,
      bookingCode,
      gateway,
      gatewayTransactionId: gatewayTransactionId || `${gateway.slice(0, 3)}${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount,
      providerEarnings,
      commissionAmount,
      currency: 'BDT',
      status: 'COMPLETED',
      patientPhone,
      organizationId,
      organizationName,
      createdAt: now,
      completedAt: now,
    };

    this.transactions.set(txId, transaction);

    // Determine Escrow Account based on Gateway
    const escrowAccount: AccountType =
      gateway === 'BKASH'
        ? 'ASSET_BKASH_ESCROW'
        : gateway === 'NAGAD'
        ? 'ASSET_NAGAD_ESCROW'
        : 'ASSET_CASH_RECEIVABLE';

    // DOUBLE ENTRY ACCOUNTING:
    // 1. DEBIT: Asset Escrow (Total Inflow) = amount
    // 2. CREDIT: Liability Provider Payable = providerEarnings (90%)
    // 3. CREDIT: Revenue Platform Commission = commissionAmount (10%)
    const entries: LedgerEntry[] = [
      {
        id: `leg-${Date.now()}-1`,
        transactionId: txId,
        account: escrowAccount,
        direction: 'DEBIT',
        amount,
        currency: 'BDT',
        description: `${gateway} Collection for Booking #${bookingCode}`,
        createdAt: now,
      },
      {
        id: `leg-${Date.now()}-2`,
        transactionId: txId,
        account: 'LIABILITY_PROVIDER_PAYABLE',
        direction: 'CREDIT',
        amount: providerEarnings,
        currency: 'BDT',
        description: `Provider earnings for ${organizationName} (Booking #${bookingCode})`,
        createdAt: now,
      },
      {
        id: `leg-${Date.now()}-3`,
        transactionId: txId,
        account: 'REVENUE_PLATFORM_COMMISSION',
        direction: 'CREDIT',
        amount: commissionAmount,
        currency: 'BDT',
        description: `Diagnostic Care 10% Platform Take Rate (Booking #${bookingCode})`,
        createdAt: now,
      },
    ];

    // INVARIANT CHECK: Sum of Debits MUST equal Sum of Credits
    const totalDebits = entries.filter((e) => e.direction === 'DEBIT').reduce((acc, e) => acc + e.amount, 0);
    const totalCredits = entries.filter((e) => e.direction === 'CREDIT').reduce((acc, e) => acc + e.amount, 0);

    if (totalDebits !== totalCredits) {
      throw new Error(`CRITICAL_LEDGER_ERROR: Unbalanced ledger entries! Debits: ${totalDebits}, Credits: ${totalCredits}`);
    }

    this.ledgerEntries.push(...entries);

    return { transaction, ledgerEntries: entries };
  }

  /**
   * Process B2B Subscription Payment (BDT 200, 500, or 2,000)
   */
  public processSubscription(params: {
    organizationId: string;
    organizationName: string;
    tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE';
    gateway: 'BKASH' | 'NAGAD';
    patientPhone: string;
  }): { subscription: B2BSubscription; transaction: PaymentTransaction } {
    const { organizationId, organizationName, tier, gateway, patientPhone } = params;

    const feeMap = {
      BASIC: 200,
      STANDARD: 500,
      ENTERPRISE: 2000,
    };
    const amount = feeMap[tier] || 500;

    const txId = `tx-sub-${Date.now()}`;
    const now = new Date().toISOString();

    const transaction: PaymentTransaction = {
      id: txId,
      bookingCode: `SUB-${tier}-${organizationId.slice(0, 4)}`,
      gateway,
      gatewayTransactionId: `${gateway.slice(0, 3)}SUB${Math.floor(100000 + Math.random() * 900000)}`,
      amount,
      providerEarnings: 0,
      commissionAmount: amount, // 100% platform SaaS revenue
      currency: 'BDT',
      status: 'COMPLETED',
      patientPhone,
      organizationId,
      organizationName,
      createdAt: now,
      completedAt: now,
    };

    this.transactions.set(txId, transaction);

    const escrowAccount: AccountType = gateway === 'BKASH' ? 'ASSET_BKASH_ESCROW' : 'ASSET_NAGAD_ESCROW';

    // Balanced Double Entry for Subscription
    const entries: LedgerEntry[] = [
      {
        id: `leg-sub-${Date.now()}-1`,
        transactionId: txId,
        account: escrowAccount,
        direction: 'DEBIT',
        amount,
        currency: 'BDT',
        description: `B2B ${tier} SaaS Subscription Collection from ${organizationName}`,
        createdAt: now,
      },
      {
        id: `leg-sub-${Date.now()}-2`,
        transactionId: txId,
        account: 'REVENUE_B2B_SUBSCRIPTION',
        direction: 'CREDIT',
        amount,
        currency: 'BDT',
        description: `Diagnostic Care B2B Subscription Revenue (${tier} Plan)`,
        createdAt: now,
      },
    ];

    this.ledgerEntries.push(...entries);

    // Update Subscription State (valid for 30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const subscription: B2BSubscription = {
      organizationId,
      organizationName,
      tier,
      monthlyFee: amount,
      status: 'ACTIVE',
      expiresAt,
      lastPaymentTransactionId: txId,
    };

    this.subscriptions.set(organizationId, subscription);

    return { subscription, transaction };
  }

  public getAllLedgerEntries(): LedgerEntry[] {
    return [...this.ledgerEntries];
  }

  public getAllTransactions(): PaymentTransaction[] {
    return Array.from(this.transactions.values());
  }

  public getSubscription(organizationId: string): B2BSubscription | undefined {
    return this.subscriptions.get(organizationId);
  }

  /**
   * Get unsettled payable balance for a given provider organization
   */
  public getProviderPayableBalance(organizationId: string): number {
    const providerEntries = this.ledgerEntries.filter(
      (e) => e.account === 'LIABILITY_PROVIDER_PAYABLE' && e.description.includes(organizationId)
    );
    const credits = providerEntries.filter((e) => e.direction === 'CREDIT').reduce((s, e) => s + e.amount, 0);
    const debits = providerEntries.filter((e) => e.direction === 'DEBIT').reduce((s, e) => s + e.amount, 0);
    return credits - debits;
  }

  /**
   * Process an automated payout disbursement to a provider (settling liability)
   */
  public processPayout(params: {
    organizationId: string;
    organizationName: string;
    amount: number;
    payoutChannel: 'BKASH_MERCHANT' | 'BANK_TRANSFER';
    destinationAccount: string;
  }): { success: boolean; payoutTxId: string; ledgerEntries: LedgerEntry[] } {
    const { organizationId, organizationName, amount, payoutChannel, destinationAccount } = params;
    const txId = `tx-payout-${Date.now()}`;
    const now = new Date().toISOString();

    // 1. DEBIT: Liability Provider Payable (Decreasing what platform owes provider)
    // 2. CREDIT: Asset Escrow (Cash outflows from bank or escrow)
    const entries: LedgerEntry[] = [
      {
        id: `leg-payout-${Date.now()}-1`,
        transactionId: txId,
        account: 'LIABILITY_PROVIDER_PAYABLE',
        direction: 'DEBIT',
        amount,
        currency: 'BDT',
        description: `Disbursement payout to ${organizationName} [${organizationId}] via ${payoutChannel} (${destinationAccount})`,
        createdAt: now,
      },
      {
        id: `leg-payout-${Date.now()}-2`,
        transactionId: txId,
        account: payoutChannel === 'BKASH_MERCHANT' ? 'ASSET_BKASH_ESCROW' : 'ASSET_CASH_RECEIVABLE',
        direction: 'CREDIT',
        amount,
        currency: 'BDT',
        description: `Disbursement transfer to ${destinationAccount} for ${organizationName}`,
        createdAt: now,
      },
    ];

    this.ledgerEntries.push(...entries);
    return { success: true, payoutTxId: txId, ledgerEntries: entries };
  }

  /**
   * Ledger Audit Verification: Computes overall system debits vs credits
   */
  public verifyLedgerIntegrity(): {
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    entryCount: number;
  } {
    const totalDebits = this.ledgerEntries
      .filter((e) => e.direction === 'DEBIT')
      .reduce((acc, e) => acc + e.amount, 0);

    const totalCredits = this.ledgerEntries
      .filter((e) => e.direction === 'CREDIT')
      .reduce((acc, e) => acc + e.amount, 0);

    return {
      totalDebits,
      totalCredits,
      isBalanced: totalDebits === totalCredits,
      entryCount: this.ledgerEntries.length,
    };
  }
}

export const ledgerEngine = new LedgerEngine();
