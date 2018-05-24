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
        this.tags = quoteNode.children[2].innerHTML.split(" ,");
    }

    getView(author) {
        return `<section class="quote">
                    <blockquote>${this.content}</blockquote>
                    <section class="quoteInformation">
                        <span class="authorName">${author.name}</span>
                        <img class="authorAvatar" src="images/${this.authorID}.jpg"/>
                    </section>
                </section>`
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
    display(AUTHORS);
}

function display(authors) {
    const MAIN = document.querySelector("main");
    for (let author in authors) {
        const AUTHOR = authors[author];
        AUTHOR.quotes.forEach(quote => {
            MAIN.innerHTML += quote.getView(AUTHOR);
        });
    }
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

//console.log(readInput("quotes.xml").children[0].children[0].children[0].innerHTML);
init();