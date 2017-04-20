import $ = require("jquery");
import {AppAuth} from "./user/auth";
import {User} from "./user/user";

declare function require(moduleNames: string[], onLoad: (...args: any[]) => void): void;

function initExpandable() {
    let $expandables = $('.expandable-ctrl');

    if($expandables.length) {
        require(['resources/javascript/components/expandable'], function(e) {
            $expandables.each((idx, el) => {
                const $el = $(el);
                new e.Expandable($el, $($el.data('expandable-target')));
            });
        });
    }
}

function initTimePickers() {
    let $timePickers = $('input[data-time-picker="timestamp"]');

    if($timePickers.length) {
        require(['flatpickr'], function(fp) {
            //noinspection TypeScriptUnresolvedFunction
            $timePickers.flatpickr({enableTime: true, enableSeconds: true});
        });
    }
}

function initMobileMenu() {
    let $mobileMenu = $('.mobile-menu');

    if($mobileMenu.length) {
        require(['resources/javascript/components/mobile-menu'], function(mm) {
            new mm.MobileMenu($mobileMenu, $('.standard-menu'));

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

    let appAuth = new AppAuth();
    let currentUser:User = null;

    if ($('.book-management').length) {
        if(currentUser == null) {
            appAuth.retrieveLoggedInUser((user:User) => {
                currentUser = user;
                require(['resources/javascript/management/book-management'], (bm) => {
                    new bm.BookManager(user);
                });
            });
        } else {
            require(['resources/javascript/management/book-management'], (bm) => {
                new bm.BookManager(currentUser);
            });
        }
    }

    if ($('.entry-management').length) {
        if(currentUser == null) {
            appAuth.retrieveLoggedInUser((user:User) => {
                currentUser = user;
                require(["resources/javascript/management/entry-management"], (em) => {
                    new em.EntryManager(user);
                });
            });
        } else {
            require(["resources/javascript/management/entry-management"], (em) => {
                new em.EntryManager(currentUser);
            });
        }
    }

    if ($('.profile-management').length) {
        if(currentUser == null) {
            appAuth.retrieveLoggedInUser((user:User) => {
                currentUser = user;
                require(['resources/javascript/management/profile-management'], (pm) => {
                    new pm.ProfileManager(user);
                });
            });
        } else {
            require(['resources/javascript/management/profile-management'], (pm) => {
                new pm.ProfileManager(currentUser);
            });
        }
    }

    if ($('.recently-added-books').length) {
        require(['resources/javascript/widgets/recently-added-books'], (rab) => {
            new rab.RecentlyAddedBooks();
        });
    }

    if ($('.login-form').length) {
        require(['resources/javascript/login'], (login) => {
            new login.Authenticator();
        });
    }

    initExpandable();
    initTimePickers();
}

window.onload = () => {
    init();
};