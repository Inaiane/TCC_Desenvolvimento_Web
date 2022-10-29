import { TestBed } from '@angular/core/testing';

import { LessonNotesService } from './lesson-notes.service';

describe('LessonNotesService', () => {
  let service: LessonNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
