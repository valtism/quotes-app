"use strict";

async function run() {
    const APP = new App("main");
    const MODEL = new Model();
    const ROUTER = new Router(APP);

    const REFRESH = async () => {
        MODEL.authors = await MODEL.refresh();
        MODEL.quotes = MODEL.seedQuotes();
        APP.showComponent("quotes");
    }

    const QUOTE_TEMPLATE = (quote, index) =>
    `<a href="#quotes?id=${index}">
        <section class="quote">
            <blockquote>${quote.content}</blockquote>
            <div class="quoteInformation hide">
                <div class="tags">${quote.tags.reduce((HTML, tag) =>HTML+`\n<span class="tag">${tag}</span>`, "")}</div>
                <div class="authorInformation" id="${quote.author}">
                    <span class="authorName">${MODEL.getAuthorName(quote.author)}</span>
                    <img class="authorAvatar" src="images/${quote.author}.jpg"/>
                </div>
            </div>
        </section>
    </a>`;

    

    APP.addComponent({
        name: "quotes",
        model: MODEL,
        view() {   
                    return this.model.quotes.reduce((HTML, quote) => 
                        HTML + QUOTE_TEMPLATE(quote, this.model.allQuotes.indexOf(quote))
                    , "");
        },
        controller() {
            const QUOTES_DISPLAY = document.querySelectorAll(".quote");
            QUOTES_DISPLAY.forEach(quote => quote.addEventListener("click", () => {
                quote.children[1].classList.toggle("hide");
                quote.classList.toggle("open");
            }));
            
            const TAGS_DISPLAY = document.querySelectorAll(".tag");
            TAGS_DISPLAY.forEach(tag => tag.addEventListener("click", click => {
                this.model.filterByTag(tag.innerHTML);
                click.stopPropagation();
            }));

            const AUTHOR_INFORMATION = document.querySelectorAll(".authorInformation");
            AUTHOR_INFORMATION.forEach(info => info.addEventListener("click", click => {
                this.model.filterByAuthor(info.id);
                click.stopPropagation();
            }))
            }
    });

    REFRESH();

    const HEADING = document.querySelector("h1");
    HEADING.addEventListener("click", REFRESH);

}

run();