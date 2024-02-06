import { Exception } from "./index";

export class NotFoundException extends Exception {
  constructor(details: string = "") {
    super(404, "Not found", details);
  }
}
