class Model {
    constructor() {
        this.authors = init();
        this.refreshed = true;
    }

    async filterByAuthor(id) {
        await this.refresh();
        this.authors = [this.authors.find(author => author.id === id)];
        this.refreshed = false;
    }

    async filterByTag(tag) {
        await this.refresh();
        this.authors.forEach(author => author.quotes = author.quotes.filter(quote => quote.tags.some(quoteTag => quoteTag === tag)));
        this.refreshed = false;
    }

    async refresh() {
        if (!this.refreshed) {
            const AUTHORS = init();
            this.authors = await AUTHORS;
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
    return  await QUOTES;
}

async function read(input) {
    const RESPONSE = await fetch(input);
    const PARSED = await RESPONSE.json();
    return PARSED;
}