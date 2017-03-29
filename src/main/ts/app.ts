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
    constructor(public id:number, public firstName:string, public lastName:string, public username:string, public email:string) {
        super();
    }
}

class Requirement {
    constructor(private className:string, private libSrc:string, private callback:()=> void) {
        if(typeof window[className] === 'undefined') {
            $.getScript(libSrc, () => callback());
        } else {
            callback();
        }
    }
}

const AUTH_URL = '/api/auth';

class AppAuth {
    public currentUser:User;

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

    public checkForLoggedInuser() {
        $.ajax(AUTH_URL, {
            type: "GET"
        }).done((data) => {
            data = JSON.parse(data);
            let user = data.user;
            this.currentUser = new User(user.id, user.firstName, user.lastName, user.username, user.email);
            AppAuth.updateAccountBox(this.currentUser);
        }).fail(() => {
            window.location.replace('/login.html');
        });
    }
}

declare let appAuth: AppAuth;

function initExpandable() {
    let $expandables = $('.expandable-ctrl');

    if($expandables.length) {
        new Requirement("Expandable", "resources/javascript/components/expandable.ts", () => {
            $expandables.each((idx, el) => {
                const $el = $(el);
                new Expandable($el, $($el.data('expandable-target')));
            });
        });
    }
}

function init() {
    $('.user-info .logout-btn').on('click', () => {
        AppAuth.logoutUser();
    });

    appAuth = new AppAuth();
    appAuth.checkForLoggedInuser();

    new Requirement("BookManager", "resources/javascript/management/book-management.js", () => new BookManager());
    new Requirement("EntryManager", "resources/javascript/management/entry-management.js", () => new EntryManager());

    initExpandable();
}

window.onload = () => {
    init();
};