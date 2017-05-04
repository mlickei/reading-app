import {Serializable} from "../serializable";
import {User} from "../user/user";
import {Book, BookManager} from "./book-management";
import {Management} from "./management";
import {AppAuth} from "../user/auth";
import {Popup} from "../components/popup";
import {Form, Validator} from "../components/form";
import moment = require('moment');
import Moment = moment.Moment;

export class ReadingEntry extends Serializable {
    public id: number;

    constructor(public book: Book, public user: User, public startPage: number, public endPage: number, public startTime: string, public endTime: string, public notes: string) {
        super();
    }

    public isFinished(): boolean {
        return this.endPage > 0;
    }
}

function isDefined(val):boolean {
    return (val !== undefined);
}

export class EntryManager extends Management {

    private $entryMgt;
    private $updateForm;
    private allowUpdate: boolean;
    private allowDelete: boolean;
    private allowAdd: boolean;
    private updatePopup: Popup;
    private static ENTRY_URL = '/api/reading-entry';
    private static SRC_TIME_FORMAT = "MMM D,YYYY h:mm:ss A";

    constructor(user: User) {
        super($('.entry-management'), user);
        this.$entryMgt = this.$target;
        this.$updateForm = this.$entryMgt.find('.update-entry-form');

        this.allowDelete = this.user.hasRole('ENTRIES_DELETE');
        this.allowUpdate = this.user.hasRole('ENTRIES_UPDATE');
        this.allowAdd = this.user.hasRole('ENTRIES_ADD');

        if (this.$entryMgt.length) {
            this.init();
        }
    }

    refreshResults() {
        this.getAllEntries((entries: ReadingEntry[]) => {
            this.emptyList();
            this.buildEntriesListing(entries, this.$entryMgt.find('.listing'), this.updatePopup);
        });
    }

    private static findBook(books: Book[], sISBN: string): Book {
        for (let sB of books) {
            if (sB.isbn === sISBN) {
                return sB;
            }
        }

        return null;
    }

    private static buildBookOpt(book: Book, selected): string {
        return `<option value="${book.isbn}" ` + ((selected) ? `selected="selected"` : ``) + `><i>${book.title}</i> ${book.authorLast} - ${book.isbn}</option>`;
    }

    private setupForm($form):Validator[] {
        let validators:Validator[] = [];
        const TIME_FORMAT = "YYYY-MM-DD hh:mm:ss";

        $form.find('.field').each((idx, field) => {
            let $field = $(field),
                isRequired = $field.hasClass('required'),
                requiresValidation = $field.hasClass('validate'),
                $input = $field.find('input,textarea,select');

            if (isRequired || requiresValidation) {
                let validator = new Validator($field, $input, isRequired, "Please enter a valid value.", (val) => {
                    let isValid = true;

                    if(requiresValidation) {
                        let isTimeField = $field.hasClass('time-field'),
                            maxTime = $field.data('max-time'),
                            maxTimeField = $field.data('max-time-field'),
                            maxTimeFieldVal = $form.find(`[name="${maxTimeField}"]`).val(),
                            minTime = $field.data('min-time'),
                            minTimeField = $field.data('min-time-field'),
                            minTimeFieldVal = $form.find(`[name="${minTimeField}"]`).val(),
                            max = $field.data('max'),
                            maxField = $field.data('max-field'),
                            maxFieldVal = $form.find(`[name="${maxField}"]`).val(),
                            min = $field.data('min'),
                            minField = $field.data('min-field'),
                            minFieldVal = $form.find(`[name="${minField}"]`).val();

                        if(isTimeField) {
                            let maxTimeVal,
                                minTimeVal;

                            if(maxTime === 'NOW') {
                                maxTimeVal = moment();
                            } else {
                                maxTimeVal = moment(maxTime, TIME_FORMAT);
                            }

                            if(minTime === 'NOW') {
                                minTimeVal = moment();
                            } else {
                                minTimeVal = moment(minTime, TIME_FORMAT);
                            }

                            let maxTimeFieldValParsed = moment(maxTimeFieldVal, TIME_FORMAT);
                            let minTimeFieldValParsed = moment(minTimeFieldVal, TIME_FORMAT);
                            let parsedVal = moment(val, TIME_FORMAT);

                            if(isDefined(maxTimeFieldVal) && maxTimeFieldVal !== '' && maxTimeFieldVal !== null) {
                                isValid = isValid && parsedVal.isBefore(maxTimeFieldValParsed);
                            }

                            if(isDefined(maxTime)) {
                                isValid = isValid && parsedVal.isBefore(maxTimeVal);
                            }

                            if(isDefined(minTimeFieldVal) && minTimeFieldVal !== '' && minTimeFieldVal !== null) {
                                isValid = isValid && parsedVal.isAfter(minTimeFieldValParsed);
                            }

                            if(isDefined(minTime)) {
                                isValid = isValid && parsedVal.isAfter(minTimeVal);
                            }
                        } else {
                            let parsedVal = parseFloat(val),
                                parsedMax = parseFloat(max),
                                parsedMaxField = parseFloat(maxFieldVal),
                                parsedMin = parseFloat(min),
                                parsedMinField = parseFloat(minFieldVal);

                            if(isDefined(max)) {
                                isValid = isValid && parsedVal <= parsedMax;
                            }

                            if(isDefined(maxFieldVal) && maxFieldVal !== '' && maxFieldVal !== null) {
                                isValid = isValid && parsedVal <= parsedMaxField;
                            }

                            if(isDefined(min)) {
                                isValid = isValid && parsedVal >= parsedMin;
                            }

                            if(isDefined(minFieldVal) && minFieldVal !== '' && minFieldVal !== null) {
                                isValid = isValid && parsedVal >= parsedMinField;
                            }
                        }
                    }

                    return isValid;
                });

                validators.push(validator);
            }
        });

        return validators;
    }

    private setupInsertForm($form, books: Book[]) {
        let appAuth: AppAuth = new AppAuth();

        if (!this.allowAdd) {
            this.$entryMgt.find('.add-entry-form').addClass('hidden');
        }

        const $bookSel = $form.find('select[name="book"]');
        for (let book of books) {
            $bookSel.append(EntryManager.buildBookOpt(book, false));
        }

        let formObj:Form = new Form($form, this.setupForm($form));

        $form.on('submit', (evt) => {
            evt.preventDefault();

            let validForm = formObj.validateForm();
            if(validForm) {
                let bookId: string = $bookSel.val();
                let startPage: number = $form.find('input[name="startPage"]').val();
                let endPage: number = $form.find('input[name="endPage"]').val();
                let startTime: string = $form.find('input[name="startTime"]').val();
                let endTime: string = $form.find('input[name="endTime"]').val();
                let notes: string = $form.find('textarea[name="notes"]').val();

                appAuth.retrieveLoggedInUser((curUser: User) => {
                    let newBook: ReadingEntry = new ReadingEntry(EntryManager.findBook(books, bookId), curUser, startPage, endPage, startTime, endTime, notes);
                    EntryManager.insertEntry(newBook, () => {
                        this.refreshResults();
                    });
                });

                $form.find('.btn.reset-btn').click();
            } else {
                alert("SOMETHINGS WRONG");
            }
        });
    }

    private setupStartNewForm($form, books: Book[]) {
        let appAuth: AppAuth = new AppAuth();

        if (!this.allowAdd) {
            this.$entryMgt.find('.start-entry-form').addClass('hidden');
        }

        const $bookSel = $form.find('select[name="book"]');
        for (let book of books) {
            $bookSel.append(EntryManager.buildBookOpt(book, false));
        }

        $form.on('submit', (evt) => {
            evt.preventDefault();

            let bookId: string = $bookSel.val();
            let startPage: number = $form.find('input[name="startPage"]').val();
            let startTime: string = $form.find('input[name="startTime"]').val();

            appAuth.retrieveLoggedInUser((curUser: User) => {
                let newBook: ReadingEntry = new ReadingEntry(EntryManager.findBook(books, bookId), curUser, startPage, null, startTime, null, null);
                EntryManager.insertEntry(newBook, () => {
                    this.refreshResults();
                });
            });

            $form.find('.btn.reset-btn').click();
        });
    }

    private static fillInFormValues($targetForm, entry: ReadingEntry) {
        $targetForm.find('input:not(.btn), select').each((idx, input) => {
            let $input = $(input),
                valName = $input.attr('name'),
                type = $input.data('time-picker');

            let value = entry[valName];

            if (type === "timestamp") {
                if (valName === "endTime" && (entry.endTime === null || entry.endTime === undefined)) {
                    value = moment().format(EntryManager.SRC_TIME_FORMAT);
                }

                $input.val(value);
                $input.flatpickr({
                    enableTime: true,
                    enableSeconds: true,
                    defaultDate: value,
                    dateFormat: "M d, Y h:i:S K"
                });
            } else {
                if (valName === 'book') {
                    $input.data('default', entry.book.isbn);
                } else {
                    $input.val(value);
                }
            }
        });
    }

    private static buildEntryFromForm($form, books: Book[], callback: (entry: ReadingEntry) => void) {
        let appAuth: AppAuth = new AppAuth();

        let bookId: string = $form.find('select[name="book"]').val();
        let startPage: number = $form.find('input[name="startPage"]').val();
        let endPage: number = $form.find('input[name="endPage"]').val();
        let startTime: string = $form.find('input[name="startTime"]').val();
        let endTime: string = $form.find('input[name="endTime"]').val();
        let notes: string = $form.find('textarea[name="notes"]').val();

        appAuth.retrieveLoggedInUser((curUser: User) => {
            callback(new ReadingEntry(EntryManager.findBook(books, bookId), curUser, startPage, endPage, startTime, endTime, notes));
        });
    }

    private showUpdateEntryForm($updateForm, entry: ReadingEntry, popup: Popup) {
        EntryManager.fillInFormValues($updateForm, entry);

        BookManager.getBooks({}, (books: Book[]) => {
            const $bookSel = $updateForm.find('select[name="book"]'),
                selected = $bookSel.data('default');
            for (let book of books) {
                $bookSel.append(EntryManager.buildBookOpt(book, (selected === book.isbn)));
            }

            $updateForm.removeClass('hidden').find('form').removeClass('hidden');
            popup.setOverlayWrapperHeight();

            $updateForm.on('submit', (evt) => {
                evt.preventDefault();
                EntryManager.buildEntryFromForm($updateForm, books, (buildEntry) => {
                    buildEntry.id = entry.id;
                    EntryManager.updateEntry(buildEntry, (entry: ReadingEntry) => {
                        if (entry !== null) {
                            this.refreshResults();
                            $updateForm.addClass('hidden');
                        }
                    });
                });
                popup.close();
            });
        });
    }

    private static buildFinishedEntryHTML(entry: ReadingEntry, allowUpdate, allowDelete): string {
        let readingDuration = moment(entry.endTime, EntryManager.SRC_TIME_FORMAT).diff(moment(entry.startTime, EntryManager.SRC_TIME_FORMAT)),
            duration = moment.duration(readingDuration);

        return `<div class="entry item">
                    <div class="entry-info item-info">
                        <div class="entry-book-title"><span class="attr-lbl">Name</span><span class="attr-val">${entry.book.title}</span></div>
                        <div class="pages-read"><span class="attr-lbl">Pages</span><span class="attr-val">${(entry.endPage - entry.startPage) + 1}</span></div>
                        <div class="start-time"><span class="attr-lbl">Start Time</span><span class="attr-val">${entry.startTime}</span></div>
                        <div class="reading-duration"><span class="attr-lbl">Reading Duration</span><span class="attr-val">${Math.round(duration.asMinutes())} min</span></div>
                    </div>
                    <div class="actions entry-actions">
                        <button class="btn update-btn" ` + ((!allowUpdate) ? `disabled="disabled"` : ``) + ` role="UPDATE">Update</button>
                        <button class="btn delete-btn" ` + ((!allowDelete) ? `disabled="disabled"` : ``) + ` role="DELETE">Delete</button>
                    </div>
                </div>`;
    }

    private static buildStartedEntryHTML(entry: ReadingEntry, allowUpdate, allowDelete): string {
        return `<div class="entry item">
                    <div class="entry-info item-info">
                        <div class="entry-book-title"><span class="attr-lbl">Name</span><span class="attr-val">${entry.book.title}</span></div>
                        <div class="pages-read"><span class="attr-lbl">Start Page</span><span class="attr-val">${entry.startPage}</span></div>
                        <div class="start-time"><span class="attr-lbl">Start Time</span><span class="attr-val">${entry.startTime}</span></div>
                    </div>
                    <div class="actions entry-actions">
                        <button class="btn finish-btn" ` + ((!allowUpdate) ? `disabled="disabled"` : ``) + ` role="UPDATE">Finish</button>
                        <button class="btn delete-btn" ` + ((!allowDelete) ? `disabled="disabled"` : ``) + ` role="DELETE">Delete</button>
                    </div>
                </div>`;
    }

    private buildEntriesListing(entries: ReadingEntry[], $target, popup: Popup) {
        for (let entry of entries) {
            let $entry;

            if (entry.isFinished()) {
                $entry = $(EntryManager.buildFinishedEntryHTML(entry, this.allowUpdate, this.allowDelete)).appendTo($target);
            } else {
                $entry = $(EntryManager.buildStartedEntryHTML(entry, this.allowUpdate, this.allowDelete)).appendTo($target);
            }

            $entry.find('.actions').on('click', '.delete-btn', () => {
                //TODO find a way to make this specific
                let doDelete: boolean = confirm(`Are you sure you want to delete the entry for ${entry.startTime}?`);

                if (doDelete) {
                    EntryManager.deleteEntry(entry, () => {
                        this.refreshResults();
                    });
                }
            }).on('click', '.update-btn, .finish-btn', () => {
                let $popupForm = popup.open();
                this.showUpdateEntryForm($popupForm, entry, popup);
            });
        }
    }

    private setupListing($listing) {
        let $list = $listing.find('.entries');
        this.updatePopup = new Popup(this.$updateForm, {});

        this.getAllEntries((entries: ReadingEntry[]) => {
            this.buildEntriesListing(entries, $list, this.updatePopup);
        });
    }

    public init() {
        const $entryMgtForm = this.$entryMgt.find('.add-entry-form form');
        const $newEntryMgtForm = this.$entryMgt.find('.start-entry-form form');

        if ($entryMgtForm.length) {
            BookManager.getBooks({}, (books: Book[]) => {
                this.setupInsertForm($entryMgtForm, books);
                this.setupStartNewForm($newEntryMgtForm, books);
            });
        }

        const $entryListing = this.$entryMgt.find('.entry-listing');
        if ($entryListing.length) {
            this.setupListing($entryListing);
        }
    }

    public getAllEntries(callback: (array: ReadingEntry[]) => void) {
        let entries: ReadingEntry[] = [];
        $.ajax(EntryManager.ENTRY_URL, {
            type: "GET"
        }).done((data) => {
            for (let entryObj of JSON.parse(data)) {
                let readingEntry = new ReadingEntry(new Book(entryObj.book.isbn, entryObj.book.title, entryObj.book.pages, entryObj.book.authorFirst, entryObj.book.authorLast), this.user, entryObj.startPage, entryObj.endPage, entryObj.startTime, entryObj.endTime, entryObj.notes);
                readingEntry.id = entryObj.id;
                entries.push(readingEntry);
            }
            callback(entries);
        }).fail(() => {
            alert("Failed to retrieve entries ( * ಥ ⌂ ಥ * )");
            callback(entries);
        });
    }

    public static getEntry(id: string): ReadingEntry {
        $.ajax(this.ENTRY_URL, {
            type: "GET"
        }).done((data) => {
            let entry = new ReadingEntry(null, null, null, null, null, null, null);
            entry.fromJSON(data);
            return entry;
        }).fail(() => {
            alert("Failed to retrieve entry ʕ ಡ ﹏ ಡ ʔ");
        });

        return null;
    }

    public static insertEntry(newEntry: ReadingEntry, doneCallback: () => void) {
        $.ajax(this.ENTRY_URL, {
            type: "POST",
            data: JSON.parse(JSON.stringify(newEntry))
        }).done(() => {
            alert("Successfully added entry!");
            doneCallback();
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create entry (-_-｡)");
            doneCallback();
        });
    }

    public static updateEntry(entry: ReadingEntry, doneCallback: (entry: ReadingEntry) => void) {
        let sendData = JSON.parse(JSON.stringify(entry));

        //Do date formatting
        sendData.startTime = moment(sendData.startTime, EntryManager.SRC_TIME_FORMAT).format("YYYY-MM-DD HH:mm:ss");
        sendData.endTime = moment(sendData.endTime, EntryManager.SRC_TIME_FORMAT).format("YYYY-MM-DD HH:mm:ss");

        sendData = $.extend(true, sendData, {update: 1, id: entry.id});

        $.ajax(this.ENTRY_URL, {
            type: "POST",
            data: sendData
        }).done((data) => {
            alert("Successfully added entry!");
            let entry = new ReadingEntry(null, null, null, null, null, null, null);
            entry.fromJSON(data);
            doneCallback(entry);
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create entry (-_-｡)");
            doneCallback(null);
        });
    }

    public static deleteEntry(entry: ReadingEntry, doneCallback: () => void) {
        $.ajax(this.ENTRY_URL, {
            type: "POST",
            data: {
                id: entry.id,
                delete: 1
            }
        }).done(() => {
            alert("Deleted entry!");
            doneCallback();
        }).fail(() => {
            alert("Failed to delete entry ( ✖ _ ✖ )");
            doneCallback();
        });
    }
}