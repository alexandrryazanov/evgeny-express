export class Exception extends Error {
  public status: number;
  public details: string;
  constructor(status: number, message: string, details: string = "") {
    super(message);
    this.status = status;
    this.details = details;

    console.error({
      error: this.details,
      status: this.status,
      time: new Date().toString(),
    });
  }
}
