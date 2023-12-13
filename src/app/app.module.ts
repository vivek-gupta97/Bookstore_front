import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BookFormComponent } from './books-list/book-form/book-form.component';
import { BookComponent } from './books-list/book/book.component';
import { BooksListComponent } from './books-list/books-list.component';

@NgModule({
	declarations: [
		AppComponent,
		AuthComponent,
		BooksListComponent,
		BookComponent,
		BookFormComponent,
	],
	imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
