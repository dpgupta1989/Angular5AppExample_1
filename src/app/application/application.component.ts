import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  applicationTitle1 : String = 'Welcome to the DIP Upload Utility Application';
  applicationTitle2 : String = 'Please use the left Menu to navigate to the needed screen';
  constructor() { }

  ngOnInit() {
  }

}
