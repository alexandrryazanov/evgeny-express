import { Exception } from "./index";

export class BadRequestException extends Exception {
  constructor(details: string = "") {
    super(400, "Bad request", details);
  }
}
