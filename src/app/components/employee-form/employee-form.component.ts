import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService, Employee } from '../../services/db.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerComponent
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  isEdit = signal(false);
  employeeForm!: FormGroup;
  minStartDate = new Date();
  
  roles = [
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner',
    'Full-stack Developer',
    'Senior Software Developer'
  ];

  constructor(
    private fb: FormBuilder,
    private dbService: DbService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.initForm();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      const employees = await this.dbService.getAllEmployees();
      const employee = employees.find(e => e.id === +id);
      if (employee) {
        this.employeeForm.patchValue({
          name: employee.name,
          role: employee.role,
          startDate: new Date(employee.startDate),
          endDate: employee.endDate ? new Date(employee.endDate) : null
        });
      }
    }
  }

  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null]
    });
  }

  async onSubmit() {
    if (this.employeeForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.employeeForm.controls).forEach(key => {
        const control = this.employeeForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const employeeData: Employee = {
      ...this.isEdit() ? { id: +this.route.snapshot.params['id'] } : {},
      name: this.employeeForm.value.name,
      role: this.employeeForm.value.role,
      startDate: this.employeeForm.value.startDate,
      endDate: this.employeeForm.value.endDate || undefined
    };

    if (this.isEdit()) {
      await this.dbService.updateEmployee(employeeData);
    } else {
      await this.dbService.addEmployee(employeeData);
    }
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }

  handleStartDateChange(date: Date | null) {
    this.employeeForm.patchValue({ startDate: date || new Date() });
  }

  handleEndDateChange(date: Date | null) {
    this.employeeForm.patchValue({ endDate: date || undefined });
  }

  // Helper methods for template
  get nameControl() { return this.employeeForm.get('name'); }
  get roleControl() { return this.employeeForm.get('role'); }
}