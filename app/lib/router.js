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
        if(/id=\d/.test(window.location.hash)) {
            await this.app.components.quotes.model.showQuote(getQuoteID());
            const QUOTE_DISPLAY = document.querySelector(".quote");
            QUOTE_DISPLAY.children[1].classList.toggle("hide");
            QUOTE_DISPLAY.classList.toggle("open");
        } else {
            this.app.components.quotes.model.refresh();
        }
    }
}

function getQuoteID() {
    const ID_REGEX = /id=(\d+)/;
    const HASH = window.location.hash;
    return Number(HASH.match(ID_REGEX)[0].slice(3));
}