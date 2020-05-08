import { Injectable } from '@angular/core';
import {Subject, from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {AuthDataModel} from './auth-data.model';

@Injectable({providedIn: 'root'}) // to add the service/ Provider into app.module
export class AuthService {

  constructor(private http: HttpClient){}

  createUser(email: string, password: string){
    const authData: AuthDataModel = {email: email, password: password};

    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe( response => {
      console.log(response);
    });
  }

  login(email: string, password: string){
    const authData: AuthDataModel = {email: email, password: password};

    this.http.post("http://localhost:3000/api/user/login", authData)
    .subscribe( response => {
      console.log(response);
    });
  }
}
