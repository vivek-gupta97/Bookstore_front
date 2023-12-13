import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
	isLogin = true;
	isloading?: boolean;
	error?: string;

	constructor(private authService: AuthService, private router: Router) {}

	onSwitchMode() {
		this.isLogin = !this.isLogin;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}
		const { email, password, confirmPassword } = form.value;

		let authObs!: Observable<
			| {
					email: string;
					token: string;
					expiresIn: string;
			  }
			| { message: string }
		>;
		if (this.isLogin) {
			authObs = this.authService.login(email, password);
		} else {
			authObs = this.authService.signUp(email, password, confirmPassword);
		}
		authObs.subscribe({
			next: (response) => {
				this.isloading = false;
				this.router.navigate(['/books']);
			},
			error: (errorMessage) => {
				this.error = errorMessage;
				this.isloading = false;
			},
		});
		form.reset();
	}
}
