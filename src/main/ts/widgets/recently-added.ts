class RecentlyAdded extends Widget {

    constructor() {
        new Requirement("BookManager", "resources/javascript/management/book-management.js", () => {
            BookManager.getBooks(/* TODO Search on most recently added, max 10 */, (books:Book) => {
                //TODO create html and show on page
            });
        });
    }

}