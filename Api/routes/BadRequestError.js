export default class BadRequestError extends Error {
  static Name = "BadRequestError";
  constructor(message) {
    super(message);
    this.message = message;
    this.name = BadRequestError.Name;
  }
}
