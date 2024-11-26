# ngx-reactive-errors

## Description
`ngx-reactive-errors` is an Angular library designed to simplify form validation error handling in a reactive way. Compatible with Angular 19 and above, it provides error messages as `Observable` or Angular's `Signal`, making it easier to monitor and display validation errors in your forms. The library is highly customizable, allowing you to override default error messages and the message management service.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Contact](#contact)

## Features
- Provides form error messages as `Observable` or Angular's new `Signal`.
- Supports both individual form controls (`AbstractControl`) and grouped controls (`FormGroup`).
- Leverages RxJS for efficient error handling with deduplication logic.
- Customizable error messages using an `AbstractMessageManager`.
- Fully compatible with Angular 19 and its latest utilities (`runInInjectionContext`, `toSignal`).

## Installation
Install the library using npm:

```bash
npm install ngx-reactive-errors
```

## Setup
To set up `ngx-reactive-errors` in a standalone Angular application, configure the `ApplicationConfig` to provide the required services:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideFormErrorService } from 'ngx-reactive-errors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormErrorService()
  ],
};
```

This configuration ensures that the error service is available throughout your application.

## Configuration
`ngx-reactive-errors` provides a flexible configuration object, `ReactiveErrorConfig`, that allows you to customize the default behavior of the library. You can:

1. **Override Default Validation Messages**:
   - Use the `errorMessages` property to define custom messages for validation errors.
   - Each message is a tuple where:
     - The first value is the error key (e.g., `'required'`, `'minlength'`).
     - The second value is a function that generates the error message dynamically, based on the field name and error details.

2. **Replace the Default Message Manager Service**:
   - Use the `messageManagerType` property to provide a custom implementation of the `AbstractMessageManager`.
   - This is useful for advanced scenarios requiring centralized or reusable error management logic.

### Example Configuration
Below is an example of customizing both the default messages and the message manager service:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideFormErrorService } from 'ngx-reactive-errors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormErrorService({
      errorMessages: [
        ['required', (field) => `${field} is required`],
        ['minlength', (field, errorValue) => `${field} must be at least ${errorValue.requiredLength} characters`],
      ],
      messageManagerType: CustomMessageManager, // Replace with your implementation
    }),
  ],
};
```

### Default Behavior
If no configuration is provided, `ngx-reactive-errors` uses:
1. **Default Message Manager Service**:
   - A basic implementation of `AbstractMessageManager` that generates error messages based on predefined rules.
2. **Generic Error Messages**:
   - Example: `'This field is required'` for `required` validation.

### Customizing the `AbstractMessageManager`
To customize the `messageManagerService`, create a class extending `AbstractMessageManager` and implement the `getErrorMessage` method:

```typescript
import { AbstractMessageManager } from 'ngx-reactive-errors';

export class CustomMessageManager extends AbstractMessageManager {
  getErrorMessage(controlName: string, errorKey: string, errorValue?: any): string {
    const messages = {
      required: `${controlName} is required`,
      minlength: `${controlName} must be at least ${errorValue?.requiredLength} characters`,
    };
    return messages[errorKey] || `Invalid value for ${controlName}`;
  }
}
```

Once implemented, pass the custom class to the `messageManagerType` property in the configuration.

## API Documentation

### `getGroupErrorsAsObs`
**Description**: Returns a dictionary of Observables, where each key corresponds to a form control name.

**Parameters**:
- `form` (FormGroup): The form group to extract error messages from.

**Returns**:
- `{ [key: string]: Observable<string> }`: Dictionary of Observables for error messages.

---

### `getGroupErrorsAsSignal`
**Description**: Returns a dictionary of Signals, where each key corresponds to a form control name.

**Parameters**:
- `form` (FormGroup): The form group to extract error messages from.

**Returns**:
- `{ [key: string]: Signal<string> }`: Dictionary of Signals for error messages.

---

### `getControlErrorAsObs`
**Description**: Returns an Observable for a specific control's error message.

**Parameters**:
- `control` (AbstractControl): The control to monitor.
- `name` (string): The name of the control.

**Returns**:
- `Observable<string>`: Observable of the error message.

---

### `getControlErrorAsSignal`
**Description**: Returns a Signal for a specific control's error message.

**Parameters**:
- `control` (AbstractControl): The control to monitor.
- `name` (string): The name of the control.

**Returns**:
- `Signal<string>`: Signal of the error message.

## Usage Examples

### Example 1: Using Observables for a `FormGroup`
```typescript
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxReactiveErrorsService } from 'ngx-reactive-errors';

constructor(private fb: FormBuilder, private errorService: NgxReactiveErrorsService) {
  const form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
  });

  const errors = this.errorService.getGroupErrorsAsObs(form);

  errors.username.subscribe((error) => console.log('Username Error:', error));
  errors.password.subscribe((error) => console.log('Password Error:', error));
}
```

### Example 2: Using Signals for a `FormGroup`
```typescript
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxReactiveErrorsService } from 'ngx-reactive-errors';

constructor(private fb: FormBuilder, private errorService: NgxReactiveErrorsService) {
  const form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
  });

  const signals = this.errorService.getGroupErrorsAsSignal(form);

  const usernameError = signals.username();
  console.log('Username Error:', usernameError);
}
```

### Example 3: Using Observables for an `AbstractControl`
```typescript
const usernameControl = this.fb.control('', [Validators.required]);
const usernameError$ = this.errorService.getControlErrorAsObs(usernameControl, 'username');

usernameError$.subscribe((error) => console.log('Username Error:', error));
```

## Contribution Guidelines
We welcome contributions! To contribute:
1. Fork the repository and create a new branch for your feature or bugfix.
2. Ensure all tests pass by running `npm test`.
3. Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License.

## Contact
For questions or feedback, contact us via [GitHub Issues](https://github.com/your-repo/issues).
