import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatListModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule, MatIconModule, MatSidenavModule} from '@angular/material';
/*import { MaterialModule } from '@angular/material';*/
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material';
/*Imported dialog module to load up*/
import {MatDialogModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';

/*Reactive Form Module required in Handbill component form group*/
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { ApiServices } from '../api.services';
import { AppComponent } from './app.component';
import { OrderAdjustmentComponent } from './OrderAdjustment/orderadjustment.component';
import { HandbillComponent } from './Handbill/Handbill.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationComponent } from './application/application.component';
import {AgGridModule} from 'ag-grid-angular/main';
import { OrderadjustmentPopupComponent } from './orderadjustment-popup/orderadjustment-popup.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AboutusComponent } from './aboutus/aboutus.component';


@NgModule({
  declarations: [
    AppComponent,
    OrderAdjustmentComponent,
    HandbillComponent,
    ApplicationComponent,
    OrderadjustmentPopupComponent,
    AboutusComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot([
      {
        path: 'home',
        component: ApplicationComponent
      },
      {
        path: 'uploadStatus',
        component: OrderAdjustmentComponent
      },
      {
        path: 'uploadParameters',
        component: HandbillComponent
      },
      {
        path: 'aboutUs',
        component: AboutusComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: ApplicationComponent
      }
    ]),
  ],
  entryComponents:[OrderadjustmentPopupComponent],
  providers: [ApiServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
