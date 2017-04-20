import moment = require("moment");

import {BookManager, Book} from "../management/book-management";
import {Widget} from "./widget";

export class RecentlyAddedBooks extends Widget {

    constructor() {
        super();

        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        BookManager.getBooks({createdOn: now, limit: 10}, (books: Book[]) => {
            //TODO create html and show on page
        });
    }

    private buildListing(books:Book[]) {

    }
}