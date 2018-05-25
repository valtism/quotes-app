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

    getView(author) {
        return `<section class="quote">
                    <blockquote>${this.content}</blockquote>
                    <div class="quoteInformation hide">
                        <div class="tags">${this.displayTags()}</div>
                        <div class="authorInformation">
                            <span class="authorName">${author.name}</span>
                            <img class="authorAvatar" src="images/${this.authorID}.jpg"/>
                        </div>
                    </div>
                </section>`
    }

    displayTags() {
        let tagView = "";
        this.tags.forEach(tag => tagView += `\n<span class="tag">${tag}</span>`);
        return tagView;
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
    addQuoteInteractivity();
    addTagInteractivity(QUOTES);
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

function addQuoteInteractivity() {
    const QUOTES = document.querySelectorAll(".quote");
    QUOTES.forEach(quote => quote.addEventListener("click", () => quote.children[1].classList.toggle("hide")));
}

function addTagInteractivity() {
    const TAGS = document.querySelectorAll(".tag");
    TAGS.forEach(tag => tag.addEventListener("click", click => {
        console.log(tag.innerHTML);
        click.stopPropagation();
    }));
}

function filterByTag(QUOTES, filter) {
    QUOTES.filter(quote => quote.tags.some(tag => tag === filter));
    const MAIN = document.querySelector("main");
    MAIN.innerHTML = "";
    //probablity delete this or remake this when you implement MVC
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

init();