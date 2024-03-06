export class CreateAccountRequest {
  readonly name: string;
}

export class AccountResponse {
  readonly accountId: string;
  readonly name: string;
  readonly balance: number;
}