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

class Requirement {
    constructor(private className:string, private libSrc:string, private callback:()=> void) {
        if(typeof window[className] === 'undefined') {
            $.getScript(libSrc, () => callback());
        } else {
            callback();
        }
    }
}

//FIXME Remove reading-app
const AUTH_URL = '/reading-app/api/auth';

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

function init() {
    $('.user-info .logout-btn').on('click', () => {
        AppAuth.logoutUser();
    });

    AppAuth.checkForLoggedInuser();

    new Requirement("EntryManager", "resources/javascript/management/book-management.js", () => new EntryManager());
}

window.onload = () => {
    init();
};