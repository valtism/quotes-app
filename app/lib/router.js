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

    hashChange() {
        if(/id=\d/.test(window.location.hash)) {
            this.app.components.quotes.model.showQuote(getQuoteID());
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