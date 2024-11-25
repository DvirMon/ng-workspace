import { inject, Injector, runInInjectionContext, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
} from "rxjs";
import { ControlMap } from "./types";
import { AbstractMessageManager } from "./utils/abstract-messages-manger";

export class NgxReactiveErrorsService {
  #messageManager = inject(AbstractMessageManager);
  #injector = inject(Injector);

  getErrorsAsObs<TControl extends ControlMap = ControlMap>(
    form: FormGroup<TControl>
  ): { [K in keyof TControl]: Observable<string> } {
    return this.#setErrors(form);
  }

  getErrorsAsSignal<TControl extends ControlMap = ControlMap>(
    form: FormGroup<TControl>
  ): { [K in keyof TControl]: Signal<string> } {
    return runInInjectionContext(this.#injector, () => {
      const errors = this.#setErrors(form);
      const signals: Partial<{ [K in keyof TControl]: Signal<string> }> = {};

      Object.keys(errors).forEach((key) => {
        signals[key as keyof TControl] = toSignal(
          errors[key as keyof TControl],
          {
            initialValue: "",
          }
        );
      });

      return signals as { [K in keyof TControl]: Signal<string> };
    });
  }

  #setErrors<TControl extends ControlMap>(
    form: FormGroup<TControl>
  ): { [K in keyof TControl]: Observable<string> } {
    const controlErrorStreams: Partial<{
      [K in keyof TControl]: Observable<string>;
    }> = {};

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control) {
        const errorMessage$ = this.#getControlMessageStream(control, key);

        controlErrorStreams[key as keyof TControl] = errorMessage$;
      }
    });

    return controlErrorStreams as { [K in keyof TControl]: Observable<string> };
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
    const prevKeys = Object.keys(prevErrors);
    const currKeys = Object.keys(currErrors);

    if (prevKeys.length !== currKeys.length) {
      return false;
    }

    // If there is more than one key, compare using JSON.stringify
    if (prevKeys.length > 1) {
      return JSON.stringify(prevErrors) === JSON.stringify(currErrors);
    }

    // For single-key objects, compare the error type
    return prevKeys[0] === currKeys[0];
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
    return "";
  }
}
