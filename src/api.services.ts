import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {_catch} from 'rxjs/operator/catch';
import {map} from 'rxjs/operators';

@Injectable()
export class ApiServices {

  /*searchUploadStatusApiURL: any = 'http://mvst.0998.lowes.com/uploadstatus/searchResult/';*/
  searchUploadStatusApiURL: any = 'http://api.plos.org/search?q=title:DNA';
  httpOptions = {
       headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private _httpClient: HttpClient) {

  }

  private extractData(res: Response) {
    const body = res;
    return body || { };
  }

  getSearchResponse(){
    return this._httpClient.get(this.searchUploadStatusApiURL, this.httpOptions).pipe(map(this.extractData));
  }

}
