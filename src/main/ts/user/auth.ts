import {User} from "./user";
import {Role} from "./role";
const AUTH_URL = '/api/auth';

export class AppAuth {
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

    public checkForLoggedInUser(callback:(user:User)=> void) {
        $.ajax(AUTH_URL, {
            type: "GET"
        }).done((data) => {
            data = JSON.parse(data);
            let user = data.user;
            let roles = [];

            for(let roleStr of data.roles) {
                roles.push(new Role(roleStr));
            }

            this.currentUser = new User(user.id, user.firstName, user.lastName, user.username, user.email, roles);
            AppAuth.updateAccountBox(this.currentUser);
            callback(this.currentUser);
        }).fail(() => {
            window.location.replace('/login.html');
            callback(null);
        });
    }

    public retrieveLoggedInUser(callback:(user:User)=> void) {
        let user:User = null;

        $.ajax(AUTH_URL, {
            type: "GET"
        }).done((data) => {
            data = JSON.parse(data);
            let user = data.user;
            let roles = [];

            for(let roleStr of data.roles) {
                roles.push(new Role(roleStr));
            }

            this.currentUser = new User(user.id, user.firstName, user.lastName, user.username, user.email, roles);
            callback(this.currentUser);
        }).fail(() => {
            alert("Couldn't retrieve a logged in user!");
            callback(null);
        });
    }
}