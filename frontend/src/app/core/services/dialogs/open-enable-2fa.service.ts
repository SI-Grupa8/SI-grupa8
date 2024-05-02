import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnableTwofaComponent } from '../../../features/profile/enable-twofa/enable-twofa.component';
import { RemoveTwofaComponent } from '../../../features/profile/remove-twofa/remove-twofa.component';

@Injectable({
  providedIn: 'root'
})
export class OpenEnable2faService {

  constructor(private dialog: MatDialog) { }
  openEnable2fa(): void {
    this.dialog.open(EnableTwofaComponent, { disableClose: true, });
  }

  closeEnable2fa(): void {
    this.dialog.closeAll();
  }

  openRemove2fa(): void {
    this.dialog.closeAll();
    this.dialog.open(RemoveTwofaComponent, { disableClose: true, });
  }

  closeRemove2fa(): void {
    this.dialog.closeAll();
  }
}
