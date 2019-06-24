import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedTasksComponent } from './consolidated-tasks.component';

describe('ConsolidatedTasksComponent', () => {
  let component: ConsolidatedTasksComponent;
  let fixture: ComponentFixture<ConsolidatedTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
