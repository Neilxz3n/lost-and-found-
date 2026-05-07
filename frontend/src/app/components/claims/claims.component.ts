import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Claim } from '../../models/interfaces';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="claims-page">
      <h1>{{ isAdmin ? 'All Claims' : 'My Claims' }}</h1>
      <p class="subtitle">{{ isAdmin ? 'Review and manage ownership claims.' : 'Track the status of your claims.' }}</p>

      <mat-card class="table-card">
        <table mat-table [dataSource]="claims" class="full-width">
          <ng-container matColumnDef="item_name">
            <th mat-header-cell *matHeaderCellDef>Item</th>
            <td mat-cell *matCellDef="let c">{{ c.item_name }}</td>
          </ng-container>
          <ng-container matColumnDef="claimant_name">
            <th mat-header-cell *matHeaderCellDef>Claimant</th>
            <td mat-cell *matCellDef="let c">{{ c.claimant_name }}</td>
          </ng-container>
          <ng-container matColumnDef="proof_of_ownership">
            <th mat-header-cell *matHeaderCellDef>Proof</th>
            <td mat-cell *matCellDef="let c">{{ c.proof_of_ownership }}</td>
          </ng-container>
          <ng-container matColumnDef="claim_status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <span class="status-badge" [class]="c.claim_status">{{ c.claim_status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="created_at">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let c">{{ c.created_at | date:'mediumDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let c">
              @if (isAdmin && c.claim_status === 'pending') {
                <button mat-raised-button color="primary" (click)="updateClaim(c.id, 'approved')" style="margin-right:4px">Approve</button>
                <button mat-raised-button color="warn" (click)="updateClaim(c.id, 'rejected')">Reject</button>
              }
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        @if (claims.length === 0) {
          <p class="no-data">No claims found.</p>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .claims-page h1 { margin: 0; color: #111827; }
    .subtitle { color: #6b7280; margin-top: 4px; margin-bottom: 16px; }
    .table-card { border-radius: 12px; overflow: hidden; }
    .full-width { width: 100%; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.approved { background: #dcfce7; color: #166534; }
    .status-badge.rejected { background: #fee2e2; color: #991b1b; }
    .no-data { text-align: center; color: #9ca3af; padding: 20px; }
  `]
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  isAdmin = false;
  displayedColumns: string[] = [];

  constructor(private apiService: ApiService, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.displayedColumns = this.isAdmin
      ? ['item_name', 'claimant_name', 'proof_of_ownership', 'claim_status', 'created_at', 'actions']
      : ['item_name', 'proof_of_ownership', 'claim_status', 'created_at'];
    this.loadClaims();
  }

  loadClaims() {
    this.apiService.getClaims().subscribe({ next: (c) => this.claims = c });
  }

  updateClaim(id: number, status: string) {
    this.apiService.updateClaim(id, { claim_status: status }).subscribe({
      next: () => { this.snackBar.open(`Claim ${status}!`, 'Close', { duration: 3000 }); this.loadClaims(); },
      error: () => this.snackBar.open('Failed to update claim', 'Close', { duration: 3000 })
    });
  }
}
