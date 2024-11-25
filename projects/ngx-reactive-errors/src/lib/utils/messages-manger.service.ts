import { inject, Injectable } from "@angular/core";
import { AbstractMessageManager } from "./abstract-messages-manger";
import { ERROR_MESSAGE_PROVIDERS } from "../tokens";

@Injectable({
  providedIn: "root",
})
export class MessageManagerService extends AbstractMessageManager {
  #errorMessagesLookup = new Map<
    string,
    (field: string, errorValue?: any) => string
  >();

  additionalMessages = inject(ERROR_MESSAGE_PROVIDERS, { optional: true });

  constructor() {
    super();

    const messages = this.additionalMessages ?? [];

    this.#addDefaultMessages();

    this.updateErrorMessages(messages);
  }

  getErrorMessage(field: string, errorKey: string, errorValue?: any): string {
    const messageFn = this.#errorMessagesLookup.get(errorKey);
    return messageFn
      ? messageFn(field, errorValue)
      : `${this.formatFieldName(field)} is invalid.`;
  }

  updateErrorMessages(
    messages: [string, (field: string, errorValue?: any) => string][]
  ): void {
    messages.forEach(([key, messageFn]) => {
      this.#errorMessagesLookup.set(key, messageFn);
    });
  }

  #addDefaultMessages(): void {
    this.#errorMessagesLookup.set(
      "required",
      (field) => `${this.formatFieldName(field)} is required.`
    );
    this.#errorMessagesLookup.set(
      "minlength",
      (field, errorValue) =>
        `${this.formatFieldName(field)} must be at least ${
          errorValue.requiredLength
        } characters.`
    );
    this.#errorMessagesLookup.set(
      "maxlength",
      (field, errorValue) =>
        `${this.formatFieldName(field)} cannot exceed ${
          errorValue.requiredLength
        } characters.`
    );
    this.#errorMessagesLookup.set(
      "pattern",
      (field) =>
        `${this.formatFieldName(field)} does not match the required pattern.`
    );
  }

  protected formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
