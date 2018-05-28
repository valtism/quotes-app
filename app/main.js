"use strict";
{
    const APP = new App("main");
    const MODEL = new Model();

    const QUOTE_TEMPLATE = (author, quote) =>
    `<section class="quote">
        <blockquote>${quote.content}</blockquote>
        <div class="quoteInformation hide">
            <div class="tags">${quote.tags.reduce((HTML, tag) =>HTML+`\n<span class="tag">${tag}</span>`, "")}</div>
            <div class="authorInformation">
                <span class="authorName">${author.name}</span>
                <img class="authorAvatar" src="images/${quote.authorID}.jpg"/>
            </div>
        </div>
    </section>`;

    const REFRESH = () => {
        MODEL.refresh();
        APP.showComponent("quotes");
    }

    APP.addComponent({
        name: "quotes",
        model: MODEL,
        view() {
            return this.model.getAuthors().reduce((HTML, author) => {
                return HTML + author.quotes.reduce((quoteHTML, quote) => {
                    return quoteHTML + QUOTE_TEMPLATE(author, quote);
                }, "")
            }, "")
        },
        controller() {
            const QUOTES_DISPLAY = document.querySelectorAll(".quote");
            QUOTES_DISPLAY.forEach(quote => quote.addEventListener("click", () => quote.children[1].classList.toggle("hide")));
            
            const TAGS_DISPLAY = document.querySelectorAll(".tag");
            TAGS_DISPLAY.forEach(tag => tag.addEventListener("click", click => {
                console.log(tag.innerHTML);
                click.stopPropagation();
            }));
            }
    });

    APP.showComponent("quotes");

    const HEADING = document.querySelector("h1");
    HEADING.addEventListener("click", REFRESH);
}