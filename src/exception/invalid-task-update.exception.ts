export class InvalidTaskUpdateException extends Error {
  constructor(message: string) {
    super(`Invalid task. ${message}`);
    this.name = "InvalidTaskUpdateException";
  }
}
