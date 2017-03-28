class Book extends Serializable {
    constructor(public isbn:string, public title:string, public pages:number, public authorFirst:string, public authorLast:string) {
        super();
    }
}

class BookManager {
    private $bookMgt;
    private static BOOK_URL = '/api/book';

    constructor() {
        this.$bookMgt = $('.book-management');

        if(this.$bookMgt.length) {
            this.init();
        }
    }

    private static setupInsertForm($form) {
        $form.on('submit', (evt) => {
            evt.preventDefault();

            let title: string = $form.find('input[name="title"]').val();
            let isbn: string = $form.find('input[name="isbn"]').val();
            let pages: number = $form.find('input[name="pages"]').val();
            let authorFirst: string = $form.find('input[name="authorFirst"]').val();
            let authorLast: string = $form.find('input[name="authorLast"]').val();

            let newBook: Book = new Book(isbn, title, pages, authorFirst, authorLast);
            BookManager.insertBook(newBook);
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

    private static setupListing($listing) {
        let $list = $listing.find('.books');
        BookManager.getAllBooks((books:Book[]) => {
            for(let book of books) {
                let $newBook = $(BookManager.buildBookHTML(book)).appendTo($list);
                $newBook.find('.actions').on('click', '.delete-btn', () => {
                    BookManager.deleteBook(book);
                });
            }
        });
    }

    public init() {
        const $bookMgtForm = this.$bookMgt.find('.add-book-form form');
        if($bookMgtForm.length) {
            BookManager.setupInsertForm($bookMgtForm);
        }

        const $bookListing = this.$bookMgt.find('.book-listing');
        if($bookListing.length) {
            return BookManager.setupListing($bookListing);
        }

        //TODO Add refresh button and function
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

    public static insertBook(newBook:Book) {
        $.ajax(this.BOOK_URL, {
            type: "POST",
            data: JSON.parse(JSON.stringify(newBook))
        }).done(() => {
            alert("Successfully added " + newBook.title + " to library");
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create book (-_-｡)");
        });
    }

    public static deleteBook(book:Book) {
        $.ajax(this.BOOK_URL, {
            type: "POST",
            data: {
                isbn: book.isbn,
                delete: 1
            }
        }).done(() => {
            alert("Deleted book!");
        }).fail(() => {
            alert("Failed to delete book ༼    ಠ   ͟ʖ  ಠ   ༽");
        });
    }

}