import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { DbService } from '../../services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let mockDbService: jasmine.SpyObj<DbService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDbService = jasmine.createSpyObj('DbService', ['getAllEmployees', 'addEmployee', 'updateEmployee']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, EmployeeFormComponent],
      providers: [
        { provide: DbService, useValue: mockDbService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.employee.name).toBe('');
    expect(component.employee.role).toBe('');
    expect(component.employee.startDate).toBeDefined();
  });

  it('should navigate to home on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});