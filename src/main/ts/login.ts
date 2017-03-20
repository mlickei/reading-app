var loggedInUser:User;

class User {
    constructor(public firstName, public lastName, public username, public email) {

    }
}

class Authenticator {
    loggedInUser: User = null;
    $accountBox = $('.account-box');
    $loginForm = this.$accountBox.find('.login-form form');
    $passField = this.$loginForm.find('#user-password');
    $userInfoBox = this.$accountBox.find('.user-info');
    $usernameBox = this.$accountBox.find('.username');
    $logoutBtn = this.$accountBox.find('.logout-btn');

    constructor() {
        this.$logoutBtn.on('click', () => {
            this.logoutUser();
        });

        this.$loginForm.on('submit', (evt) => {
            evt.preventDefault();
            this.authenticate(this.$loginForm.serialize());
        });

        this.$accountBox.addClass('show-login');
    }

    authenticate(data) {
        $.ajax('http://localhost:8080/reading-app/api/auth', {
            type: "GET",
            data: data
        }).done((data)=>{
            data = JSON.parse(data);
            this.loggedInUser = new User(data.firstName, data.lastName, data.username, data.email);
            this.updateAccountBox();
        }).fail(()=>{
            alert("Failed to log in. Wrong username or password.");
        });
    }

    updateAccountBox() {
        if(this.loggedInUser != null) {
            this.$accountBox.addClass('show-user').removeClass('show-login');
            this.$usernameBox.text(this.loggedInUser.username);
        } else {
            this.$accountBox.addClass('show-login').removeClass('show-user');
            this.$usernameBox.text('');
            this.$passField.val('');
        }
    }

    logoutUser() {
        $.ajax('http://localhost:8080/reading-app/api/auth', {
            type: "GET",
            data: {
                logout: 1
            }
        }).done(() => {
            this.loggedInUser = null;
            this.updateAccountBox();
        }).fail(()=>{
            alert("Failed to log in. Wrong username or password.");
        });
    }
}

window.onload = () => {
    let auth = new Authenticator();
};