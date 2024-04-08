import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddNewAdminComponent } from '../add-new-admin/add-new-admin.component';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule,MatIconModule],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.scss'
})
export class CompanyCardComponent {
  companyId: number = 1;

  openOptions(event: MouseEvent) {
    // Prevent click event from bubbling up to parent elements
    event.stopPropagation();
  }
  constructor(public dialog: MatDialog){}

  openDialogAdmin(): void {
    const dialogRef = this.dialog.open(AddNewAdminComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    /*
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); 
    });*/
  }
}
