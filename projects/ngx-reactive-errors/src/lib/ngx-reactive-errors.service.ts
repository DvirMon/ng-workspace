import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
  Signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormGroup, AbstractControl, ValidationErrors } from "@angular/forms";
import {
  Observable,
  startWith,
  map,
  filter,
  distinctUntilChanged,
  shareReplay,
} from "rxjs";
import { ControlMap } from "./models/types";
import { MessageManager } from "./utils/messages-manger";

@Injectable({
  providedIn: "root",
})
export class NgxReactiveErrorsService {
  #messageManager = inject(MessageManager);

  #injector = inject(Injector);

  getErrors<TControl extends ControlMap = ControlMap>(
    form: FormGroup<TControl>
  ): { [K in keyof TControl]: Signal<string> } {
    return runInInjectionContext(this.#injector, () => this.#setErrors(form));
  }

  #setErrors<TControl extends ControlMap>(
    form: FormGroup<TControl>
  ): { [K in keyof TControl]: Signal<string> } {
    const controlErrorStreams: Partial<{
      [K in keyof TControl]: Signal<string>;
    }> = {};

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control) {
        controlErrorStreams[key as keyof TControl] = toSignal(
          this.#getControlMessageStream(control, key),
          { initialValue: "" }
        );
      }
    });

    return controlErrorStreams as { [K in keyof TControl]: Signal<string> };
  }

  #getControlMessageStream(
    control: AbstractControl,
    controlName: string
  ): Observable<string> {
    return control.statusChanges.pipe(
      startWith(control.status),
      map(() => control.errors),
      filter((errors) => errors !== null),
      distinctUntilChanged((prev, curr) => this.#areErrorsEqual(prev, curr)),
      map((errors) => this.#getFirstErrorMessage(controlName, errors)),
      shareReplay(1)
    );
  }

  #areErrorsEqual(
    prevErrors: ValidationErrors,
    currErrors: ValidationErrors
  ): boolean {
    return JSON.stringify(prevErrors) === JSON.stringify(currErrors);
  }

  #getFirstErrorMessage(
    controlName: string,
    errors: ValidationErrors | null
  ): string {
    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      return this.#messageManager.getErrorMessage(
        controlName,
        firstErrorKey,
        errors[firstErrorKey]
      );
    }
    return ""; // No error
  }
}
