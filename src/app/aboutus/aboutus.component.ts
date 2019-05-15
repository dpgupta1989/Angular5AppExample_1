import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  aboutResponse: any = {
    'appName': ' DIP Upload Utility' ,
    'appVersion': 'v1.0.0'
  }

  constructor() { }

  ngOnInit() {
  }


}
