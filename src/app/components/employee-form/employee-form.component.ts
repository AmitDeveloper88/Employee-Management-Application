import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService, Employee } from '../../services/db.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="employee-form">
      <h1>{{isEdit() ? 'Edit' : 'Add'}} Employee Details</h1>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>
            <span class="icon">
              <img src="assets/icons/user.svg" alt="User">
            </span>
            <input 
              type="text" 
              [(ngModel)]="employee.name" 
              name="name"
              placeholder="Employee name"
              required>
          </label>
        </div>

        <div class="form-group">
          <label>
            <span class="icon">
              <img src="assets/icons/briefcase.svg" alt="Role">
            </span>
            <select [(ngModel)]="employee.role" name="role" required>
              <option value="" disabled selected>Select role</option>
              <option *ngFor="let role of roles" [value]="role">
                {{role}}
              </option>
            </select>
          </label>
        </div>

        <div class="date-range">
          <div class="form-group">
            <label>
              <span class="icon">
                <img src="assets/icons/calendar.svg" alt="Start Date">
              </span>
              <input 
                type="date" 
                [ngModel]="employee.startDate | date:'yyyy-MM-dd'"
                (ngModelChange)="employee.startDate = $event"
                name="startDate"
                required>
            </label>
          </div>

          <span class="date-separator">→</span>

          <div class="form-group">
            <label>
              <span class="icon">
                <img src="assets/icons/calendar.svg" alt="End Date">
              </span>
              <input 
                type="date" 
                [ngModel]="employee.endDate | date:'yyyy-MM-dd'"
                (ngModelChange)="employee.endDate = $event"
                name="endDate">
            </label>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="cancel" (click)="cancel()">Cancel</button>
          <button type="submit" class="save">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }

    @media (max-width: 480px) {
      :host {
        padding: 0;
      }
    }

    h1 {
      color: white;
      background: #2196F3;
      margin: -1rem -1rem 1rem;
      padding: 1.25rem;
      border-radius: 4px 4px 0 0;
      font-size: clamp(1.25rem, 5vw, 1.5rem);
    }

    .employee-form {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: 100%;
    }

    form {
      padding: 1.5rem;
    }

    @media (max-width: 480px) {
      h1 {
        margin: 0;
        border-radius: 0;
      }

      form {
        padding: 1rem;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group label:focus-within {
      border-color: #2196F3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      background: #f5f5f5;
      border-right: 1px solid #e0e0e0;
      flex-shrink: 0;
    }

    .icon img {
      width: 24px;
      height: 24px;
    }

    input, select {
      flex: 1;
      padding: 0.75rem;
      border: none;
      font-size: 1rem;
      width: 100%;
      background: white;
      min-width: 0;
    }

    @media (max-width: 480px) {
      input, select {
        font-size: 16px; /* Prevents iOS zoom on focus */
      }
    }

    input:focus, select:focus {
      outline: none;
    }

    select {
      cursor: pointer;
      appearance: none;
      padding-right: 2rem;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232196F3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      background-size: 1.5rem;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .date-range .form-group {
      flex: 1;
      margin-bottom: 0;
      min-width: 0;
    }

    .date-separator {
      color: #2196F3;
      font-size: 1.5rem;
      margin-top: -1rem;
      flex-shrink: 0;
    }

    @media (max-width: 640px) {
      .date-range {
        flex-direction: column;
        gap: 1rem;
      }

      .date-range .form-group {
        width: 100%;
      }

      .date-separator {
        transform: rotate(90deg);
        margin: 0;
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    @media (max-width: 480px) {
      .actions {
        flex-direction: column-reverse;
      }
    }

    button {
      flex: 1;
      padding: 0.875rem;
      border-radius: 4px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }

    .cancel {
      background: transparent;
      color: #2196F3;
      border: 1px solid #2196F3;
    }

    .cancel:hover {
      background: rgba(33, 150, 243, 0.1);
    }

    .save {
      background: #2196F3;
      color: white;
    }

    .save:hover {
      background: #1976D2;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    @media (hover: none) {
      .save:hover {
        transform: none;
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  isEdit = signal(false);
  employee: Employee = {
    name: '',
    role: '',
    startDate: new Date(),
  };

  roles = [
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner',
    'Full-stack Developer',
    'Senior Software Developer'
  ];

  constructor(
    private dbService: DbService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      const employees = await this.dbService.getAllEmployees();
      const employee = employees.find(e => e.id === +id);
      if (employee) {
        this.employee = {
          ...employee,
          startDate: new Date(employee.startDate),
          endDate: employee.endDate ? new Date(employee.endDate) : undefined
        };
      }
    }
  }

  async onSubmit() {
    if (this.isEdit()) {
      await this.dbService.updateEmployee(this.employee);
    } else {
      await this.dbService.addEmployee(this.employee);
    }
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}