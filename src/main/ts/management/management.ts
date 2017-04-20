import {User} from "../user/user";

export abstract class Management {
    protected $listingActions;
    protected $search;
    protected filters = {};

    constructor(protected $target, protected user:User) {
        this.$listingActions = this.$target.find('.listing-actions');
        this.$search = this.$target.find('.search-filters-container');

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

        let $searchBtn = this.$search.find('.search-btn');
        if($searchBtn.length) {
            $searchBtn.on('click', (evt) => {
                evt.preventDefault();
                this.grabFilters(() => {
                    this.refreshResults();
                });
            });
        }

        let $resetBtn = this.$search.find('.reset-btn');
        if($resetBtn.length) {
            $resetBtn.on('click', () => {
                this.filters = {};
                this.refreshResults();
            });
        }
    }

    protected grabFilters(callback:() => void) {
        const $filters = this.$search.find('.filter');
        $filters.each((idx, filter) => {
            let $filter = $(filter),
                filterInput = $filter.find('.filter-val'),
                name = filterInput.attr('name');

            this.filters[name] = filterInput.val();

            if(idx >= $filters.length-1) {
                callback();
            }
        });
    }

    protected emptyList() {
        const $list = this.$target.find('.listing');
        $list.empty();
    }

    abstract refreshResults();
}