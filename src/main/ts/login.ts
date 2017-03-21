class Authenticator {
    $accountBox = $('.main-content');
    $loginForm = this.$accountBox.find('.login-form form');
    $loginFormContainer = this.$loginForm.parents('.login-form-container');
    $passField = this.$loginForm.find('#user-password');
    $userInfoBox = this.$accountBox.find('.user-info');
    $usernameBox = this.$accountBox.find('.username');
    $logoutBtn = this.$accountBox.find('.logout-btn');

    constructor() {
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

            if(typeof data.redirectURL !== 'undefined' && data.redirectURL !== null && data.redirectURL.length) {
                window.location.replace(data.redirectURL);
            } else {
                window.location.replace('/');
            }
        }).fail(()=>{
            alert("Failed to log in. Wrong username or password.");
        });
    }
}

window.onload = () => {
    let auth = new Authenticator();
};