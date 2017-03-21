/**
 * Created by Matthew on 3/20/2017.
 */
class User {
    constructor(public firstName, public lastName, public username, public email) {

    }
}

function logoutUser() {
    $.ajax('http://localhost:8080/reading-app/api/auth', {
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

function updateAccountBox(user: User) {
    $('.user-info .username').text(user.username);
}

function checkForLoggedInuser() {
    $.ajax('http://localhost:8080/reading-app/api/auth', {
        type: "GET"
    }).done((data) => {
        data = JSON.parse(data);
        let user = data.user;
        let loggedInUser = new User(user.firstName, user.lastName, user.username, user.email);
        updateAccountBox(loggedInUser);
    }).fail(() => {
        window.location.replace('/login.html');
    });
}

function init() {
    $('.user-info .logout-btn').on('click', () => {
        this.logoutUser();
    });

    checkForLoggedInuser();
}

window.onload = () => {
    init();
};