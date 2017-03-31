class MobileMenu {

    constructor(private $mobileMenu, private $standardMenu) {
        this.buildMenu();
    }

    private buildMenu() {
        let $mainNavItems = this.$standardMenu.find('.main-nav .mi');
        let $userInfo = this.$standardMenu.find('.user-info');
        let $mobileMenuUL = this.$mobileMenu.find('.mobile-nav');

        $mobileMenuUL.append($mainNavItems.clone());
        $mobileMenuUL.append($userInfo.clone());
    }

}