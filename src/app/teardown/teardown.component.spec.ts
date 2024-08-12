import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeardownComponent } from './teardown.component';

describe('TeardownComponent', () => {
  let component: TeardownComponent;
  let fixture: ComponentFixture<TeardownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeardownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeardownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
