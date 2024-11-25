import { InjectionToken } from "@angular/core";

export const ERROR_MESSAGE_PROVIDERS = new InjectionToken<
  [string, (field: string, errorValue?: any) => string][]
>("ERROR_MESSAGE_PROVIDERS");
