class Book extends Serializable {
    constructor(public isbn:string, public title:string, public pages:number, public authorFirst:string, public authorLast:string) {
        super();
    }
}

class BookManager extends Management {
    private $bookMgt;
    private static BOOK_URL = '/api/book';

    constructor() {
        super($('.book-management'));
        this.$bookMgt = this.$target;

        if(this.$bookMgt.length) {
            this.init();
        }
    }

    refreshResults() {
        BookManager.getAllBooks((books: Book[]) => {
            this.emptyList();
            this.buildBooksListing(books, this.$bookMgt.find('.listing'));
        });
    }

    private setupInsertForm($form) {
        $form.on('submit', (evt) => {
            evt.preventDefault();

            let title: string = $form.find('input[name="title"]').val();
            let isbn: string = $form.find('input[name="isbn"]').val();
            let pages: number = $form.find('input[name="pages"]').val();
            let authorFirst: string = $form.find('input[name="authorFirst"]').val();
            let authorLast: string = $form.find('input[name="authorLast"]').val();

            let newBook: Book = new Book(isbn, title, pages, authorFirst, authorLast);
            BookManager.insertBook(newBook, () => {
                this.refreshResults();
            });
            //TODO EMPTY FORM OF WHAT WAS LAST ENTERED
        });
    }

    private static buildBookHTML(book:Book):string {
        return `<div class="book item">
                    <div class="book-info item-info">
                        <div class="book-title"><span class="attr-lbl">Title</span><span class="attr-val">${book.title}</span></div>
                        <div class="book-isbn"><span class="attr-lbl">ISBN</span><span class="attr-val">${book.isbn}</span></div>
                        <div class="book-author">
                            <span class="attr-lbl">Author</span>
                            <div class="attr-val">
                                <div class="author-last">${book.authorLast}</div>
                                <div class="author-first">${book.authorFirst}</div>
                            </div>
                        </div>
                    </div>
                    <div class="actions book-actions">
                        <button class="btn update-btn" disabled="disabled">Update</button>
                        <button class="btn delete-btn">Delete</button>
                    </div>
                </div>`;
    }

    private buildBooksListing(books:Book[], $target) {
        for (let book of books) {
            let $newBook = $(BookManager.buildBookHTML(book)).appendTo($target);
            $newBook.find('.actions').on('click', '.delete-btn', () => {
                BookManager.deleteBook(book, () => {
                    this.refreshResults();
                });
            });
        }
    }

    private setupListing($listing) {
        let $list = $listing.find('.books');
        BookManager.getAllBooks((books:Book[]) => {
            this.buildBooksListing(books, $list);
        });
    }

    private emptyList() {
        const $list = this.$bookMgt.find('.listing');
        $list.empty();
    }

    public init() {
        const $bookMgtForm = this.$bookMgt.find('.add-book-form form');
        if($bookMgtForm.length) {
            this.setupInsertForm($bookMgtForm);
        }

        const $bookListing = this.$bookMgt.find('.book-listing');
        if($bookListing.length) {
            return this.setupListing($bookListing);
        }
    }

    public static getAllBooks(callback:(array:Book[])=> void) {
        let books:Book[] = [];
        $.ajax(this.BOOK_URL, {
            type: "GET"
        }).done((data) => {
            for(let bookObj of JSON.parse(data)) {
                books.push(new Book(bookObj.isbn, bookObj.title, bookObj.number, bookObj.authorFirst, bookObj.authorLast));
            }
            callback(books);
        }).fail(() => {
            alert("Failed to retrieve books ( * ಥ ⌂ ಥ * )");
            callback(books);
        });
    }

    public static getBook(isbn:string):Book {
        $.ajax(this.BOOK_URL, {
            type: "GET"
        }).done((data) => {
            let book = new Book(null, null, null, null, null);
            book.fromJSON(data);
            return book;
        }).fail(() => {
            alert("Failed to retrieve book ʕ ಡ ﹏ ಡ ʔ");
        });

        return null;
    }

    public static insertBook(newBook:Book, doneCallback:() => void) {
        $.ajax(this.BOOK_URL, {
            type: "POST",
            data: JSON.parse(JSON.stringify(newBook))
        }).done(() => {
            alert("Successfully added " + newBook.title + " to library");
            doneCallback();
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create book (-_-｡)");
            doneCallback();
        });
    }

    public static deleteBook(book:Book, doneCallback:() => void) {
        $.ajax(this.BOOK_URL, {
            type: "POST",
            data: {
                isbn: book.isbn,
                delete: 1
            }
        }).done(() => {
            alert("Deleted book!");
            doneCallback();
        }).fail(() => {
            alert("Failed to delete book ༼    ಠ   ͟ʖ  ಠ   ༽");
            doneCallback();
        });
    }

}