import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { DbService } from '../../services/db.service';
import { Router } from '@angular/router';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockDbService: jasmine.SpyObj<DbService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDbService = jasmine.createSpyObj('DbService', ['getAllEmployees', 'deleteEmployee']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent],
      providers: [
        { provide: DbService, useValue: mockDbService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', async () => {
    const mockEmployees = [
      { id: 1, name: 'John', role: 'Developer', startDate: new Date() }
    ];
    mockDbService.getAllEmployees.and.returnValue(Promise.resolve(mockEmployees));

    await component.ngOnInit();
    expect(component.currentEmployees()).toEqual(mockEmployees);
  });

  it('should navigate to add employee', () => {
    component.addEmployee();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add']);
  });

  it('should navigate to edit employee', () => {
    const employee = { id: 1, name: 'John', role: 'Developer', startDate: new Date() };
    component.editEmployee(employee);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', 1]);
  });

  it('should delete employee after confirmation', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const employee = { id: 1, name: 'John', role: 'Developer', startDate: new Date() };
    
    await component.deleteEmployee(employee);
    
    expect(mockDbService.deleteEmployee).toHaveBeenCalledWith(1);
  });
});