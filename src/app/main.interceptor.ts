import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from "@angular/router";
import {catchError, Observable, switchMap, throwError} from 'rxjs';

import {IToken} from "./interfaces";
import {AuthService} from "./services";

@Injectable()
export class MainInterceptor implements HttpInterceptor {
  isRefreshing = false

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthenticated = this.authService.isAuthorization();

    if (isAuthenticated) {
      request = this._addToken(request, this.authService.getAccessToken())
    }

    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        if (res && res.error && res.status === 401) {
          return this._handle401Error(request, next)
        }
        return throwError(() => new Error('token invalid or expired'))
      })
    ) as any;
  }

  private _addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    })
  }

  private _handle401Error(request: HttpRequest<unknown>, next: HttpHandler): any {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return this.authService.refresh().pipe(
        switchMap((tokens: IToken) => {
          return next.handle(this._addToken(request, tokens.access))
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.authService.deleteToken();
          this.router.navigate(['login']);
          return throwError(() => new Error('token invalid or expired'))
        })
      )
    }
  }
}
