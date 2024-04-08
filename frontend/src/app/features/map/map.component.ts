import { Component, OnInit  } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DeviceService } from '../../core/services/http/device.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  devices: any[] = [];
  markerOptions: any={};

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.deviceService.getCompanyDevices().subscribe(devices => {
      this.devices = devices;
    });
    
    this.markerOptions = {
      icon: {
        url: 'assets/images/location-pin-48.png',
        scaledSize: {
          width: 32,
          height: 32
        }
      }
    };
  }
  parseCoordinates(device: any): { lat: number, lng: number } {
    return { 
      lat: parseFloat(device.xCoordinate),
      lng: parseFloat(device.yCoordinate)
    };
  }
  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 22.2736308,
      lng: 70.7512555
  };
  zoom = 6;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
}

move(event: google.maps.MapMouseEvent) {
  if (event.latLng != null) this.display = event.latLng.toJSON();
}
}
