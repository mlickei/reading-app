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
            $timePickers.flatpickr({enableTime: true, enableSeconds: true, disableMobile:true});
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

    if(!$('.auth-box').length) {

        appAuth.checkForLoggedInUser((user:User) => {
            if ($('.book-management').length) {
                require(['resources/javascript/management/book-management'], (bm) => {
                    new bm.BookManager(user);
                });
            }

            if ($('.entry-management').length) {
                require(["resources/javascript/management/entry-management"], (em) => {
                    new em.EntryManager(user);
                });
            }

            if ($('.profile-management').length) {
                require(['resources/javascript/management/profile-management'], (pm) => {
                    new pm.ProfileManager(user);
                });
            }

            if ($('.reading-list-management').length) {
                require(['resources/javascript/management/reading-list-management'], (rlm) => {
                    new rlm.ReadingListManager(user);
                });
            }

            if ($('.recently-added-books').length) {
                require(['resources/javascript/widgets/recently-added-books'], (rab) => {
                    new rab.RecentlyAddedBooks();
                });
            }

            initExpandable();
            initTimePickers();
        });
    } else {
        if ($('.login-form').length) {
            require(['resources/javascript/login'], (login) => {
                new login.Authenticator();
            });
        }
    }
}

window.onload = () => {
    init();
};