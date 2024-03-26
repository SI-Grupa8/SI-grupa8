import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-twofa',
  standalone: true,
  imports: [],
  templateUrl: './remove-twofa.component.html',
  styleUrl: './remove-twofa.component.scss'
})
export class RemoveTwofaComponent {
  constructor(
    private dialogRef: MatDialogRef<RemoveTwofaComponent>,
    ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
