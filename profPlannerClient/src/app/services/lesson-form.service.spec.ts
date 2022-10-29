import { TestBed } from '@angular/core/testing';

import { LessonFormService } from './lesson-form.service';

describe('LessonFormService', () => {
  let service: LessonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
