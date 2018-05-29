class Model {
    constructor() {
        this.authors = init();
    }

    filterByAuthor(id) {
        this.refresh();
        //this.authors = await this.authors;
        this.authors = this.authors.filter(author => author.id === id);
    }

    filterByTag(tag) {
        this.refresh();
        //this.authors = await this.authors;
        this.authors.forEach(author => author.quotes = author.quotes.filter(quote => quote.tags.some(quoteTag => quoteTag === tag)));
    }

    async refresh() {
        console.log("refreshing!!!");
        this.authors = await init();
        console.log("refreshed!!!");
    }
}

async function init() {
    const AUTHORS = await  getAuthors();
    const QUOTES = await getQuotes();
    AUTHORS.map(author => author.quotes = QUOTES.filter(quote => quote.author === author.id));
    return AUTHORS;
}

async function getAuthors() {
    const RESPONSE = await read("authors.json");
    const AUTHORS = RESPONSE.authors;
    return await AUTHORS;
}

async function getQuotes() {
    const RESPONSE = await read("quotes.json");
    const QUOTES = RESPONSE.quotes;
    return  await QUOTES;
}

async function read(input) {
    const RESPONSE = await fetch(input);
    const PARSED = await RESPONSE.json();
    return PARSED;
}