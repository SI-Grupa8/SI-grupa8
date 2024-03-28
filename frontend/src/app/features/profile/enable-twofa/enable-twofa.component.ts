import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { OpenEnable2faService } from '../../../core/services/dialogs/open-enable-2fa.service';

@Component({
  selector: 'app-enable-twofa',
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: './enable-twofa.component.html',
  styleUrl: './enable-twofa.component.scss'
})
export class EnableTwofaComponent {
  public myAngularxQrCode: string = window.location.href

  public imageUrl: string = '';
  constructor(
    private twofaService: OpenEnable2faService
    //private dialogRef: MatDialogRef<EnableTwofaComponent>,
    ) {
      console.log("Loaded: " + this.imageUrl);
    }

  closeDialog(): void {
    //this.dialogRef.close();
    this.twofaService.closeEnable2fa();
  }
  
}
