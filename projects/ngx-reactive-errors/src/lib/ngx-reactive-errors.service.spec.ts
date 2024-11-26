import { TestBed } from "@angular/core/testing";

import { NgxReactiveErrorsService } from "./ngx-reactive-errors.service";
import { AbstractMessageManager } from "./utils/abstract-messages-manger";
import { MessageManagerService } from "./utils/messages-manger.service";

describe("NgxReactiveErrorsService", () => {
  let service: NgxReactiveErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgxReactiveErrorsService,
        { provide: AbstractMessageManager, useClass: MessageManagerService },
      ],
    });
    service = TestBed.inject(NgxReactiveErrorsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
