import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService, Employee } from '../../services/db.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="employee-list">
      <h1>Employee List</h1>
      
      <ng-container *ngIf="currentEmployees().length > 0">
        <h2>Current employees</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of currentEmployees()">
                <td>
                  <div class="employee-name">
                    <div class="avatar">{{employee.name[0]}}</div>
                    {{employee.name}}
                  </div>
                </td>
                <td>
                  <span class="role-badge">{{employee.role}}</span>
                </td>
                <td>{{formatDate(employee.startDate)}}</td>
                <td>
                  <div class="actions">
                    <button class="edit-btn" (click)="editEmployee(employee)">
                      <img src="assets/icons/edit.svg" alt="Edit">
                      <span>Edit</span>
                    </button>
                    <button class="delete-btn" (click)="deleteEmployee(employee)">
                      <img src="assets/icons/trash.svg" alt="Delete">
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <ng-container *ngIf="previousEmployees().length > 0">
        <h2>Previous employees</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of previousEmployees()">
                <td>
                  <div class="employee-name">
                    <div class="avatar">{{employee.name[0]}}</div>
                    {{employee.name}}
                  </div>
                </td>
                <td>
                  <span class="role-badge">{{employee.role}}</span>
                </td>
                <td>{{formatDate(employee.startDate)}} - {{formatDate(employee.endDate!)}}</td>
                <td>
                  <div class="actions">
                    <button class="edit-btn" (click)="editEmployee(employee)">
                      <img src="assets/icons/edit.svg" alt="Edit">
                      <span>Edit</span>
                    </button>
                    <button class="delete-btn" (click)="deleteEmployee(employee)">
                      <img src="assets/icons/trash.svg" alt="Delete">
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <div *ngIf="!currentEmployees().length && !previousEmployees().length" 
           class="no-records">
        <img src="assets/no-records.svg" alt="No records found">
        <p>No employee records found</p>
      </div>

      <button class="fab" (click)="addEmployee()">+</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 1200px;
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

    @media (max-width: 480px) {
      h1 {
        margin: 0;
        border-radius: 0;
      }
    }

    h2 {
      color: #2196F3;
      font-size: clamp(1rem, 4vw, 1.2rem);
      margin: 2rem 0 1rem;
      font-weight: 500;
      padding: 0 1rem;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
      -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 480px) {
      .table-container {
        border-radius: 0;
      }
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 600px;
    }

    th, td {
      text-align: left;
      padding: 1rem;
    }

    th {
      background: #f8f9fa;
      font-weight: 500;
      color: #495057;
      border-bottom: 2px solid #e9ecef;
      white-space: nowrap;
    }

    td {
      border-bottom: 1px solid #e9ecef;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .employee-name {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 200px;
    }

    .avatar {
      width: 32px;
      height: 32px;
      background: #e3f2fd;
      color: #2196F3;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #e3f2fd;
      color: #2196F3;
      border-radius: 16px;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      min-width: 160px;
    }

    @media (max-width: 768px) {
      .actions {
        flex-direction: column;
        min-width: 100px;
      }
    }

    .edit-btn, .delete-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .edit-btn img, .delete-btn img {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .edit-btn, .delete-btn {
        width: 100%;
        justify-content: center;
      }
    }

    .edit-btn {
      background: #e3f2fd;
      color: #2196F3;
    }

    .edit-btn:hover {
      background: #bbdefb;
    }

    .delete-btn {
      background: #fee2e2;
      color: #ef4444;
    }

    .delete-btn:hover {
      background: #fecaca;
    }

    .no-records {
      text-align: center;
      padding: 3rem 1rem;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    @media (max-width: 480px) {
      .no-records {
        border-radius: 0;
      }
    }

    .no-records img {
      width: min(200px, 80%);
      margin-bottom: 1rem;
      opacity: 0.8;
    }

    .no-records p {
      color: #6b7280;
      font-size: clamp(1rem, 4vw, 1.1rem);
    }

    .fab {
      position: fixed;
      bottom: max(2rem, env(safe-area-inset-bottom, 2rem));
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 28px;
      background: #2196F3;
      color: white;
      border: none;
      font-size: 24px;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
      cursor: pointer;
      transition: all 0.2s;
      z-index: 100;
    }

    @media (hover: hover) {
      .fab:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
      }
    }

    @media (max-width: 480px) {
      .fab {
        bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
        right: 1rem;
      }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  currentEmployees = signal<Employee[]>([]);
  previousEmployees = signal<Employee[]>([]);

  constructor(
    private dbService: DbService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadEmployees();
  }

  private async loadEmployees() {
    const employees = await this.dbService.getAllEmployees();
    
    this.currentEmployees.set(
      employees.filter(e => !e.endDate)
    );
    
    this.previousEmployees.set(
      employees.filter(e => e.endDate)
    );
  }

  formatDate(date: Date | string): string {
    return format(new Date(date), 'd MMM, yyyy');
  }

  addEmployee() {
    this.router.navigate(['/add']);
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/edit', employee.id]);
  }

  async deleteEmployee(employee: Employee) {
    if (confirm('Are you sure you want to delete this employee?')) {
      await this.dbService.deleteEmployee(employee.id!);
      await this.loadEmployees();
    }
  }
}