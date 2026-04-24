declare module "@paystack/inline-js" {
  interface PaystackTransaction {
    reference: string;
    [key: string]: unknown;
  }

  interface PaystackError {
    message: string;
  }

  interface PaystackTransactionOptions {
    key: string;
    amount: number;
    email: string;
    currency?: string;
    firstName?: string;
    lastName?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
    onError?: (error: PaystackError) => void;
  }

  export default class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): void;
  }
}
