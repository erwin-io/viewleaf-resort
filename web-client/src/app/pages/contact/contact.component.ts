import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  currentDate = new Date();
  constructor(private titleService: Title) {
    this.titleService.setTitle('Contact | ViewLeaf Resort');
  }
}
