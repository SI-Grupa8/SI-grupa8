import { Component } from '@angular/core';
import { OpenEnable2faService } from '../../core/services/dialogs/open-enable-2fa.service';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { RemoveTwofaComponent } from './remove-twofa/remove-twofa.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,MatSelectModule,MatSlideToggleModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  checked: boolean = false;
  private allow2faDialogOpen: boolean = true;
toggleChecked: any;

  constructor(
    private openEnable2faService: OpenEnable2faService,
    private dialog: MatDialog
  ) { }

  openEnable2fa(): void {
    if (this.allow2faDialogOpen) {
      this.openEnable2faService.openEnable2fa();
    }
  }

  //openRemove2fa(): void {
    //  this.openEnable2faService.openRemove2fa();
  //}
/*
  toggleChanged(event: any) {
    if (event.target.checked) {
      this.allow2faDialogOpen = true;
      //this.openEnable2fa();
    } else {
      this.allow2faDialogOpen = false;
      this.openRemove2fa();
    }
  }*/

  change(e: { source: { checked: boolean; }; }) {
    if (this.checked) {
      // at first, reset to the previous value
      // so that the user could not see that the mat-slide-toggle has really changed
      e.source.checked = true;

      const dialogRef = this.dialog.open(RemoveTwofaComponent);
      dialogRef.afterClosed().subscribe(response => {
        console.log( 'response ', response );
        if (response) {
           this.checked = !this.checked;
           console.log("toggle")
        } else {
          console.log("toggle should not change if I click the cancel button")
        }
      })
    } else {
      this.checked = !this.checked;
      this.openEnable2faService.openEnable2fa();
    }
  }

  
}
