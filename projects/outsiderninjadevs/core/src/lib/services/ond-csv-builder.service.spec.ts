import { TestBed } from '@angular/core/testing';

import { OndCsvBuilderService } from './ond-csv-builder.service';

describe('OndCsvBuilderService', () => {
  let service: OndCsvBuilderService<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OndCsvBuilderService<Object>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run toCSVAsync command', async () => {
    await expectAsync(service.toCSVAsync([{ name: "achraf" }, { name: "alae" }])).toBeResolved();
  })
});
