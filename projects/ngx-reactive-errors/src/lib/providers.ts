import { Provider } from "@angular/core";
import { NgxReactiveErrorsService } from "./ngx-reactive-errors.service";
import { ERROR_MESSAGE_PROVIDERS } from "./tokens";
import { ReactiveErrorConfig } from "./types";
import { AbstractMessageManager } from "./utils/abstract-messages-manger";
import { MessageManagerService } from "./utils/messages-manger.service";

function provideErrorMessage(
  value?: [string, (field: string, errorValue?: any) => string][]
): Provider {
  return {
    provide: ERROR_MESSAGE_PROVIDERS,
    useValue: value,
  };
}

export function provideFormErrorService(
  options: ReactiveErrorConfig = {
    errorMessages: [],
    messageManagerType: MessageManagerService,
  }
): Provider {
  return [
    NgxReactiveErrorsService,
    provideErrorMessage(options.errorMessages),
    {
      provide: AbstractMessageManager,
      useClass: options.messageManagerType || MessageManagerService,
    },
  ];
}
