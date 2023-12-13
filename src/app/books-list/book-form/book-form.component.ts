import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from 'src/app/model/book.model';
import { BookService } from '../book.service';

@Component({
	selector: 'app-book-form',
	templateUrl: './book-form.component.html',
	styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent {
	id!: string;
	editmode = false;
	loadedBook: Book = { name: '', author: '', price: 0, category: '' };
	error: string = '';
	constructor(
		private route: ActivatedRoute,
		private bookService: BookService,
		private router: Router
	) {}

	ngOnInit() {
		this.editmode = this.route.snapshot.data['edit'];
		this.id = this.route.snapshot.params['id'];
		if (this.editmode) {
			const b = this.bookService.getBookById(this.id);
			if (!b) {
				this.onCancel();
				return;
			}
			this.loadedBook = b;
		}
	}

	onSubmit(form: NgForm) {
		const book: Book = {
			name: form.value.name,
			author: form.value.author,
			price: form.value.price,
			category: form.value.category,
		};
		let httpObs: Observable<Book[]>;
		if (this.editmode) {
			httpObs = this.bookService.editBook(book, this.id);
		} else {
			httpObs = this.bookService.addBook(book);
		}
		httpObs.subscribe({
			next: (newBooks) => {
				this.bookService.books.next(newBooks);
				this.router.navigate(['']);
			},
			error: (err) => {
				this.error =
					err.error.data[0].msg || err.error.message || err.message;
			},
		});
	}

	onCancel() {
		this.router.navigate(['']);
	}
}
