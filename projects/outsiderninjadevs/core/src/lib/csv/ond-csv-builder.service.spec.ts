import { TestBed } from '@angular/core/testing';

import { OndCsvBuilderService } from './ond-csv-builder.service';

describe('OndCsvBuilderService', () => {
  let service: OndCsvBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OndCsvBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run toCSVAsync command', async () => {
    await expectAsync(service.toCSVAsync<object>([{ name: "achraf" }, { name: "alae" }])).toBeResolved();
  })
});
