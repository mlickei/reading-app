import {Management} from "./management";
import {AppAuth} from "../user/auth";
import {User} from "../user/user";

export class ProfileManager extends Management {

    private static USER_URL: string = "/api/profile";
    private $profManagement;
    private appAuth:AppAuth;

    constructor(user:User) {
        super($('.profile-management'), user);
        this.$profManagement = this.$target;
        this.appAuth = new AppAuth();

        if(this.$profManagement.length) {
            this.init();
        }
    }

    private init() {
        this.updateInputsWithUserInfo(this.user);

        const $profileForm = this.$profManagement.find('.profile-form form');
        $profileForm.on('submit', (evt) => {
            evt.preventDefault();

            // let username = $profileForm.find('input[name="username"]').val();
            let email = $profileForm.find('input[name="email"]').val();
            let firstName = $profileForm.find('input[name="firstName"]').val();
            let lastName = $profileForm.find('input[name="lastName"]').val();

            ProfileManager.updateUserInfo(new User(this.user.id, firstName, lastName, this.user.username, email, []), () => {
                this.refreshResults();
            });
        });

        const $passwordForm = this.$profManagement.find('.password-update-form form');
        $passwordForm.on('submit', (evt) => {
            evt.preventDefault();

            let newPassword = $passwordForm.find('input[name="password"]').val();
            let confirmPassword = $passwordForm.find('input[name="confirm-pwd"]').val();

            if(newPassword === confirmPassword) {
                this.updateUserPassword(this.user, newPassword, () => {
                    this.refreshResults();
                });
            } else {
                alert("Your confirmation password doesn't match the one you entered.");
            }
        })
    }

    public updateInputsWithUserInfo(user:User) {
        this.$profManagement.find('input[type="text"]:not(.btn)').each((idx, input) => {
            let $input = $(input),
                valName = $input.attr('name');

            $input.val(user[valName]);
        })
    }

    public resetPasswordForm() {
        const $passwordForm = this.$profManagement.find('.password-update-form form');
        $passwordForm.find('input[type="password"]').val('');
    }

    refreshResults() {
        this.appAuth.retrieveLoggedInUser((user: User) => {
            this.updateInputsWithUserInfo(user);
            this.user = user;
        });
    }

    private static updateUserInfo(user:User, callback:() => void) {
        $.ajax(this.USER_URL, {
            type: "POST",
            data: JSON.parse(JSON.stringify(user))
        }).done(() => {
            alert("Successfully updated your profile.");
            callback();
        }).fail(() => {
            alert("Failed to update your profile (ʘᗩʘ’)");
            callback();
        });
    }

    private updateUserPassword(user:User, newPassword:String, callback:() => void) {
        $.ajax(ProfileManager.USER_URL, {
            type: "POST",
            data: {
                password: newPassword,
                username: user.username
            }
        }).done((data) => {
            if(JSON.parse(data).success) {
                alert("Successfully updated your password.");
                this.resetPasswordForm();
            } else {
                alert("Already using that password! ʕ ͠° ʖ̫ °͠ ʔ");
            }
            callback();
        }).fail(() => {
            //TODO make random donger retrieval
            alert("Failed to update your profile ┌༼ – _ – ༽┐");
            callback();
        });
    }
}
