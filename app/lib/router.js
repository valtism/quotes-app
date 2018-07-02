"use strict";

class Router {
    constructor(app) {
        this.app = app;
        this.routes = [];
        this.hashChange = this.hashChange.bind(this);
        window.addEventListener("hashchange", this.hashChange);
        window.addEventListener('DOMContentLoaded', this.hashChange);
    }

    addRoute(name, url) {
        this.routes.push({name, url});
    }

    async hashChange() {
        if(/id=\d/i.test(window.location.hash)) {
            await this.app.components.quotes.model.showQuote(getQuoteID());
            const QUOTE_DISPLAY = document.querySelector(".quote");
            QUOTE_DISPLAY.children[1].classList.toggle("hide");
            QUOTE_DISPLAY.classList.toggle("open");
        } else if(/author=[\w-]+/i.test(window.location.hash)) {
            await this.app.components.quotes.model.filterByAuthor(getAuthorID());
        } else if (/tag=\w+/i.test(window.location.hash)) {
            await this.app.components.quotes.model.filterByTag(getTag());
        } else if (/search=.+/i.test(window.location.hash)) { 
            await this.app.components.quotes.model.filterBySearch(getTerm());
        } else {
            this.app.components.quotes.model.refresh();
        }
    }
}

function getQuoteID() {
    const ID_REGEX = /id=(\d+)/i;
    const HASH = window.location.hash;
    return Number(HASH.match(ID_REGEX)[0].slice(3));
}

function getAuthorID() {
    const AUTHOR_REGEX = /author=[\w-]+/i;
    const HASH = window.location.hash;
    return HASH.match(AUTHOR_REGEX)[0].slice(7).toUpperCase();
}

function getTag() {
    const TAG_REGEX = /tag=\w+/i;
    const HASH = window.location.hash;
    return HASH.match(TAG_REGEX)[0].slice(4);
}

function getTerm() {
    const TERM_REGEX = /search=.+/i;
    const HASH = window.location.hash;
    return HASH.match(TERM_REGEX)[0].slice(7);
}