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
        return `<div class="book"><div class="book-title">${book.title}</div><div class="book-isbn">${book.isbn}</div><div class="book-author"><div class="author-last">${book.authorLast}</div><div class="author-first">${book.authorFirst}</div></div></div>`;
    }

    private static setupListing($listing) {
        let $list = $listing.find('.books');
        BookManager.getAllBooks((books:Book[]) => {
            for(let book of books) {
                $list.append(BookManager.buildBookHTML(book));
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
}