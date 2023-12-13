import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'BookStore';
	isLoggedIn = false;
	constructor(private authService: AuthService) {
		this.authService.user.subscribe((user) => {
			if (user) {
				this.isLoggedIn = true;
				return;
			}
			this.isLoggedIn = false;
		});
		this.authService.autoLogin();
	}
	onLogout() {
		this.authService.logout();
	}
}
