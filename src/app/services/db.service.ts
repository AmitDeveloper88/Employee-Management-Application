import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

export interface Employee {
  id?: number;
  name: string;
  role: string;
  startDate: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: IDBPDatabase | null = null;
  private readonly DB_NAME = 'employeeDB';
  private readonly STORE_NAME = 'employees';

  async initDb() {
    this.db = await openDB(this.DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          const store = db.createObjectStore('employees', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('startDate', 'startDate');
          store.createIndex('endDate', 'endDate');
        }
      }
    });
  }

  async addEmployee(employee: Employee): Promise<void> {
    if (!this.db) await this.initDb();
    await this.db!.add(this.STORE_NAME, employee);
  }

  async updateEmployee(employee: Employee): Promise<void> {
    if (!this.db) await this.initDb();
    await this.db!.put(this.STORE_NAME, employee);
  }

  async deleteEmployee(id: number): Promise<void> {
    if (!this.db) await this.initDb();
    await this.db!.delete(this.STORE_NAME, id);
  }

  async getAllEmployees(): Promise<Employee[]> {
    if (!this.db) await this.initDb();
    return await this.db!.getAll(this.STORE_NAME);
  }
}