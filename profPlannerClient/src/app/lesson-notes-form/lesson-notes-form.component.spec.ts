import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlansComponent } from './lesson-notes-form.component';

describe('LessonPlansComponent', () => {
  let component: LessonPlansComponent;
  let fixture: ComponentFixture<LessonPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
