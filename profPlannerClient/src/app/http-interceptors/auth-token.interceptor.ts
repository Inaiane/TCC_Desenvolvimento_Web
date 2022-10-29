import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { from, map, mergeMap, Observable, switchMap, take } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthTokenHttpInterceptor implements HttpInterceptor {

    constructor(
        private auth: AngularFireAuth
    ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        /*this.auth.currentUser.then(user => {
           if (user) {
                let idToken = user.getIdToken();
                idToken.then(token => {
                    if (token)
                    {
                    let clone = req.clone()
                    if (token) {
                        clone = clone.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
                    }
                    return next.handle(clone);
                    }
                    return next.handle(req);
                })
           }
        });
        return next.handle(req);
        */
        let currentUser = this.auth.currentUser;
        return from(this.auth.idToken).pipe(mergeMap(idToken => {
            let clone = req.clone()
            if (idToken) {
                clone = clone.clone({ headers: req.headers.set('Authorization', 'Bearer ' + idToken) });
                return next.handle(clone);
            }
            return next.handle(clone);
        }))
        
    }
}

export const AuthTokenHttpInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthTokenHttpInterceptor,
    multi: true
}