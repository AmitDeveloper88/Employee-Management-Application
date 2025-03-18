import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import { By } from '@angular/platform-browser';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with today\'s date for start date picker', () => {
    component.isEndDatePicker = false;
    component.selectedDate = null;
    component.ngOnInit();
    
    expect(component.selectedDate).toBeTruthy();
    const today = new Date();
    expect(component.selectedDate?.getDate()).toBe(today.getDate());
    expect(component.selectedDate?.getMonth()).toBe(today.getMonth());
    expect(component.selectedDate?.getFullYear()).toBe(today.getFullYear());
  });

  it('should initialize with null for end date picker', () => {
    component.isEndDatePicker = true;
    component.selectedDate = null;
    component.ngOnInit();
    
    expect(component.selectedDate).toBeNull();
  });

  it('should format date correctly', () => {
    const testDate = new Date(2023, 5, 15); // June 15, 2023
    const formattedDate = component.formatDate(testDate);
    expect(formattedDate).toBe('15 Jun 2023');
  });

  it('should show "No date" for null date in end date picker', () => {
    component.isEndDatePicker = true;
    const formattedDate = component.formatDate(null);
    expect(formattedDate).toBe('No date');
  });

  it('should toggle calendar visibility', () => {
    expect(component.showCalendar).toBeFalse();
    component.toggleCalendar();
    expect(component.showCalendar).toBeTrue();
    component.toggleCalendar();
    expect(component.showCalendar).toBeFalse();
  });

  it('should emit date change when save is called', () => {
    spyOn(component.dateChange, 'emit');
    const testDate = new Date(2023, 5, 15);
    component.tempSelectedDate = testDate;
    component.save();
    
    expect(component.dateChange.emit).toHaveBeenCalledWith(jasmine.any(Date));
    expect(component.showCalendar).toBeFalse();
  });

  it('should emit null when clearDate is called', () => {
    spyOn(component.dateChange, 'emit');
    component.clearDate();
    
    expect(component.dateChange.emit).toHaveBeenCalledWith(null);
    expect(component.tempSelectedDate).toBeNull();
    expect(component.selectedDate).toBeNull();
    expect(component.showCalendar).toBeFalse();
  });
});