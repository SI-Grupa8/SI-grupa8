import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OpenEnable2faService } from '../../../core/services/dialogs/open-enable-2fa.service';

@Component({
  selector: 'app-remove-twofa',
  standalone: true,
  imports: [],
  templateUrl: './remove-twofa.component.html',
  styleUrl: './remove-twofa.component.scss'
})
export class RemoveTwofaComponent {
  constructor(
    //private dialogRef: MatDialogRef<RemoveTwofaComponent>,
    private twofaService: OpenEnable2faService
    ) {}

  closeDialog(): void {
    this.twofaService.closeRemove2fa();
  }
}
