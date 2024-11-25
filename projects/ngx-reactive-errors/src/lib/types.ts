import { AbstractControl } from "@angular/forms";
import { AbstractMessageManager } from "./utils/abstract-messages-manger";

export type ControlMap = Record<string, AbstractControl<any>>;

export type ReactiveErrorConfig = {
  errorMessages?: [string, (field: string, errorValue?: any) => string][];
  messageManagerType?: { new (): AbstractMessageManager }; 
};
