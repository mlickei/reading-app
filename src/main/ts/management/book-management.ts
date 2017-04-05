class Book extends Serializable {
    constructor(public isbn:string, public title:string, public pages:number, public authorFirst:string, public authorLast:string) {
        super();
    }
}

class BookManager extends Management {
    private $bookMgt;
    private $updateForm;
    private static BOOK_URL = '/api/book';
    private allowDelete:boolean;
    private allowUpdate:boolean;
    private allowAdd:boolean;

    constructor(user:User) {
        super($('.book-management'), user);
        this.$bookMgt = this.$target;
        this.$updateForm = this.$bookMgt.find('.update-book-form');

        this.allowDelete = this.user.hasRole('BOOK_DELETE');
        this.allowUpdate = this.user.hasRole('BOOK_UPDATE');
        this.allowAdd = this.user.hasRole('BOOK_ADD');

        if(this.$bookMgt.length) {
            this.init();
        }
    }

    refreshResults() {
        BookManager.getAllBooks((books: Book[]) => {
            this.emptyList();
            this.buildBooksListing(books, this.$bookMgt.find('.listing'));
        });

        this.updateAvailableActions();
    }

    private static buildBookFromForm($form):Book {
        let title: string = $form.find('input[name="title"]').val();
        let isbn: string = $form.find('input[name="isbn"]').val();
        let pages: number = $form.find('input[name="pages"]').val();
        let authorFirst: string = $form.find('input[name="authorFirst"]').val();
        let authorLast: string = $form.find('input[name="authorLast"]').val();

        return new Book(isbn, title, pages, authorFirst, authorLast);
    }

    private static fillInFormValues($targetForm, book:Book) {
        $targetForm.find('input:not(.btn)').each((idx, input) => {
            let $input = $(input),
                valName = $input.attr('name');

            $input.val(book[valName]);
        });
    }

    private setupInsertForm($form) {
        if(!this.allowAdd) {
            this.$bookMgt.find('.form.add-book-form').addClass('hidden');
            //TODO make it so that they can request for a book to be added.
        }

        $form.on('submit', (evt) => {
            evt.preventDefault();
            let newBook = BookManager.buildBookFromForm($form);

            BookManager.insertBook(newBook, () => {
                this.refreshResults();
            });

            $form.find('.btn.reset-btn').click();
        });
    }

    private static buildBookHTML(book:Book, allowDelete, allowUpdate):string {
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
                        <button class="btn update-btn" ` + ((!allowUpdate) ? `disabled="disabled"` : ``) + ` role="UPDATE">Update</button>
                        <button class="btn delete-btn" ` + ((!allowDelete) ? `disabled="disabled"` : ``) + ` role="DELETE">Delete</button>
                    </div>
                </div>`;
    }

    private showUpdateBookForm(book:Book) {
        BookManager.fillInFormValues(this.$updateForm, book);

        this.$updateForm.removeClass('hidden').find('form').removeClass('hidden');
        this.$updateForm.on('submit', (evt) => {
            evt.preventDefault();
            let book = BookManager.buildBookFromForm(this.$updateForm);
            BookManager.updateBook(book, (book: Book) => {
                if(book !== null) {
                    this.refreshResults();
                    this.$updateForm.addClass('hidden');
                }
            });
        });
    }

    private buildBooksListing(books:Book[], $target) {
        for (let book of books) {
            let $newBook = $(BookManager.buildBookHTML(book, this.allowDelete, this.allowUpdate)).appendTo($target);
            $newBook.find('.actions').on('click', '.delete-btn', () => {
                BookManager.deleteBook(book, () => {
                    this.refreshResults();
                });
            }).on('click', '.update-btn', () => {
                this.showUpdateBookForm(book);
            });
        }
    }

    private setupListing($listing) {
        let $list = $listing.find('.books');
        BookManager.getAllBooks((books:Book[]) => {
            this.buildBooksListing(books, $list);
        });
    }

    private updateAvailableActions() {
        this.$bookMgt.find('.btn.update-btn').attr('disabled', (this.allowUpdate ? 'disabled': ''));
        this.$bookMgt.find('.btn.delete-btn').attr('disabled', (this.allowDelete ? 'disabled': ''));
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
                books.push(new Book(bookObj.isbn, bookObj.title, bookObj.pages, bookObj.authorFirst, bookObj.authorLast));
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

    public static updateBook(book:Book, callback:(book:Book) => void) {
        let sendData = JSON.parse(JSON.stringify(book));
        sendData = $.extend(true, sendData, {update: 1});

        $.ajax(this.BOOK_URL, {
            type: "POST",
            data: sendData
        }).done((data) => {
            //TODO GET THE STUPID BOOK
            let newBook = new Book(null, null, null, null, null);
            newBook.fromJSON(data);
            alert("Successfully updated " + newBook.title + " to library");
            callback(newBook);
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create book (-_-｡)");
            callback(null);
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