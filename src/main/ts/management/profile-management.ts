class ProfileManager extends Management {

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

        const $form = this.$profManagement.find('form');
        $form.on('submit', (evt) => {
            evt.preventDefault();

            let username = $form.find('input[name="username"]').val();
            let email = $form.find('input[name="email"]').val();
            let firstName = $form.find('input[name="firstName"]').val();
            let lastName = $form.find('input[name="lastName"]').val();

            ProfileManager.updateUserInfo(new User(this.user.id, firstName, lastName, username, email, []), () => {
                this.refreshResults();
            });
        });
    }

    public updateInputsWithUserInfo(user:User) {
        this.$profManagement.find('input[type="text"]:not(.btn)').each((idx, input) => {
            let $input = $(input),
                valName = $input.attr('name');

            $input.val(user[valName]);
        })
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
            //TODO make random donger retrieval
            alert("Failed to update your profile (-_-｡)");
            callback();
        });
    }
}
