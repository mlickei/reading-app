var loggedInUser:User;

class User {
    constructor(public firstName, public lastName, public username, public email) {

    }
}

class Authenticator {
    user: User;

    constructor(public data) {

    }

    authenticate() {
        $.ajax('http://localhost:8080/reading-app/api/auth', {
            type: "GET",
            data: this.data
        }).done((data)=>{
            loggedInUser = new User(data.firstName, data.lastName, data.username, data.email);
        }).fail(()=>{
            alert("Failed to log in. Wrong username or password.");
        });
    }
}

window.onload = () => {
    $('form.login').on('submit', (evt) => {
        evt.preventDefault();
        new Authenticator($('form.login').serialize()).authenticate();
    });
};