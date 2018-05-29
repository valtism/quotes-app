"use strict";

async function run() {
    const APP = new App("main");
    const MODEL = new Model();

    const REFRESH = async () => {
        MODEL.authors = await MODEL.refresh();
        APP.showComponent("quotes");
    }

    const QUOTE_TEMPLATE = (author, quote) =>
    `<section class="quote">
        <blockquote>${quote.content}</blockquote>
        <div class="quoteInformation hide">
            <div class="tags">${quote.tags.reduce((HTML, tag) =>HTML+`\n<span class="tag">${tag}</span>`, "")}</div>
            <div class="authorInformation" id="${quote.author}">
                <span class="authorName">${author.name}</span>
                <img class="authorAvatar" src="images/${quote.author}.jpg"/>
            </div>
        </div>
    </section>`;

    

    APP.addComponent({
        name: "quotes",
        model: MODEL,
        view() {   
                    return this.model.authors.reduce((HTML, author) => 
                        HTML + author.quotes.reduce((quoteHTML, quote) => 
                            quoteHTML + QUOTE_TEMPLATE(author, quote)
                    , ""), "");
        },
        controller() {
            const QUOTES_DISPLAY = document.querySelectorAll(".quote");
            QUOTES_DISPLAY.forEach(quote => quote.addEventListener("click", () => quote.children[1].classList.toggle("hide")));
            
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