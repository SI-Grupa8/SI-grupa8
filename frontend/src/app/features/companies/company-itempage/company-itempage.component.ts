import { Component, Input, OnInit, input } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CompanyResponse } from '../../../core/models/company-response';

@Component({
  selector: 'app-company-itempage',
  standalone: true,
  imports: [MatTabsModule, RouterModule, MatPaginatorModule],
  templateUrl: './company-itempage.component.html',
  styleUrl: './company-itempage.component.scss'
})
export class CompanyItempageComponent implements OnInit {
  id: number = 0;
  @Input() company: CompanyResponse = {}
  constructor(private route: ActivatedRoute) { }
ngOnInit(): void {
  
  const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
  }
  
}


}
