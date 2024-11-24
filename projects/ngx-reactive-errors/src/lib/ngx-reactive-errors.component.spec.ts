import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxReactiveErrorsComponent } from './ngx-reactive-errors.component';

describe('NgxReactiveErrorsComponent', () => {
  let component: NgxReactiveErrorsComponent;
  let fixture: ComponentFixture<NgxReactiveErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxReactiveErrorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxReactiveErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
