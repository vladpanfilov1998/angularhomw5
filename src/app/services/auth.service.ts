import {Injectable} from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

import {urls} from "../constants";
import {IToken, IUser} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _accessTokenKey = 'access';
  private _refreshTokenKey = 'refresh';

  constructor(private httpClient: HttpClient) {
  }

  register(user: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(urls.users, user);
  }

  login(user: IUser): Observable<IToken> {
    return this.httpClient.post<IToken>(urls.auth, user);
  }

  setToken(token: IToken): void {
    localStorage.setItem(this._accessTokenKey, token.access);
    localStorage.setItem(this._refreshTokenKey, token.refresh);
  }

  getAccessToken(): string {
    return localStorage.getItem(this._accessTokenKey) as string;
  }

  getRefreshToken(): string {
    return localStorage.getItem(this._refreshTokenKey) as string;
  }

  deleteToken(): void {
    localStorage.removeItem(this._accessTokenKey);
  }

  isAuthorization(): boolean {
    return !!localStorage.getItem(this._accessTokenKey);
  }

  refresh(): Observable<IToken> {
    const refresh = this.getRefreshToken();
    return this.httpClient.post<IToken>(`${urls.auth}/refresh`, {refresh}).pipe(
      tap((tokens: IToken) => {
        this.setToken(tokens)
      })
    )
  }
}
