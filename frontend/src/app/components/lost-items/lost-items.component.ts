import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { LostItem, Category } from '../../models/interfaces';

@Component({
  selector: 'app-lost-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="lost-items-page">
      <div class="page-header">
        <h1>Lost Items</h1>
        <button mat-raised-button color="primary" (click)="showForm = !showForm">
          <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
          {{ showForm ? 'Cancel' : 'Report Lost Item' }}
        </button>
      </div>

      @if (showForm) {
        <mat-card class="form-card">
          <h3>{{ editingId ? 'Edit' : 'Report' }} Lost Item</h3>
          <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Item Name</mat-label>
                <input matInput formControlName="item_name">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category_id">
                  @for (cat of categories; track cat.id) {
                    <mat-option [value]="cat.id">{{ cat.category_name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-span">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Location Lost</mat-label>
                <input matInput formControlName="location_lost">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Date Lost</mat-label>
                <input matInput formControlName="date_lost" type="date">
              </mat-form-field>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="itemForm.invalid">
              {{ editingId ? 'Update' : 'Submit Report' }}
            </button>
          </form>
        </mat-card>
      }

      <mat-card class="search-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search lost items...</mat-label>
          <input matInput (input)="onSearch($event)" placeholder="Search by name or description">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="filteredItems" class="full-width">
          <ng-container matColumnDef="item_name">
            <th mat-header-cell *matHeaderCellDef>Item Name</th>
            <td mat-cell *matCellDef="let item">{{ item.item_name }}</td>
          </ng-container>
          <ng-container matColumnDef="category_name">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let item">{{ item.category_name || 'N/A' }}</td>
          </ng-container>
          <ng-container matColumnDef="location_lost">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let item">{{ item.location_lost }}</td>
          </ng-container>
          <ng-container matColumnDef="date_lost">
            <th mat-header-cell *matHeaderCellDef>Date Lost</th>
            <td mat-cell *matCellDef="let item">{{ item.date_lost | date:'mediumDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let item">
              <span class="status-badge" [class]="item.status">{{ item.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let item">
              <button mat-icon-button color="primary" (click)="editItem(item)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteItem(item.id)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        @if (filteredItems.length === 0) {
          <p class="no-data">No lost items found.</p>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .page-header h1 { margin: 0; color: #111827; }
    .form-card { padding: 24px; margin-bottom: 16px; border-radius: 12px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .full-span { grid-column: 1 / -1; }
    .search-card { padding: 16px; margin-bottom: 16px; border-radius: 12px; }
    .search-field { width: 100%; }
    .table-card { border-radius: 12px; overflow: hidden; }
    .full-width { width: 100%; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.matched { background: #dbeafe; color: #1e40af; }
    .status-badge.claimed { background: #dcfce7; color: #166534; }
    .no-data { text-align: center; color: #9ca3af; padding: 20px; }
  `]
})
export class LostItemsComponent implements OnInit {
  items: LostItem[] = [];
  filteredItems: LostItem[] = [];
  categories: Category[] = [];
  showForm = false;
  editingId: number | null = null;
  itemForm: FormGroup;
  displayedColumns = ['item_name', 'category_name', 'location_lost', 'date_lost', 'status', 'actions'];

  constructor(private fb: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar) {
    this.itemForm = this.fb.group({
      item_name: ['', Validators.required],
      category_id: [''],
      description: [''],
      location_lost: ['', Validators.required],
      date_lost: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadItems();
    this.apiService.getCategories().subscribe({ next: (c) => this.categories = c });
  }

  loadItems() {
    this.apiService.getLostItems().subscribe({
      next: (items) => { this.items = items; this.filteredItems = items; }
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter(i =>
      i.item_name.toLowerCase().includes(term) || (i.description && i.description.toLowerCase().includes(term))
    );
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.itemForm.value).forEach(key => {
      if (this.itemForm.value[key]) formData.append(key, this.itemForm.value[key]);
    });

    const req = this.editingId
      ? this.apiService.updateLostItem(this.editingId, formData)
      : this.apiService.createLostItem(formData);

    req.subscribe({
      next: () => {
        this.snackBar.open(this.editingId ? 'Item updated!' : 'Item reported!', 'Close', { duration: 3000 });
        this.showForm = false;
        this.editingId = null;
        this.itemForm.reset();
        this.loadItems();
      },
      error: () => this.snackBar.open('Operation failed', 'Close', { duration: 3000 })
    });
  }

  editItem(item: LostItem) {
    this.editingId = item.id;
    this.showForm = true;
    this.itemForm.patchValue({
      item_name: item.item_name,
      category_id: item.category_id,
      description: item.description,
      location_lost: item.location_lost,
      date_lost: item.date_lost
    });
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deleteLostItem(id).subscribe({
        next: () => { this.snackBar.open('Item deleted', 'Close', { duration: 3000 }); this.loadItems(); },
        error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 })
      });
    }
  }
}
