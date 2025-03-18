import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="date-picker-container" #container>
      <div class="date-input-container" (click)="toggleCalendar()">
        <input
          type="text"
          class="date-input"
          [value]="formatDate(selectedDate)"
          readonly
          placeholder="No Date"
        />
        <span class="calendar-icon">📅</span>
      </div>
  
      <div class="calendar-popup" *ngIf="showCalendar">
        <!-- Different quick select options based on which date picker it is -->
        <div class="quick-select">
          <!-- For the second date picker (End Date) -->
          <ng-container *ngIf="isEndDatePicker">
            <button type="button" (click)="clearDate($event)">No date</button>
            <button type="button" (click)="selectToday($event)">Today</button>
          </ng-container>
          
          <!-- For the first date picker (Start Date) -->
          <ng-container *ngIf="!isEndDatePicker">
            <button type="button" (click)="selectToday($event)">Today</button>
            <button type="button" (click)="selectNextMonday($event)">Next Monday</button>
            <button type="button" (click)="selectNextTuesday($event)">Next Tuesday</button>
            <button type="button" (click)="selectNextWeek($event)">After 1 week</button>
          </ng-container>
        </div>
        
        <!-- Rest of the calendar remains unchanged -->
        
        <div class="calendar-header">
          <button type="button" (click)="previousMonth($event)">◀</button>
          <span>{{ currentMonth }} {{ currentYear }}</span>
          <button type="button" (click)="nextMonth($event)">▶</button>
        </div>
  
        <div class="calendar-grid">
          <div class="weekdays">
            <div *ngFor="let day of weekDays">{{ day }}</div>
          </div>
          <div class="days">
            <div
              *ngFor="let day of calendarDays"
              class="day"
              [class.other-month]="day.getMonth() !== currentDate.getMonth()"
              [class.selected]="isSelected(day)"
              [class.today]="isToday(day)"
              [class.disabled]="isDisabled(day)"
              (click)="!isDisabled(day) && selectDate(day)"
            >
              {{ day.getDate() }}
            </div>
          </div>
        </div>
  
        <div class="calendar-footer">
          <div class="date-display">
            <span class="calendar-icon-small">📅</span>
            <span>{{ formatDate(tempSelectedDate || selectedDate) }}</span>
          </div>
          <div class="actions">
            <button class="btn-cancel" (click)="cancel()">Cancel</button>
            <button class="btn-save" (click)="save()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  // Fix the CSS syntax error by removing the comments in CSS and moving the HostListener methods outside the styles
  styles: [`
      .date-picker-container {
        position: relative;
        width: 100%;
      }
      
      .date-input-container {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      
      .date-input {
        width: 100%;
        padding: 12px 16px;
        border: none;
        outline: none;
        font-size: 16px;
        background: transparent;
        cursor: pointer;
      }
      
      .calendar-icon {
        position: absolute;
        right: 12px;
        display: flex;
        align-items: center;
      }
      
      .calendar-popup {
        position: fixed;
        top: auto;
        left: auto;
        width: 320px;
        max-width: 95vw;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        overflow: visible;
        border: 1px solid #e6e6fa;
      }
      
      .quick-select {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        padding: 12px;
        background: #f0f8ff;
      }
      
      .quick-select button {
        padding: 10px;
        border: none;
        border-radius: 6px;
        background: white;
        color: #2196F3;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .quick-select button:hover {
        background: #e6f7ff;
      }
      
      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        font-weight: 500;
      }
      
      .calendar-header button {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #666;
        padding: 4px 8px;
      }
      
      .calendar-grid {
        padding: 0 12px 12px;
        overflow: hidden;
      }
      
      .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-weight: 500;
        color: #666;
        margin-bottom: 8px;
      }
      
      .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }
      
      .day {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        width: 36px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        margin: 0 auto;
      }
      
      .day:hover:not(.disabled):not(.selected) {
        background: #f0f8ff;
      }
      
      .other-month {
        color: #ccc;
      }
      
      .today {
        border: 1px solid #2196F3;
      }
      
      .selected {
        background: #2196F3;
        color: white;
      }
      
      .disabled {
        color: #ddd;
        cursor: not-allowed;
      }
      
      .calendar-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-top: 1px solid #e6e6fa;
      }
      
      .date-display {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }
      
      .calendar-icon-small {
        display: flex;
        align-items: center;
      }
      
      .actions {
        display: flex;
        gap: 8px;
      }
      
      .btn-cancel, .btn-save {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      }
      
      .btn-cancel {
        background: none;
        color: #2196F3;
      }
      
      .btn-save {
        background: #2196F3;
        color: white;
      }
    `]
  })
  export class DatePickerComponent implements OnInit {
    @Input() selectedDate: Date | null = null;
    @Input() minDate: Date | null = null;
    @Input() isEndDatePicker: boolean = false;
    @Output() dateChange = new EventEmitter<Date | null>();
  
    showCalendar = false;
    currentDate = new Date();
    currentMonth: string = '';
    currentYear: number = 0;
    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    calendarDays: Date[] = [];
    tempSelectedDate: Date | null = null;
  
    constructor(private elementRef: ElementRef) {}
  
    ngOnInit() {
      // For end date picker, don't set a default date if selectedDate is null
      if (!this.selectedDate && !this.isEndDatePicker) {
        this.selectedDate = new Date();
      }
      
      // Only set tempSelectedDate if there's a selectedDate
      if (this.selectedDate) {
        this.tempSelectedDate = new Date(this.selectedDate);
        this.currentDate = new Date(this.selectedDate);
      } else {
        // For null selectedDate (end date picker), set currentDate to today
        // but keep tempSelectedDate as null
        this.currentDate = new Date();
        this.tempSelectedDate = null;
      }
      
      this.updateCalendar();
    }
  
    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
      if (this.showCalendar && !this.elementRef.nativeElement.contains(event.target)) {
        this.showCalendar = false;
      }
    }
  
    updateCalendar() {
      const firstDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      const lastDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      );
  
      this.currentMonth = firstDay.toLocaleString('default', { month: 'long' });
      this.currentYear = firstDay.getFullYear();
  
      this.calendarDays = [];
      const startDay = new Date(firstDay);
      startDay.setDate(startDay.getDate() - firstDay.getDay());
  
      for (let i = 0; i < 42; i++) {
        this.calendarDays.push(new Date(startDay));
        startDay.setDate(startDay.getDate() + 1);
      }
    }
  
    // Update the checkPosition method to better handle positioning
    @HostListener('window:resize')
    checkPosition() {
      setTimeout(() => {
        if (this.showCalendar) {
          const popup = this.elementRef.nativeElement.querySelector('.calendar-popup');
          const container = this.elementRef.nativeElement.querySelector('.date-input-container');
          
          if (popup && container) {
            const containerRect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const popupHeight = popup.offsetHeight;
            const popupWidth = popup.offsetWidth;
            
            // Position the popup relative to the input container
            popup.style.position = 'fixed';
            
            // Calculate horizontal position
            let left = containerRect.left;
            if (left + popupWidth > viewportWidth) {
              left = Math.max(0, containerRect.right - popupWidth);
            }
            
            // Calculate vertical position
            let top = containerRect.bottom + 8;
            if (top + popupHeight > viewportHeight) {
              // Position above if not enough space below
              top = Math.max(0, containerRect.top - popupHeight - 8);
            }
            
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
          }
        }
      }, 0);
    }
  
    toggleCalendar(event?: Event) {
      if (event) {
        event.stopPropagation();
      }
      this.showCalendar = !this.showCalendar;
      if (this.showCalendar) {
        // For end date picker with null selectedDate, keep tempSelectedDate as null
        if (this.selectedDate) {
          this.tempSelectedDate = new Date(this.selectedDate);
          this.currentDate = new Date(this.selectedDate);
        } else {
          this.tempSelectedDate = this.isEndDatePicker ? null : new Date();
          this.currentDate = new Date();
        }
        this.updateCalendar();
        
        // Use setTimeout to ensure DOM is updated before checking position
        setTimeout(() => {
          this.checkPosition();
        }, 10);
      }
    }
  
    // Keep only this formatDate method and remove the other one
    formatDate(date: Date | null): string {
      if (!date) {
        // Show "No date" for the end date picker when no date is selected
        return this.isEndDatePicker ? 'No date' : '';
      }
      
      // Format as "5 Sep 2025"
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    }
  
    selectDate(date: Date) {
      this.tempSelectedDate = new Date(date);
      // No need to call updateCalendar here as it might reset the view
    }
  
    isSelected(date: Date): boolean {
      if (!this.tempSelectedDate) return false;
      return (
        date.getDate() === this.tempSelectedDate.getDate() &&
        date.getMonth() === this.tempSelectedDate.getMonth() &&
        date.getFullYear() === this.tempSelectedDate.getFullYear()
      );
    }
  
    isToday(date: Date): boolean {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }
  
    isDisabled(date: Date): boolean {
      if (!this.minDate) return false;
      return date < this.minDate;
    }
  
    // Update the month navigation methods to prevent event propagation
    previousMonth(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.updateCalendar();
    }
  
    nextMonth(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.updateCalendar();
    }
  
    selectToday(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.tempSelectedDate = new Date();
      this.currentDate = new Date();
      this.updateCalendar();
    }
    
    selectNextMonday(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const date = new Date();
      date.setDate(date.getDate() + ((8 - date.getDay()) % 7));
      this.tempSelectedDate = date;
      this.currentDate = new Date(date);
      this.updateCalendar();
    }
    
    selectNextTuesday(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const date = new Date();
      date.setDate(date.getDate() + ((9 - date.getDay()) % 7));
      this.tempSelectedDate = date;
      this.currentDate = new Date(date);
      this.updateCalendar();
    }
    
    selectNextWeek(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const date = new Date();
      date.setDate(date.getDate() + 7);
      this.tempSelectedDate = date;
      this.currentDate = new Date(date);
      this.updateCalendar();
    }
    
    save() {
      if (this.tempSelectedDate) {
        this.selectedDate = new Date(this.tempSelectedDate);
        this.dateChange.emit(this.selectedDate);
        this.showCalendar = false;
      }
    }
  
    cancel() {
      this.showCalendar = false;
    }
    
    clearDate(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.tempSelectedDate = null;
      this.selectedDate = null;
      this.dateChange.emit(null);
      this.showCalendar = false;
    }
  }