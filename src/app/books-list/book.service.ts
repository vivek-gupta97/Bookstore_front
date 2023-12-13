import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Book } from '../model/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
	books: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
	header!: { headers: HttpHeaders };
	constructor(
		private http: HttpClient,
		private authService: AuthService,
		private router: Router
	) {
		this.header = {
			headers: new HttpHeaders({
				Authorization:
					'Bearer ' + this.authService.user.getValue()?.token,
			}),
		};
	}

	addBook(book: Book) {
		return this.http
			.post<{ message: String; data: Book }>(
				'http://localhost:3000/books',
				{ ...book },
				this.header
			)
			.pipe(
				map((res) => {
					const oldBooks = this.books.getValue();
					const newBooks = [...oldBooks, res.data];
					return newBooks;
				})
			);
	}
	editBook(book: Book, id: string) {
		return this.http
			.patch<{ message: String; data: Book }>(
				'http://localhost:3000/books/' + id,
				{ ...book },
				this.header
			)
			.pipe(
				map((res) => {
					const oldBooks = this.books.getValue();
					const i = oldBooks.findIndex((old) => old.id == book.id);
					const newBooks = [...oldBooks];
					newBooks[i] = res.data;
					return newBooks;
				})
			);
	}
	deleteBook(id: string) {
		return this.http
			.delete<{ message: String; data: Book }>(
				'http://localhost:3000/books/' + id,
				this.header
			)
			.pipe(
				map((res) => {
					const oldBooks = this.books.getValue();
					const newBooks = oldBooks.filter((old) => old.id != id);
					return newBooks;
				})
			);
	}
	fetchBooks() {
		this.http
			.get<{ messge: string; data: Book[] }>(
				'http://localhost:3000/books',
				this.header
			)
			.subscribe((res) => {
				this.books.next(res.data);
			});
	}
	getBookById(id: string) {
		return this.books.getValue().find((book) => book.id == id);
	}
}
