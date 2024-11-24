import { TestBed } from '@angular/core/testing';

import { NgxReactiveErrorsService } from './ngx-reactive-errors.service';

describe('NgxReactiveErrorsService', () => {
  let service: NgxReactiveErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxReactiveErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
