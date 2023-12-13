import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
	user = new BehaviorSubject<User | null>(null);

	private tknExpTimer: any;

	constructor(private http: HttpClient, private router: Router) {}

	signUp(email: string, pass: string, cnfPass: string) {
		return this.http
			.put<{
				message: string;
			}>('http://localhost:3000/auth/signup', {
				email: email,
				password: pass,
				confirmPassword: cnfPass,
			})
			.pipe(
				catchError(this.handleError),
				tap((resData) => {
					alert(resData.message);
				})
			);
	}

	login(email: string, password: string) {
		return this.http
			.post<{
				email: string;
				token: string;
				expiresIn: string;
			}>('http://localhost:3000/auth/login', {
				email: email,
				password: password,
			})
			.pipe(
				catchError(this.handleError),
				tap((resData) => {
					this.handleAuthentication(
						resData.email,
						resData.token,
						new Date(resData.expiresIn)
					);
				})
			);
	}

	private handleAuthentication(
		email: string,
		token: string,
		expiresIn: Date
	) {
		const user = new User(email, token, expiresIn);
		this.user.next(user);

		localStorage.setItem('userData', JSON.stringify(user));
		this.autologout(expiresIn.valueOf() - Date.now());
	}

	private handleError(errorRes: HttpErrorResponse) {
		let errorMessage = errorRes.error.message || 'An unknown error Occured';
		if (errorRes.status == 422) {
			errorMessage = errorRes.error.data[0].msg;
		}
		return throwError(() => errorMessage);
	}

	autoLogin() {
		const userData: {
			email: string;
			_token: string;
			_tokenExpirationDate: string;
		} = JSON.parse(localStorage.getItem('userData')!);

		if (!userData) {
			return;
		}
		const loadedUser = new User(
			userData.email,
			userData._token,
			new Date(userData._tokenExpirationDate)
		);
		if (loadedUser.token) {
			this.user.next(loadedUser);
		}
		const expDuration =
			new Date(userData._tokenExpirationDate).getTime() -
			new Date().getTime();
		this.autologout(expDuration);
		this.router.navigate(['/books']);
	}

	autologout(expDuration: number) {
		this.tknExpTimer = setTimeout(() => {
			this.logout();
		}, expDuration);
	}

	logout() {
		this.user.next(null);
		this.router.navigate(['/auth']);
		localStorage.removeItem('userData');
		if (this.tknExpTimer) {
			clearTimeout(this.tknExpTimer);
		}
		this.tknExpTimer = null;
	}
}
