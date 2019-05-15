import { Component, OnInit } from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material';
import {MatDialog} from '@angular/material';

import {StoreClaims} from "../modal/storeclaims.model";

@Component({
  selector: 'app-orderadjustment-popup',
  templateUrl: './orderadjustment-popup.component.html',
  styleUrls: ['./orderadjustment-popup.component.css']
})
export class OrderadjustmentPopupComponent implements OnInit {


  /*Here data is the parameter passed from parent controller */
  constructor(public dialogRef: MatDialogRef<OrderadjustmentPopupComponent>,@Inject(MAT_DIALOG_DATA) public data:StoreClaims) {

  }

  ngOnInit() {
  }

  onCloseConfirm(){
    this.dialogRef.close("Transaction Submitted Successfully");
  }

  onCloseCancel(){
    this.dialogRef.close("Transaction Failed");
  }
}
