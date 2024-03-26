import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnableTwofaComponent } from '../../../features/profile/enable-twofa/enable-twofa.component';

@Injectable({
  providedIn: 'root'
})
export class OpenEnable2faService {

  constructor(private dialog: MatDialog) { }
  openEnable2fa(): void {
    this.dialog.open(EnableTwofaComponent, {});
  }
  
}
