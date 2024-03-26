import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-enable-twofa',
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: './enable-twofa.component.html',
  styleUrl: './enable-twofa.component.scss'
})
export class EnableTwofaComponent {
  public myAngularxQrCode: string = window.location.href
  constructor(
    private dialogRef: MatDialogRef<EnableTwofaComponent>,
    ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
