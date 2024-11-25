import { Component } from "@angular/core";
import { provideFormErrorService } from "../../../ngx-reactive-errors/src/public-api";

@Component({
  selector: "app-root",
  imports: [],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  providers: [provideFormErrorService({ errorMessages: [] })],
})
export class AppComponent {
  title = "test-app";
}
