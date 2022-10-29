import { TestBed } from '@angular/core/testing';

import { LessonNotesFormService } from './lesson-notes-form.service';

describe('LessonNotesFormService', () => {
  let service: LessonNotesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonNotesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
