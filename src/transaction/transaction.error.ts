import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientBalanceError extends HttpException {
  constructor(accountId: string) {
    super(
      `Account ${accountId} has insufficient balance`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidAmountError extends HttpException {
  constructor() {
    super('Amount should be positive number', HttpStatus.BAD_REQUEST);
  }
}

export class AccountAlreadyExistsError extends HttpException {
  constructor(accountName: string) {
    super(
      `Account with name ${accountName} already exists`,
      HttpStatus.CONFLICT,
    );
  }
}

export class AccountNotFoundError extends HttpException {
  constructor(accountId: string) {
    super(`Account ${accountId} not found`, HttpStatus.NOT_FOUND);
  }
}
