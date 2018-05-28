class Model {
    constructor() {
        this.authors = init();
    }

    getAuthors() {
        const AUTHORS = [];
        for (const author in this.authors) {
            AUTHORS.push(this.authors[author])
        }
        return AUTHORS;
    }

    getQuotes() {
        const AUTHORS = this.getAuthors();
        return AUTHORS.reduce((quotes, author) => quotes.concat(author.quotes), [])
    }

    filterByAuthor(id) {
        this.refresh();
        this.authors = [this.authors[id]];
    }

    filterByTag(tag) {
        this.refresh();
        const AUTHORS = this.getAuthors();
        const filteredQuotes = this.getQuotesWithTag(tag);
        AUTHORS.forEach(author =>author.quotes = author.quotes.filter(quote => filteredQuotes.some(filtered => filtered===quote)));
        AUTHORS.filter(author => author.quotes.length>0);
        this.authors = AUTHORS;
    }

    getQuotesWithTag(tag) {
        const QUOTES = this.getQuotes();
        return QUOTES.filter(quote => quote.tags.some(quoteTag=>quoteTag===tag));
    }

    refresh() {
        this.authors = init();
    }
}

class Author {
    constructor(authorNode) {
        this.id = authorNode.children[0].innerHTML;
        this.name = authorNode.children[1].innerHTML;
        this.quotes = [];
    }

    add(quote) {
        this.quotes.push(quote);
    }

    link(quotes) {
        quotes.forEach(quote => {
            if(quote.authorID===this.id) {
                this.add(quote);
            }
        });
        return this;
    }
}

class Quote {
    constructor(quoteNode) {
        this.content = quoteNode.children[0].innerHTML;
        this.authorID = quoteNode.children[1].innerHTML;
        this.tags = quoteNode.children[2].innerHTML.split(",");
    }
}

function init() {
    const AUTHORS_DATA = readInput("authors.xml");
    const QUOTES_DATA = readInput("quotes.xml");
    const AUTHORS = createAuthors(AUTHORS_DATA);
    const QUOTES = createQuotes(QUOTES_DATA);
    for (let author in AUTHORS) {
        const AUTHOR = AUTHORS[author];
        AUTHOR.link(QUOTES);
    }
    return AUTHORS;
}

function createAuthors(data) {
    const AUTHOR_LIST = data.children[0].children;
    const AUTHORS = {};
    for (let authorData in AUTHOR_LIST) {
        const AUTHOR = AUTHOR_LIST[authorData];
        if (AUTHOR.nodeName === "author") {
            const AUTHOR_ID = AUTHOR.children[0].innerHTML;
            AUTHORS[AUTHOR_ID] = createAuthor(AUTHOR);
        }
    }
    return AUTHORS;
}

function createAuthor(data) {
    return new Author(data);
}

function createQuotes(data) {
    const QUOTE_LIST = data.children[0].children;
    const QUOTES = [];
    for (let quoteData in QUOTE_LIST) {
        const QUOTE = QUOTE_LIST[quoteData];
        if (QUOTE.nodeName === "quote") {
            QUOTES.push(createQuote(QUOTE));
        }
    }
    return QUOTES;
}

function createQuote(data) {
    return new Quote(data);
}

function readInput(input) {
    const XHTTP = new XMLHttpRequest();
    XHTTP.open("GET", input, false);
    XHTTP.send();
    return XHTTP.responseXML;
}