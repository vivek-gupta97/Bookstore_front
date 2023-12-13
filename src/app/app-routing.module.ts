import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { BookFormComponent } from './books-list/book-form/book-form.component';
import { BooksListComponent } from './books-list/books-list.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'books',
	},
	{
		path: 'books',
		component: BooksListComponent,
		canActivate: mapToCanActivate([AuthGuard]),
	},
	{
		path: 'books/new',
		component: BookFormComponent,
		data: { edit: false },
		canActivate: mapToCanActivate([AuthGuard]),
	},
	{
		path: 'books/edit/:id',
		component: BookFormComponent,
		data: { edit: true },
		canActivate: mapToCanActivate([AuthGuard]),
	},
	{
		path: 'auth',
		component: AuthComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
