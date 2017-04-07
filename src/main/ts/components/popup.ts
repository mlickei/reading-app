class Popup {
    private defaultOpts = {
        clone: {
            withDataAndEvents: true,
            deepWithDataAndEvents: true
        },
        openOnInit: false
    };
    private finalOpts;
    private $popupHtml;

    constructor(private $target, private options) {
        this.finalOpts = $.extend(true, this.defaultOpts, options);
        this.init();
    }

    private static getHtmlStr():string {
        return `<div class="popup popup-hidden">
                    <div class="popup-actions"><button class="popup-close-btn"></button></div>
                    <div class="popup-content"></div>
                </div>`;
    }

    private init() {
        this.$popupHtml = $(Popup.getHtmlStr());
        $('body').append(this.$popupHtml);

        if(this.finalOpts.openOnInit) {
            this.open();
        }
    }

    public close = () => {
        this.$target.removeClass('popup-content-hidden');
        this.$popupHtml.addClass('popup-hidden').find('.popup-content').empty();
    };

    public open() {
        let $targetClone = this.$target.clone(this.finalOpts.clone.withDataAndEvents, this.defaultOpts.clone.deepWithDataAndEvents);
        this.$popupHtml.removeClass('popup-hidden');
        this.$target.addClass('popup-content-hidden');

        this.$popupHtml.find('.popup-content').append($targetClone);
        this.$popupHtml.find('.popup-close-btn').on('click', this.close);

        return $targetClone;
    }
}