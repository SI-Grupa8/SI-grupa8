import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-itempage',
  standalone: true,
  imports: [MatTabsModule, RouterModule],
  templateUrl: './company-itempage.component.html',
  styleUrl: './company-itempage.component.scss'
})
export class CompanyItempageComponent {

}
