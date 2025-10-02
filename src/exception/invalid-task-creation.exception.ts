export class InvalidTaskCreationException extends Error {
  constructor(message: string) {
    super(`Invalid task creation: ${message}`);
    this.name = "InvalidTaskCreationException";
  }
}
