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

class Role {
    constructor(public name:string) {

    }
}

class User extends Serializable {
    constructor(public id:number, public firstName:string, public lastName:string, public username:string, public email:string, public roles:Role[]) {
        super();
    }

    public hasRole(roleName:String):boolean {
        let hasRole:boolean = false;

        for(let role of this.roles) {
            hasRole = (role.name == roleName || hasRole);
        }

        return hasRole;
    }
}

abstract class Management {
    protected $listingActions;

    constructor(protected $target, protected user:User) {
        this.$listingActions = this.$target.find('.listing-actions');

        if(this.$listingActions.length) {
            this.initActions();
        }
    }

    private initActions() {
        let $refresh = this.$listingActions.find('.refresh-btn');

        if($refresh.length) {
            $refresh.on('click', () => {
                this.refreshResults();
            });
        }
    }

    protected emptyList() {
        const $list = this.$target.find('.listing');
        $list.empty();
    }

    abstract refreshResults();
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
            let roles = [];

            for(let roleStr of data.roles) {
                roles.push(new Role(roleStr));
            }

            this.currentUser = new User(user.id, user.firstName, user.lastName, user.username, user.email, roles);
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
        new Requirement("Expandable", "resources/javascript/components/expandable.js", () => {
            $expandables.each((idx, el) => {
                const $el = $(el);
                new Expandable($el, $($el.data('expandable-target')));
            });
        });
    }
}

function initTimePickers() {
    let $timePickers = $('input[data-time-picker="timestamp"]');

    if($timePickers.length) {
        new Requirement("Flatpickr", "resources/javascript/lib/flatpickr.min.js", () => {
            //noinspection TypeScriptUnresolvedFunction
            $timePickers.flatpickr({enableTime: true, enableSeconds: true});
        });
    }
}

function initMobileMenu() {
    let $mobileMenu = $('.mobile-menu');

    if($mobileMenu.length) {
        new Requirement("MobileMenu", "resources/javascript/components/mobile-menu.js", () => {
            new MobileMenu($mobileMenu, $('.standard-menu'));

            $('.user-info .logout-btn').on('click', () => {
                AppAuth.logoutUser();
            });
        });
    } else {
        $('.user-info .logout-btn').on('click', () => {
            AppAuth.logoutUser();
        });
    }
}

function init() {
    initMobileMenu();

    appAuth = new AppAuth();

    appAuth.checkForLoggedInuser();
    new Requirement("BookManager", "resources/javascript/management/book-management.js", () => new BookManager(appAuth.currentUser));

    new Requirement("EntryManager", "resources/javascript/management/entry-management.js", () => new EntryManager(appAuth.currentUser));
    initExpandable();
    initTimePickers();
}

window.onload = () => {
    init();
};