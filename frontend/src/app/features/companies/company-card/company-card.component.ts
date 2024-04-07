import { Component } from '@angular/core';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.scss'
})
export class CompanyCardComponent {

  openOptions(event: MouseEvent) {
    // Prevent click event from bubbling up to parent elements
    event.stopPropagation();
  }
}
