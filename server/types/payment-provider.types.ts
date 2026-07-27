// ─────────────────────────────────────────────
// Paystack Payment Provider Types
// https://paystack.com/docs/api/
// ─────────────────────────────────────────────

// ── Payment Channels ──

export type PaymentChannel =
  | "card"
  | "bank"
  | "ussd"
  | "qr"
  | "mobile_money"
  | "bank_transfer"
  | "apple_pay";

// ── Transaction Initialize ──

export interface TransactionRequest {
  amount: number;
  email: string;
  channels?: PaymentChannel[];
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
  bearer?: "account" | "subaccount";
  subaccount?: string;
  plan?: string;
  invoice_limit?: number;
  split_code?: string;
  transaction_charge?: number;
}

export interface TransactionData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface TransactionResponse {
  status: boolean;
  message: string;
  data: TransactionData;
}

// ── Transaction Verify ──

export interface VerifyLog {
  start_time: number;
  time_spent: number;
  attempts: number;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: unknown[];
  history: {
    type: string;
    message: string;
    time: number;
  }[];
}

export interface VerifySource {
  source: string;
  type: string;
  identifier: string | null;
  entry_point?: string;
}

export interface VerifyAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
}

export interface VerifyCustomer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: Record<string, unknown> | null;
  risk_action: string;
  international_format_phone: string | null;
}

export interface VerifyTransactionData {
  id: number;
  domain: string;
  status: "success" | "failed" | "abandoned";
  reference: string;
  receipt_number: string | null;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: string | Record<string, unknown>;
  log: VerifyLog;
  fees: number;
  fees_split: unknown[] | null;
  authorization: VerifyAuthorization;
  customer: VerifyCustomer;
  plan: Record<string, unknown> | null;
  split: Record<string, unknown>;
  order_id: string | null;
  paidAt: string;
  createdAt: string;
  requested_amount: number | null;
  pos_transaction_data: unknown;
  source: VerifySource | null;
  fees_breakdown: unknown[] | null;
  connect: unknown;
  transaction_date: string;
  plan_object: Record<string, unknown>;
  subaccount: Record<string, unknown>;
}

export interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data: VerifyTransactionData;
}

// ── Charge Card ──

export interface ChargeCardRequest {
  authorization_code: string;
  email: string;
  amount: number;
  reference?: string;
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
  metadata?: Record<string, unknown>;
  channels?: "card" | "bank";
}

export interface ChargeCardResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: "success" | "failed" | "pending";
    reference: string;
    amount: number;
    currency: string;
    transaction_date: string;
    channel: string;
    gateway_response: string;
    message: string | null;
    metadata: string | Record<string, unknown>;
    ip_address: string | null;
    log: Record<string, unknown> | null;
    fees: number;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      email: string;
      customer_code: string;
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      metadata: Record<string, unknown> | null;
      risk_action: string;
    };
    plan: Record<string, unknown> | number | null;
  };
}

// ── Account Lookup / Banks ──

export interface AccountLookupResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
  };
}

export interface BankData {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean | null;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListBanksResponse {
  status: boolean;
  message: string;
  data: BankData[];
}

// ── Transfer Recipient ──

export interface TransferRecipientRequest {
  type: "nuban";
  name: string;
  account_number: string;
  bank_code: string;
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface TransferRecipientResponse {
  status: boolean;
  message: string;
  data: {
    active: boolean;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    currency: string;
    domain: string;
    id: number;
    integration: number;
    name: string;
    recipient_code: string;
    type: string;
    details: {
      authorization_code: string | null;
      account_number: string;
      account_name: string | null;
      bank_code: string;
      bank_name: string;
    };
  };
}

// ── Transfer ──

export interface TransferRequest {
  source: "balance";
  amount: number;
  recipient: string;
  reference: string;
  reason?: string;
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
}

export interface InitiateTransferData {
  transfersessionid: unknown[];
  transfertrials: unknown[];
  domain: string;
  amount: number;
  currency: string;
  reference: string;
  source: string;
  source_details: string | null;
  reason: string | null;
  status: "pending" | "success" | "failed" | "otp";
  failures: string | null;
  transfer_code: string;
  titan_code: string | null;
  transferred_at: string | null;
  id: number;
  integration: number;
  request: number;
  recipient: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransferResponse {
  status: boolean;
  message: string;
  data: InitiateTransferData;
}

export interface TransferRecipientDetails {
  domain: string;
  type: string;
  currency: string;
  name: string;
  details: {
    account_number: string;
    account_name: string | null;
    bank_code: string;
    bank_name: string;
  };
  description: string | null;
  metadata: Record<string, unknown> | null;
  recipient_code: string;
  active: boolean;
  id: number;
  integration: number;
}

export interface VerifyTransferData {
  amount: number;
  createdAt: string;
  currency: string;
  domain: string;
  failures: string | null;
  id: number;
  integration: number;
  reason: string | null;
  reference: string;
  source: string;
  source_details: string | null;
  status: "pending" | "success" | "failed" | "otp";
  titan_code: string | null;
  transfer_code: string;
  request: number;
  transferred_at: string | null;
  updatedAt: string;
  recipient: TransferRecipientDetails;
  session: { provider: string | null; id: string | null };
  fee_charged: number;
  fees_breakdown: unknown[] | null;
  gateway_response: string | null;
}

export interface RequeryTransferResponse {
  status: boolean;
  message: string;
  data: VerifyTransferData;
}

// ── Refund ──

export interface RefundRequest {
  transaction: string;
  amount?: number;
  currency?: string;
  customer_note?: string;
}

export interface RefundTransactionData {
  id: number;
  reference: string;
}

export interface RefundData {
  id: number;
  transaction: RefundTransactionData;
  integration: number;
  currency: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  refunded_at: string;
}

export interface RefundResponse {
  status: boolean;
  message: string;
  data: RefundData;
}

// ── Webhook ──

export interface WebHookTransferRecipientDetails {
  domain: string;
  type: string;
  currency: string;
  name: string;
  details: {
    account_number: string;
    account_name: string | null;
    bank_code: string;
    bank_name: string;
  };
  description: string | null;
  metadata: Record<string, unknown> | null;
  recipient_code: string;
  active: boolean;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebHookTransferData {
  amount: number;
  currency: string;
  domain: string;
  failures: string | null;
  id: number;
  integration: number;
  reason: string | null;
  reference: string;
  source: string;
  source_details: string | null;
  status: "pending" | "success" | "failed" | "otp";
  titan_code: string | null;
  transfer_code: string;
  request: number;
  transferred_at: string | null;
  createdAt: string;
  updatedAt: string;
  recipient: WebHookTransferRecipientDetails;
  session: { provider: string | null; id: string | null };
  fee_charged: number;
  fees_breakdown: unknown[] | null;
  gateway_response: string | null;
}

export interface ChargeSuccessPayload {
  event: "charge.success";
  data: VerifyTransactionData;
}

export interface TransferSuccessPayload {
  event: "transfer.success";
  data: WebHookTransferData;
}

export interface TransferFailedPayload {
  event: "transfer.failed";
  data: WebHookTransferData;
}

export interface TransferReversedPayload {
  event: "transfer.reversed";
  data: WebHookTransferData;
}

export interface GenericWebHookPayload {
  event: string;
  data: Record<string, unknown>;
}

export type WebHookPayload =
  | ChargeSuccessPayload
  | TransferSuccessPayload
  | TransferFailedPayload
  | TransferReversedPayload
  | GenericWebHookPayload;

export interface PaystackWebhookBody {
  event: string;
  data: {
    reference: string;
    status: string;
    amount: number;
    customer?: { email: string };
    metadata?: string | Record<string, unknown>;
    authorization?: {
      authorization_code: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      brand: string;
      reusable: boolean;
    };
    transaction?: { id: number; reference: string };
    id?: number;
    refunded_at?: string;
  };
}
