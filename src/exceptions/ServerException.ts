import { Exception } from "./index";

export class ServerException extends Exception {
  constructor(details: string = "") {
    super(500, "Server error", details);
  }
}
