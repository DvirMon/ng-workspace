import { inject, Injectable } from "@angular/core";
import { AbstractMessageManager } from "./abstract-messages-manger";
import { ERROR_MESSAGE_PROVIDERS } from "../tokens";

@Injectable({
  providedIn: "root",
})
export class MessageManagerService extends AbstractMessageManager {
  #errorMessagesLookup = new Map<
    string,
    (name: string, errorValue?: any) => string
  >();

  additionalMessages = inject(ERROR_MESSAGE_PROVIDERS, { optional: true });

  constructor() {
    super();

    const messages = this.additionalMessages ?? [];

    this.#addDefaultMessages();

    this.updateErrorMessages(messages);
  }

  getErrorMessage(name: string, errorKey: string, errorValue?: any): string {
    const messageFn = this.#errorMessagesLookup.get(errorKey);
    return messageFn
      ? messageFn(name, errorValue)
      : errorValue || `${this.formatFieldName(name)} is invalid.`;
  }

  updateErrorMessages(
    messages: [string, (name: string, errorValue?: any) => string][]
  ): void {
    messages.forEach(([key, messageFn]) => {
      this.#errorMessagesLookup.set(key, messageFn);
    });
  }

  #addDefaultMessages(): void {
    this.#errorMessagesLookup.set(
      "required",
      (name) => `${this.formatFieldName(name)} is required.`
    );
    this.#errorMessagesLookup.set(
      "minlength",
      (name, errorValue) =>
        `${this.formatFieldName(name)} must be at least ${
          errorValue.requiredLength
        } characters.`
    );
    this.#errorMessagesLookup.set(
      "maxlength",
      (name, errorValue) =>
        `${this.formatFieldName(name)} cannot exceed ${
          errorValue.requiredLength
        } characters.`
    );
    this.#errorMessagesLookup.set(
      "pattern",
      (name) =>
        `${this.formatFieldName(name)} does not match the required pattern.`
    );
  }

  protected formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
