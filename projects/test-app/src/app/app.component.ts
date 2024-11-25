import { Component, inject } from "@angular/core";
import {
  NgxReactiveErrorsService,
  provideFormErrorService,
} from "../../../ngx-reactive-errors/src/public-api";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  providers: [provideFormErrorService({ errorMessages: [] })],
})
export class AppComponent {
  title = "test-app";

  reactiveFormService = inject(NgxReactiveErrorsService);

  control = new FormControl<string>("", [
    Validators.email,
    Validators.required,
  ]);

  error = this.reactiveFormService.getControlErrorAsSignal(
    this.control,
    "email"
  );

  constructor() {
    setTimeout(() => {
      this.control.setErrors({ serverError: "server error" });
    }, 1000);
  }
}
