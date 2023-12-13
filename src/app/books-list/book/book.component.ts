import { Component, Input } from '@angular/core';
import { Book } from 'src/app/model/book.model';
import { BookService } from '../book.service';

@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.css'],
})
export class BookComponent {
	@Input() book!: Book;
	@Input() index_no!: number;

	constructor(private bookService: BookService) {}
	onDelete() {
		this.bookService.deleteBook(this.book.id!).subscribe((newbooks) => {
			this.bookService.books.next(newbooks);
		});
	}
}
