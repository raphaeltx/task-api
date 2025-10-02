export class InvalidTaskUpdateException extends Error {
  constructor(message: string) {
    super(`Invalid task update. ${message}`);
    this.name = "InvalidTaskUpdateException";
  }
}   