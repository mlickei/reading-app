import moment = require("moment");

import {BookManager, Book} from "../management/book-management";
import {Widget} from "./widget";

export class RecentlyAddedBooks extends Widget {

    private $recentlyAddedBooks;

    constructor() {
        super();

        this.$recentlyAddedBooks = $('.recently-added-books');

        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        BookManager.getBooks({createdOn: now, limit: 10}, (books: Book[]) => {
            this.buildListing(books);
        });
    }

    private static buildBookHTML(book:Book) {
        return `<li class="book recently-added-book"><div class="book-info"> <div class="book-title"><span class="attr-val">${book.title}</span></div><div class="book-author"><div class="attr-val"><span class="author-last">${book.authorLast}, </span><span class="author-first">${book.authorFirst}</span></div></div><div class="book-isbn"><span class="attr-lbl">ISBN </span><span class="attr-val">${book.isbn}</span></div></div></li>`;
    }

    private buildListing(books:Book[]) {
        for(let book of books) {
            this.$recentlyAddedBooks.append($(RecentlyAddedBooks.buildBookHTML(book)));
        }
    }
}