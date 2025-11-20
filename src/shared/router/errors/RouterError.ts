export class RouterError extends Error {
  constructor(message: string) {
    const formattedMessage = `[RouterError] ${message}`;
    super(formattedMessage);
  }
}
