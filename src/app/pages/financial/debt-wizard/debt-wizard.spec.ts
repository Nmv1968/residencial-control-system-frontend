import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtWizard } from './debt-wizard';

describe('DebtWizard', () => {
  let component: DebtWizard;
  let fixture: ComponentFixture<DebtWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
