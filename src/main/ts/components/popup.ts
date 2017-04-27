export class Popup {
    private defaultOpts = {
        clone: {
            withDataAndEvents: true,
            deepWithDataAndEvents: true
        },
        openOnInit: false
    };
    private finalOpts;
    private $popupHtml;
    private lastPopupHeight = -1;
    private $overlayWrapper;

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
        $('body .popup-overlay-wrapper > *').unwrap();

        $(window).off('resize');
    };

    public open() {
        let $targetClone = this.$target.clone(this.finalOpts.clone.withDataAndEvents, this.defaultOpts.clone.deepWithDataAndEvents);
        this.$popupHtml.removeClass('popup-hidden');
        this.$target.addClass('popup-content-hidden');

        this.$popupHtml.find('.popup-content').append($targetClone);
        this.$popupHtml.find('.popup-close-btn').on('click', this.close);

        this.$overlayWrapper = $('body > *:not(.popup)').wrapAll('<div class="popup-overlay-wrapper"></div>').parent();

        $(window).on('resize', () => {
            this.setOverlayWrapperHeight();
        });

        this.setOverlayWrapperHeight();

        return $targetClone;
    }

    private calculateOverlayWrapperHeight() {
        let popupHeight = this.$popupHtml.outerHeight(),
            top = this.$popupHtml.position().top,
            bottom = this.$popupHtml.css('margin-bottom');

        return popupHeight + top + Math.abs(parseFloat(bottom));
    }

    public setOverlayWrapperHeight() {
        let newHeight = this.calculateOverlayWrapperHeight();
        if (newHeight < $('body,html').outerHeight()) {
            newHeight = '100%';
        }

        this.$overlayWrapper.css('height', newHeight);
        this.lastPopupHeight = this.$popupHtml.outerHeight();
    }
}