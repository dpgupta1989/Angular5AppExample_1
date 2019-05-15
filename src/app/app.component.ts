import { Component } from '@angular/core';
import { ApiServices } from '../api.services';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DIP Upload Utility';
  fullscreen$: Observable<boolean>;

  constructor(private apiServices: ApiServices) {

  }

  ngOnInit() {
    /*this.fullscreen$ = this.apiServices.fullscreen$;*/
  }
}
