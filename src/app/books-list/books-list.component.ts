import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from '../model/book.model';
import { BookService } from './book.service';

@Component({
	selector: 'app-books-list',
	templateUrl: './books-list.component.html',
	styleUrls: ['./books-list.component.css'],
})
export class BooksListComponent implements OnInit, OnDestroy {
	books: Book[] = [];
	constructor(private bookService: BookService) {}
	sub!: Subscription;
	ngOnInit() {
		this.sub = this.bookService.books.subscribe((books) => {
			this.books = books;
		});
		this.bookService.fetchBooks();
	}
	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
