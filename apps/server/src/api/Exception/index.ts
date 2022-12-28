class BaseException extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class BadRequestException extends BaseException {
  constructor(message?: string) {
    // Assign default exception message
    if (!message) {
      message = "Badrequest made";
    }
    super(message);
  }
}
