class ReadingEntry extends Serializable {
    constructor(public book:Book, public user:User, public startPage:number, public endPage:number, public startTime:string, public endTime:string) {
        super();
    }
}

class EntryManager {
    private $entryMgt;
    private static ENTRY_URL = '/reading-app/api/reading-entry';

    constructor() {
        this.$entryMgt = $('.entry-management');

        new Requirement("BookManagement", "resources/javascript/management/book-management.js", ()=> {
            if(this.$entryMgt.length) {
                this.init();
            }
        });
    }

    private static findBook(books:Book[], sISBN:string):Book {
        for(let sB of books) {
            if(sB.isbn === sISBN) {
                return sB;
            }
        }

        return null;
    }

    private static buildBookOpt(book:Book):string {
        return `<option value="${book.isbn}"><i>${book.title}</i> ${book.authorLast}, ${book.authorFirst} - ${book.isbn}</option>`;
    }

    private static setupInsertForm($form, books:Book[]) {
        const $bookSel = $form.find('select[name="book"]');
        for(let book of books) {
            $bookSel.append(EntryManager.buildBookOpt(book));
        }

        $form.on('submit', (evt) => {
            evt.preventDefault();

            let bookId: string = $bookSel.val();
            let startPage: number = $form.find('input[name="startPage"]').val();
            let endPage: number = $form.find('input[name="endPage"]').val();
            let startTime: string = $form.find('input[name="startTime"]').val();
            let endTime: string = $form.find('input[name="endTime"]').val();

            let newBook: ReadingEntry = new ReadingEntry(EntryManager.findBook(books, bookId), appAuth.currentUser, startPage, endPage, startTime, endTime);
            EntryManager.insertBook(newBook);
        });
    }

    private static buildEntryHTML(entry:ReadingEntry):string {
        return `<div class="entry"><div class="entry-book-title">${entry.book.title}</div><div class="pages-read">${(entry.endPage - entry.startPage) + 1}</div><div class="start-time">${entry.startTime}</div><div class="end-time">${entry.endTime}</div></div>`;
    }

    private static setupListing($listing) {
        let $list = $listing.find('.entries');
        EntryManager.getAllEntries((books:ReadingEntry[]) => {
            for(let book of books) {
                $list.append(EntryManager.buildEntryHTML(book));
            }
        });
    }

    public init() {
        const $entryMgtForm = this.$entryMgt.find('.add-entry-form form');
        if($entryMgtForm.length) {
            BookManager.getAllBooks((books:Book[]) => {
                EntryManager.setupInsertForm($entryMgtForm, books);
            });
        }

        const $entryListing = this.$entryMgt.find('.entry-listing');
        if($entryListing.length) {
            return EntryManager.setupListing($entryListing);
        }
    }

    public static getAllEntries(callback:(array:ReadingEntry[])=> void) {
        let entries:ReadingEntry[] = [];
        $.ajax(this.ENTRY_URL, {
            type: "GET"
        }).done((data) => {
            for(let entryObj of JSON.parse(data)) {
                entries.push(new ReadingEntry(new Book(entryObj.book.isbn, entryObj.book.title, entryObj.book.pages, entryObj.book.authorFirst, entryObj.book.authorLast), new User(entryObj.user.id, entryObj.user.firstName, entryObj.user.lastName, entryObj.user.username, entryObj.user.email), entryObj.startPage, entryObj.endPage, entryObj.startTime, entryObj.endTime));
            }
            callback(entries);
        }).fail(() => {
            alert("Failed to retrieve entries ( * ಥ ⌂ ಥ * )");
            callback(entries);
        });
    }

    public static getEntry(id:string):ReadingEntry {
        $.ajax(this.ENTRY_URL, {
            type: "GET"
        }).done((data) => {
            let entry = new ReadingEntry(null, null, null, null, null, null);
            entry.fromJSON(data);
            return entry;
        }).fail(() => {
            alert("Failed to retrieve entry ʕ ಡ ﹏ ಡ ʔ");
        });

        return null;
    }

    public static insertBook(newEntry:ReadingEntry) {
        $.ajax(this.ENTRY_URL, {
            type: "PUT",
            data: JSON.parse(JSON.stringify(newEntry))
        }).done(() => {
            alert("Successfully added entry!");
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create entry (-_-｡)");
        });
    }
}