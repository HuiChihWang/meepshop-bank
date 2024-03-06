export class TransactionResponse {
  amount: string;
  fromAccount: string;
  toAccount: string;
}

export class DepositRequest {
  amount: number;
  accountId: string;
}

export class WithDrawRequest {
  amount: number;
  accountId: string;
}

export class TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
}

export class TransferResponse {
  transactionId: string;
}
