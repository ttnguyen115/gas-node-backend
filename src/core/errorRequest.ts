class ErrorRequest extends Error {
  private code: string | number;
  status: number;

  constructor(message: string, code: string | number, status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export default ErrorRequest;
