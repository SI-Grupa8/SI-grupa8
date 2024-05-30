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
    { name: "00:00 - 03:00", value: '#c8e6c9' }, 
    { name: "03:00 - 06:00", value: '#81c784' }, 
    { name: "06:00 - 09:00", value: '#4caf50' }, 
    { name: "09:00 - 12:00", value: '#aed581' }, 
    { name: "12:00 - 15:00", value: '#aedb9c' }, 
    { name: "15:00 - 18:00", value: '#daedd9' }, 
    { name: "18:00 - 21:00", value: '#bae571' }, 
    { name: "21:00 - 00:00", value: '#7ba246' }  
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
    // this.companyService.getStatistics(this.companyId).subscribe(statistics=> {
    //   console.log('Received statistics:', statistics); 
    //   this.dataVBC = [
    //     { name: 'Admins', value: statistics.admins },
    //     { name: 'Dispatchers', value: statistics.dispatcher },
    //     { name: 'Fleet Managers', value: statistics.fleetManagers },
    //     { name: 'Users', value: statistics.users }
    //   ];
  
    // });
    this.deviceService.getLocationStatistics(this.companyId).subscribe(statistics => {
      console.log('Received statistics:', statistics); 

      this.dataVBC = statistics.map(item => ({
        name: getTimeIntervalName(item.timeInterval),
        value: item.percentage
      }));
      
      // Function to get the name based on the time interval
      function getTimeIntervalName(timeInterval: string) {
        const hour = parseInt(timeInterval.split(' - ')[0].split(':')[0]);
        //console.log("hour: ", hour)

        const intervals = [
            { start: 0, end: 3, name: '00:00 - 03:00' },
            { start: 3, end: 6, name: '03:00 - 06:00' },
            { start: 6, end: 9, name: '06:00 - 09:00' },
            { start: 9, end: 12, name: '09:00 - 12:00' },
            { start: 12, end: 15, name: '12:00 - 15:00' },
            { start: 15, end: 18, name: '15:00 - 18:00' },
            { start: 18, end: 21, name: '18:00 - 21:00' },
            { start: 21, end: 24, name: '21:00 - 00:00' },
        ];
      
        const interval = intervals.find(interval => hour >= interval.start && hour < interval.end);
      
        return interval ? interval.name : 'Unknown';
      }
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
