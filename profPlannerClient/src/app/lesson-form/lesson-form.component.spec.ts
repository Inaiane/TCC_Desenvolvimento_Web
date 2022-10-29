import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonFormCreateComponent } from './lesson-form.component';

describe('LessonFormCreateComponent', () => {
  let component: LessonFormCreateComponent;
  let fixture: ComponentFixture<LessonFormCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonFormCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonFormCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
