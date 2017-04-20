import {Serializable} from "../serializable";
import {Management} from "./management";
import {User} from "../user/user";
import {Popup} from "../components/popup";

export class Book extends Serializable {
    constructor(public isbn: string, public title: string, public pages: number, public authorFirst: string, public authorLast: string) {
        super();
    }
}

export class BookManager extends Management {

    private $bookMgt;
    private $updateForm;
    private static BOOK_URL = '/api/book';
    private allowDelete: boolean;
    private allowUpdate: boolean;
    private allowAdd: boolean;
    private updatePopup: Popup;

    constructor(user: User) {
        super($('.book-management'), user);
        this.$bookMgt = this.$target;
        this.$updateForm = this.$bookMgt.find('.update-book-form');

        this.allowDelete = this.user.hasRole('BOOK_DELETE');
        this.allowUpdate = this.user.hasRole('BOOK_UPDATE');
        this.allowAdd = this.user.hasRole('BOOK_ADD');

        if (this.$bookMgt.length) {
            this.init();
        }
    }

    refreshResults() {
        BookManager.getBooks(this.filters, (books: Book[]) => {
            this.emptyList();
            this.buildBooksListing(books, this.$bookMgt.find('.listing'), this.updatePopup);
        });

        this.updateAvailableActions();
    }

    private static buildBookFromForm($form): Book {
        let title: string = $form.find('input[name="title"]').val();
        let isbn: string = $form.find('input[name="isbn"]').val();
        let pages: number = $form.find('input[name="pages"]').val();
        let authorFirst: string = $form.find('input[name="authorFirst"]').val();
        let authorLast: string = $form.find('input[name="authorLast"]').val();

        return new Book(isbn, title, pages, authorFirst, authorLast);
    }

    private static fillInFormValues($targetForm, book: Book) {
        $targetForm.find('input:not(.btn)').each((idx, input) => {
            let $input = $(input),
                valName = $input.attr('name');

            $input.val(book[valName]);
        });
    }

    private setupInsertForm($form) {
        if (!this.allowAdd) {
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

    private static buildBookHTML(book: Book, allowDelete, allowUpdate): string {
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

    private showUpdateBookForm($updateForm, book: Book, popup: Popup) {
        BookManager.fillInFormValues($updateForm, book);

        $updateForm.removeClass('hidden').find('form').removeClass('hidden');
        $updateForm.on('submit', (evt) => {
            evt.preventDefault();
            let book = BookManager.buildBookFromForm($updateForm);
            BookManager.updateBook(book, (book: Book) => {
                if (book !== null) {
                    this.refreshResults();
                    $updateForm.addClass('hidden');
                }
            });
            popup.close();
        });
    }

    private buildBooksListing(books: Book[], $target, popup: Popup) {
        for (let book of books) {
            let $newBook = $(BookManager.buildBookHTML(book, this.allowDelete, this.allowUpdate)).appendTo($target);

            $newBook.find('.actions').on('click', '.delete-btn', () => {
                let doDelete: boolean = confirm("Are you sure you want to delete " + book.title + "?");

                if (doDelete) {
                    BookManager.deleteBook(book, () => {
                        this.refreshResults();
                    });
                }
            }).on('click', '.update-btn', () => {
                let $popupForm = popup.open();
                this.showUpdateBookForm($popupForm, book, popup);
            });
        }
    }

    private setupListing($listing) {
        let $list = $listing.find('.books');
        this.updatePopup = new Popup(this.$updateForm, {});

        BookManager.getBooks({}, (books: Book[]) => {
            this.buildBooksListing(books, $list, this.updatePopup);
        });
    }

    private updateAvailableActions() {
        this.$bookMgt.find('.btn.update-btn').attr('disabled', (this.allowUpdate ? 'disabled' : ''));
        this.$bookMgt.find('.btn.delete-btn').attr('disabled', (this.allowDelete ? 'disabled' : ''));
    }

    public init() {
        const $bookMgtForm = this.$bookMgt.find('.add-book-form form');
        if ($bookMgtForm.length) {
            this.setupInsertForm($bookMgtForm);
        }

        const $bookListing = this.$bookMgt.find('.book-listing');
        if ($bookListing.length) {
            return this.setupListing($bookListing);
        }
    }

    public static getBooks(searchConstraints, callback: (array: Book[]) => void) {
        let books: Book[] = [];
        $.ajax(this.BOOK_URL, {
            type: "GET",
            data: searchConstraints
        }).done((data) => {
            for (let bookObj of JSON.parse(data)) {
                books.push(new Book(bookObj.isbn, bookObj.title, bookObj.pages, bookObj.authorFirst, bookObj.authorLast));
            }
            callback(books);
        }).fail(() => {
            alert("Failed to retrieve books ( * ಥ ⌂ ಥ * )");
            callback(books);
        });
    }

    public static insertBook(newBook: Book, doneCallback: () => void) {
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

    public static updateBook(book: Book, callback: (book: Book) => void) {
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

    public static deleteBook(book: Book, doneCallback: () => void) {
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