import { NgModule,Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CompanyService } from '../../core/services/http/company.service';
import { AuthService } from '../../core/services/http/auth.service';
import { DeviceService } from '../../core/services/http/device.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [  
    CommonModule,
    NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit {
  dataVBC: any[] = []; 
  viewVBC: [number, number] = [800, 300];
  animationsVBC = false;
  legendVBC = true;
  xAxisVBC = true;
  yAxisVBC = true;
  showYAxisLabelVBC = true;
  yAxisLabelVBC = "Percentage (%)";
  companyId: number=0;
  barChartcustomColors = [
    { name: "admins", value: '#c8e6c9' }, 
    { name: "dispatcher", value: '#81c784' }, 
    { name: "fleetManagers", value: '#4caf50' }, 
    { name: "users", value: '#aed581' }  
  ];
  usersCount: number = 0;
  devicesCount: number = 0;
  activeRoutesCount: number = 0;

  constructor(private http: HttpClient, private companyService: CompanyService, private authService: AuthService, private deviceService: DeviceService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((res : any) => {
      this.companyId = res.companyID;
      this.getStatistics();
      this.getCompanyUsersCount();
      this.getCompanyDevicesCount();
    });
    
  }

  getStatistics(): void {
    this.companyService.getStatistics(this.companyId).subscribe(statistics=> {
      console.log('Received statistics:', statistics); 
      this.dataVBC = [
        { name: 'Admins', value: statistics.admins },
        { name: 'Dispatchers', value: statistics.dispatcher },
        { name: 'Fleet Managers', value: statistics.fleetManagers },
        { name: 'Users', value: statistics.users }
      ];
  
    });
  }

  dataLabelFormatterVBC(tooltipText: any) {
    return tooltipText + "%";
  }

  getCompanyUsersCount(): void {
    this.companyService.getCompanyUsers(this.companyId).subscribe((users: any[]) => {
      this.usersCount = users.length;
    });
  }

  getCompanyDevicesCount(): void {
    this.deviceService.getCompanyDevices(this.companyId).subscribe((devices: any[]) => {
      this.devicesCount = devices.length;
    });
  }
}
