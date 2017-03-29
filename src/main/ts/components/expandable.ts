class Expandable {
    private $expandBtn;
    private $collapseBtn;

    constructor(private $ctrlCont, private $target) {
        this.$expandBtn = $ctrlCont.find('.expand-btn');
        this.$collapseBtn = $ctrlCont.find('.collapse-btn').addClass('hidden');
        $target.addClass('hidden');

        this.init();
    }

    private expand() {
        this.$expandBtn.addClass('hidden');
        this.$collapseBtn.removeClass('hidden');
        this.$target.removeClass("hidden");
    }

    private collapse() {
        this.$expandBtn.removeClass('hidden');
        this.$collapseBtn.addClass('hidden');
        this.$target.addClass("hidden");
    }

    private init() {
        //Add styles
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'resources/css/components/expandable.css'
        }).appendTo('head');

        this.$expandBtn.on('click', () => {
            this.expand();
        });
        this.$collapseBtn.on('click', () => {
            this.collapse();
        });
    }
}