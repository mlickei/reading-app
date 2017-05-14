import {Serializable} from "../serializable";
import {Management} from "./management";
import {User} from "../user/user";
import {Popup} from "../components/popup";
import {Book, BookManager} from "./book-management";

export class ReadingList extends Serializable {
    constructor(public id:number, public name:String, public books:Book[]) {
        super();
    }
}

export class ReadingListManager extends Management {

    private $mgt;
    private $updateForm;
    private static URL = '/api/reading-list';
    private allowDelete: boolean;
    private allowUpdate: boolean;
    private allowAdd: boolean;
    private updatePopup: Popup;

    constructor(user:User) {
        super($('.reading-list-management'), user);
        this.$mgt = this.$target;
        this.$updateForm = this.$mgt.find('.update-reading-list-form');

        this.allowDelete = this.user.hasRole('READING_LIST_DELETE');
        this.allowUpdate = this.user.hasRole('READING_LIST_UPDATE');
        this.allowAdd = this.user.hasRole('READING_LIST_ADD');

        this.init();
    }

    refreshResults() {
        ReadingListManager.getReadingLists(this.filters, (readingLists: ReadingList[]) => {
            this.emptyList();
            this.buildReadingListListing(readingLists, this.$mgt.find('.listing'), this.updatePopup);
        });

        this.updateAvailableActions();
    }

    private updateAvailableActions() {
        this.$mgt.find('.btn.update-btn').attr('disabled', (this.allowUpdate ? 'disabled' : ''));
        this.$mgt.find('.btn.delete-btn').attr('disabled', (this.allowDelete ? 'disabled' : ''));
    }

    private static getBookListingItemHtml(book:Book) {
        return `<div class="reading-entry-book-info book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-isbn">${book.isbn}</div>
                </div>`;
    }

    private static buildReadingListBookHTML(book:Book, allowUpdate:boolean) {
        return `<div class="reading-entry-book book">
                    ${ReadingListManager.getBookListingItemHtml(book)}
                    <div class="reading-list-book-actions actions">
                        <button data-book-isbn="${book.isbn}" class="btn remove-btn reading-list-remove-book-btn" ` + ((!allowUpdate) ? `disabled="disabled"` : ``) + ` role="UPDATE">Remove Book</button>
                    </div>
                </div>`;
    }

    private static buildBookOpt(book: Book, selected): string {
        return `<option value="${book.isbn}" ` + ((selected) ? `selected="selected"` : ``) + `><i>${book.title}</i> ${book.authorLast} - ${book.isbn}</option>`;
    }

    private addBookForm($target, readingList:ReadingList) {
        BookManager.getBooks({
            readingList: {
                inList: false,
                id: readingList.id
            }
        }, (books: Book[]) => {
            let booksStr = '';

            for(let book of books) {
                booksStr = booksStr + ReadingListManager.buildBookOpt(book, false);
            }

            $target.prepend(`<div class="reading-list-add-book-options">
                        <select class="reading-list-add-book-select">
                            ${booksStr}
                        </select>
                    </div>`);
        });
    }

    private static buildReadingListHTML(readingList: ReadingList, allowDelete, allowUpdate): string {
        let books = '';

        for(let book of readingList.books) {
            books = books + ReadingListManager.buildReadingListBookHTML(book, allowUpdate);
        }

        return `<div class="reading-list item">
                    <div class="reading-list-info item-info">
                        <div class="reading-list-name"><span class="attr-lbl">Name</span><span class="attr-val">${readingList.name}</span></div>
                    </div>
                    <div class="reading-list-books">
                        ${books}
                    </div>
                    <div class="add-book-container">
                        <div class="reading-list-books-actions actions">
                            <button class="btn add-btn reading-list-add-book-btn" ` + ((!allowUpdate) ? `disabled="disabled"` : ``) + ` role="UPDATE">Add Book</button>
                        </div>
                    </div>
                    <div class="actions reading-list-actions">
                        <button class="btn update-btn" ` + ((!allowUpdate) ? `disabled="disabled"` : ``) + ` role="UPDATE">Update</button>
                        <button class="btn delete-btn" ` + ((!allowDelete) ? `disabled="disabled"` : ``) + ` role="DELETE">Delete</button>
                    </div>
                </div>`;
    }

    private buildReadingListListing(readingLists: ReadingList[], $target, popup: Popup) {
        for (let readingList of readingLists) {
            let $readingListHtml = $(ReadingListManager.buildReadingListHTML(readingList, this.allowDelete, this.allowUpdate)).appendTo($target),
                $bookList = $readingListHtml.find('.reading-list-books');

            this.addBookForm($readingListHtml.find('.add-book-container'), readingList);

            $readingListHtml.find('.actions').on('click', '.delete-btn', () => {
                let doDelete: boolean = confirm("Are you sure you want to delete " + readingList.name + "?");

                if (doDelete) {
                    ReadingListManager.deleteReadingList(readingList, () => {
                        this.refreshResults();
                    });
                }
            }).on('click', '.update-btn:not(.reading-list-add-book-btn)', () => {
                // let $popupForm = popup.open();
                // this.showUpdateBookForm($popupForm, readingList, popup);
            }).on('click', '.reading-list-add-book-btn', () => {
                let $bookSelect = $readingListHtml.find('.reading-list-add-book-select'),
                    bookVal = $bookSelect.val();

                readingList.books.push(bookVal);
                ReadingListManager.addBookToReadingList(readingList, bookVal, (newReadingList, book) => {
                    readingList = newReadingList;
                    $bookSelect.remove('option:selected');
                    $bookList.append(ReadingListManager.getBookListingItemHtml(book));
                });
            }).on('click', '.reading-list-remove-book-btn', (evt) => {
                let $btn = $(evt.target),
                    isbn = $btn.data('book-isbn');

                ReadingListManager.removeBookFromReadingList(readingList, isbn, () => {

                });
            });
        }
    }

    private static buildEmptyReadingListFromForm($form): ReadingList {
        let name: string = $form.find('input[name="name"]').val();
        return new ReadingList(null, name, []);
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
            this.$mgt.find('.form.add-reading-list-form').addClass('hidden');
        }

        $form.on('submit', (evt) => {
            evt.preventDefault();
            let newReadingList = ReadingListManager.buildEmptyReadingListFromForm($form);

            ReadingListManager.insertReadingList(newReadingList, () => {
                this.refreshResults();
            });

            $form.find('.btn.reset-btn').click();
        });
    }

    private setupListing($listing) {
        let $list = $listing.find('.reading-lists');
        this.updatePopup = new Popup(this.$updateForm, {});

        ReadingListManager.getReadingLists({}, (readingLists: ReadingList[]) => {
            this.buildReadingListListing(readingLists, $list, this.updatePopup);
        });
    }

    public init() {
        const $addReadingListForm = this.$mgt.find('.add-reading-list-form form');
        if ($addReadingListForm.length) {
            this.setupInsertForm($addReadingListForm);
        }

        const $readingListListing = this.$mgt.find('.reading-list-listing');
        if ($readingListListing.length) {
            return this.setupListing($readingListListing);
        }
    }

    public static getReadingLists(searchConstraints, callback: (readingLists: ReadingList[]) => void) {
        let readingLists: ReadingList[] = [];
        $.ajax(this.URL, {
            type: "GET",
            data: searchConstraints
        }).done((data) => {
            for (let readingListObj of JSON.parse(data)) {
                let books:Book[] = [];
                for (let bookObj of readingListObj.books) {
                    books.push(new Book(bookObj.isbn, bookObj.title, bookObj.pages, bookObj.authorFirst, bookObj.authorLast));
                }

                readingLists.push(new ReadingList(readingListObj.id, readingListObj.name, books));
            }
            callback(readingLists);
        }).fail(() => {
            alert("Failed to retrieve reading lists ( * ಥ ⌂ ಥ * )");
            callback(readingLists);
        });
    }

    public static removeBookFromReadingList(readingList: ReadingList, isbn: String, callback: (newReadingList: ReadingList) => void) {
        $.ajax(this.URL, {
            type: "POST",
            data: {
                id: readingList.id,
                isbn: isbn,
                removeBook: 1
            }
        }).done((data) => {
            let jsonData = JSON.parse(data);

            let newReadingList = new ReadingList(null, null, null);
            newReadingList.fromJSONObj(jsonData.readingList);

            alert("Successfully removed " + newReadingList.name + " from " + newReadingList.name);
            callback(newReadingList);
        }).fail(() => {
            alert("Failed to create the reading list ༼⁰o⁰；༽");
            callback(null);
        });
    }

    public static insertReadingList(readingList: ReadingList, doneCallback: () => void) {
        $.ajax(this.URL, {
            type: "POST",
            data: JSON.parse(JSON.stringify(readingList))
        }).done(() => {
            alert("Successfully added new reading list: " + readingList.name);
            doneCallback();
        }).fail(() => {
            alert("Failed to create reading list | ◯ ‸ ◯ |");
            doneCallback();
        });
    }

    public static addBookToReadingList(readingList: ReadingList, isbn: String, callback: (newReadingList: ReadingList, book: Book) => void) {
        $.ajax(this.URL, {
            type: "POST",
            data: {
                id: readingList.id,
                isbn: isbn,
                addBook: 1
            }
        }).done((data) => {
            let jsonData = JSON.parse(data);

            let newReadingList = new ReadingList(null, null, null);
            newReadingList.fromJSONObj(jsonData.readingList);

            let book = new Book(null, null, null, null, null);
            book.fromJSONObj(jsonData.book);
            alert("Successfully added " + book.title + " to " + newReadingList.name);
            callback(newReadingList, book);
        }).fail(() => {
            alert("Failed to create the reading list ༼⁰o⁰；༽");
            callback(null, null);
        });
    }


    public static updateReadingList(readingList: ReadingList, callback: (newReadingList: ReadingList) => void) {
        let sendData = JSON.parse(JSON.stringify(readingList));
        sendData = $.extend(true, sendData, {update: 1});

        $.ajax(this.URL, {
            type: "POST",
            data: sendData
        }).done((data) => {
            let newReadingList = new ReadingList(null, null, null);
            newReadingList.fromJSON(data);
            alert("Successfully updated " + newReadingList.name);
            callback(newReadingList);
        }).fail(() => {
            alert("Failed to create the reading list ༼⁰o⁰；༽");
            callback(null);
        });
    }

    public static deleteReadingList(readingList:ReadingList, doneCallback: () => void) {
        $.ajax(this.URL, {
            type: "POST",
            data: {
                id: readingList.id,
                delete: 1
            }
        }).done(() => {
            alert("Deleted reading list!");
            doneCallback();
        }).fail(() => {
            alert("Failed to delete the reading list (┛ಠДಠ)┛彡┻━┻");
            doneCallback();
        });
    }
}