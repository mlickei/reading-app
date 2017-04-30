export class Authenticator {
    $mainContent = $('.main-content');
    $loginForm = this.$mainContent.find('.login-form form');
    $registerForm = this.$mainContent.find('.register-form form');
    $authBoxCtrls = this.$mainContent.find('.auth-box-controls');
    $registerBtn = this.$authBoxCtrls.find('.register-btn');
    $loginBtn = this.$authBoxCtrls.find('.login-btn');

    constructor() {
        this.$loginForm.on('submit', (evt) => {
            evt.preventDefault();
            this.authenticate(this.$loginForm.serialize());
        });

        this.$registerForm.on('submit', (evt) => {
            evt.preventDefault();
            this.register(this.$registerForm.serialize());
        });

        this.$registerBtn.on('click', () => {
            this.$registerBtn.addClass('hidden');
            this.$registerForm.parent().parent().removeClass('hidden');
            this.$loginBtn.removeClass('hidden');
            this.$loginForm.parent().parent().addClass('hidden');
        });

        this.$loginBtn.on('click', () => {
            this.$registerBtn.removeClass('hidden');
            this.$registerForm.parent().parent().addClass('hidden');
            this.$loginBtn.addClass('hidden');
            this.$loginForm.parent().parent().removeClass('hidden');
        });
    }

    authenticate(data) {
        $.ajax('/api/auth', {
            type: "GET",
            data: data
        }).done((data)=>{
            data = JSON.parse(data);

            if(typeof data.redirectURL !== 'undefined' && data.redirectURL !== null && data.redirectURL.length) {
                window.location.replace(data.redirectURL);
            } else {
                window.location.replace('/dashboard.html');
            }
        }).fail(()=>{
            alert("Failed to log in. Wrong username or password.");
        });
    }

    register(data) {
        $.ajax('/api/auth', {
            type: "POST",
            data: data
        }).done((data)=>{
            alert("⊂(▀¯▀⊂) Successfully Registered! ⊂(▀¯▀⊂)");

            if(typeof data.redirectURL !== 'undefined' && data.redirectURL !== null && data.redirectURL.length) {
                window.location.replace(data.redirectURL);
            } else {
                window.location.replace('/dashboard.html');
            }
        }).fail(()=>{
            alert("Failed to create account. ╰(ಥдಥ)ノ");
        });
    }
}