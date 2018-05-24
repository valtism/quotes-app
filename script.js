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
    }

    sayHi() {
        //this function exists for testing purposes
        console.log(`Hello, my name is ${this.name}`);
    }

    sayQuotes() {
        this.quotes.forEach(quote=>console.log(`\t"${quote.content}"`));
    }
}

class Quote {
    constructor(quoteNode) {
        this.content = quoteNode.children[0].innerHTML;
        this.authorID = quoteNode.children[1].innerHTML;
        this.tags = quoteNode.children[2].innerHTML.split(" ,");
    }

    print() {
        console.log(`"${this.content}"`)
    }
}

function init() {
    const AUTHORS_DATA = readInput("authors.xml");
    const QUOTES_DATA = readInput("quotes.xml");
    const AUTHORS = createAuthors(AUTHORS_DATA);
    const QUOTES = createQuotes(QUOTES_DATA);
    for (let author in AUTHORS) {
        const AUTHOR = AUTHORS[author];
        AUTHOR.sayHi();
        AUTHOR.link(QUOTES);
        AUTHOR.sayQuotes();
    }
    console.log('\n');
    //QUOTES.forEach(quote => quote.print());
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