import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooskMaillageComponent } from './boosk-maillage.component';

describe('BooskMaillageComponent', () => {
  let component: BooskMaillageComponent;
  let fixture: ComponentFixture<BooskMaillageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooskMaillageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooskMaillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
