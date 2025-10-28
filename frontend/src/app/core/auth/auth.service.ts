import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public  accessTokenKay: string = 'accessToken';
  public  refreshTokenKay: string = 'refreshToken';
  public  userIdKay: string = 'userIdKay';


  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKay);
  }


  login(email: string, password: string, rememberMe: boolean) : Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + "/login", {
      email,password,rememberMe
    });
  }

  signup(email: string, password: string, passwordRepeat: string)
    : Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(
      environment.api + "/signup",
      { email, password, passwordRepeat }
    );
  }


  logout() : Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {

      return this.http.post<DefaultResponseType>(environment.api + "/login", {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'Can not find token');
  }

  refresh(): Observable<LoginResponseType | DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + "/refresh", {
        refreshToken: tokens.refreshToken
      })

    }
    throw throwError(() => 'Can not find token');
  }


  public getIsLoggedIn() {
    return this.isLogged;
  }

  public setToken(accessToken:string, refreshToken:string): void {
    localStorage.setItem(this.accessTokenKay, accessToken);
    localStorage.setItem(this.refreshTokenKay, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeToken(): void {
    localStorage.removeItem(this.accessTokenKay);
    localStorage.removeItem(this.refreshTokenKay);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKay),
      refreshToken: localStorage.getItem(this.refreshTokenKay),
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKay);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKay, id);
    } else {
      localStorage.removeItem(this.userIdKay);
    }
  }

}
