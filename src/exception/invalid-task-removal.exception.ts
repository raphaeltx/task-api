export class InvalidTaskRemovalException extends Error {
  constructor(message: string) {
    super(`Invalid task removal: ${message}`);
    this.name = "InvalidTaskRemovalException";
  }
}