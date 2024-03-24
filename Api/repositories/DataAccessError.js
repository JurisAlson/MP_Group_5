export default class DataAccessError extends Error {
  static Name = "DataAccessError";
  constructor(message) {
    super(message);
    this.message = message;
    this.name = DataAccessError.Name;
  }
}
