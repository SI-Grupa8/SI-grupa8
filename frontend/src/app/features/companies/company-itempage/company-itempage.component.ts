import { Component, Input, OnInit, input } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CompanyResponse } from '../../../core/models/company-response';
import { CompanyService } from '../../../core/services/http/company.service';
import { UserRequest } from '../../../core/models/user-request';

@Component({
  selector: 'app-company-itempage',
  standalone: true,
  imports: [MatTabsModule, RouterModule, MatPaginatorModule],
  templateUrl: './company-itempage.component.html',
  styleUrl: './company-itempage.component.scss'
})
export class CompanyItempageComponent implements OnInit {
  id: number = 0;
  company: CompanyResponse = {}
  members: UserRequest[] | undefined = [] 
  constructor(private route: ActivatedRoute, private companyService: CompanyService) { }
ngOnInit(): void {
  
  const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
  }
  console.log("id:" +this.id);
  this.getCompany();
  console.log("Company: " + this.company);
      console.log("Members:" + this.members);
  
}
  getCompany(): void {
    this.companyService.getCompanyById(this.id).subscribe(company => {
      console.log(company);
      this.company = company;
      this.members = company.users;
      //this.filterCompanies();
    });
  }


}
