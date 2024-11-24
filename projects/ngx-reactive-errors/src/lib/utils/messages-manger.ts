export abstract class MessageManager {
  abstract getErrorMessage(
    field: string,
    errorKey: string,
    errorValue?: any
  ): string;
}
