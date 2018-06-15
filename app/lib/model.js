"use strict";

class Model {
    constructor() {
        this.authors = init();
        this.refreshed = false;
        this.quotes = [];
        this.allQuotes = [];
    }

    seedQuotes() {
        return this.authors.reduce((quotes, author) => quotes = quotes.concat(author.quotes), []);
    }

    getAuthorName(id) {
        return this.authors.find(author => author.id === id).name;
    }

    async showQuote(id) {
        await this.refresh();
        this.quotes = [this.quotes[id]];
        this.refreshed = false;
    }

    async filterByAuthor(id) {
        await this.refresh();
        this.quotes = this.quotes.filter(quote => quote.author === id);
        this.refreshed = false;
    }

    async filterByTag(tag) {
        await this.refresh();
        this.quotes = this.quotes.filter(quote => quote.tags.some(quoteTag => quoteTag === tag));
        this.refreshed = false;
    }

    async refresh() {
        if (!this.refreshed) {
            const AUTHORS = init();
            this.authors = await AUTHORS;
            this.quotes = this.seedQuotes();
            this.allQuotes = this.quotes.slice();
            this.refreshed = true;
        }
        return this.authors;
    }
}

async function init() {
    const AUTHORS = await  getAuthors();
    const QUOTES = await getQuotes();
    AUTHORS.map(author => author.quotes = QUOTES.filter(quote => quote.author === author.id));
    return AUTHORS;
}

async function getAuthors() {
    const RESPONSE = await read("data/authors.json");
    const AUTHORS = RESPONSE.authors;
    return await AUTHORS;
}

async function getQuotes() {
    const RESPONSE = await read("data/quotes.json");
    const QUOTES = RESPONSE.quotes;
    return await QUOTES;
}

async function read(input) {
    const RESPONSE = await fetch(input);
    const PARSED = await RESPONSE.json();
    return PARSED;
}