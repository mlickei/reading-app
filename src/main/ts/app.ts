/**
 * Created by Matthew on 3/20/2017.
 */
class Serializable {
    fromJSON(json: string) {
        let jsonObj = JSON.parse(json);
        for (let propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    }
}

class User extends Serializable {
    constructor(public firstName:string, public lastName:string, public username:string, public email:string) {
        super();
    }
}

class Book extends Serializable {
    constructor(public isbn:string, public title:string, public pages:number, public authorFirst:string, public authorLast:string) {
        super();
    }
}

//FIXME Remove reading-app
const AUTH_URL = '/reading-app/api/auth';
const BOOK_URL = '/reading-app/api/book';

class AppAuth {
    public static logoutUser() {
        $.ajax(AUTH_URL, {
            type: "GET",
            data: {
                logout: 1
            }
        }).done(() => {
            window.location.replace('/login.html');
        }).fail(() => {
            alert("Failed to logout.");
        });
    }

    private static updateAccountBox(user: User) {
        $('.user-info .username').text(user.username);
    }

    public static checkForLoggedInuser() {
        $.ajax(AUTH_URL, {
            type: "GET"
        }).done((data) => {
            data = JSON.parse(data);
            let user = data.user;
            let loggedInUser = new User(user.firstName, user.lastName, user.username, user.email);
            AppAuth.updateAccountBox(loggedInUser);
        }).fail(() => {
            window.location.replace('/login.html');
        });
    }
}

class AppBooks {
    public static getAllBooks() {
        $.ajax(BOOK_URL, {
            type: "GET"
        }).done((data) => {

        }).fail(() => {

        });
    }

    public static insertBook(newBook:Book) {
        $.ajax(BOOK_URL, {
            type: "PUT",
            data: JSON.parse(JSON.stringify(newBook))
        }).done(() => {
            alert("Successfully added " + newBook.title + " to library");
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to create book (-_-｡)");
        });
    }
}

function init() {
    $('.user-info .logout-btn').on('click', () => {
        AppAuth.logoutUser();
    });

    AppAuth.checkForLoggedInuser();

    const $bookMgtForm = $('.book-management .add-book-form form');
    $bookMgtForm.on('submit', (evt) => {
        evt.preventDefault();

        let title: string = $bookMgtForm.find('input[name="title"]').val();
        let isbn: string = $bookMgtForm.find('input[name="isbn"]').val();
        let pages: number = $bookMgtForm.find('input[name="pages"]').val();
        let authorFirst: string = $bookMgtForm.find('input[name="authorFirst"]').val();
        let authorLast: string = $bookMgtForm.find('input[name="authorLast"]').val();

        let newBook: Book = new Book(isbn, title, pages, authorFirst, authorLast);
        AppBooks.insertBook(newBook);
    });
}

window.onload = () => {
    init();
};