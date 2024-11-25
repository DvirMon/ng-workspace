import { TestBed } from "@angular/core/testing";

import { MessageManagerService } from "./messages-manger.service";

describe("MessageManagerService", () => {
  let service: MessageManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageManagerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
