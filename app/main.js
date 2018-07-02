"use strict";

async function run() {
    const APP = new App("main");
    const MODEL = new Model();
    const ROUTER = new Router(APP);

    var searchTimeout;

    const REFRESH = async () => {
        MODEL.authors = await MODEL.refresh();
        MODEL.quotes = MODEL.seedQuotes();
        APP.showComponent("quotes");
    }

    const QUOTE_TEMPLATE = (quote, index) =>
    `<section class="quote">
        <a href="#quotes?id=${index}">
            <blockquote>${quote.content}</blockquote>
        </a>
            <div class="quoteInformation hide">
                <div class="tags">${quote.tags.reduce((HTML, tag) =>HTML+`\n<a href="#quotes?tag=${tag}" class="tag">${tag}</a>`, "")}</div>
                <a href="#quotes?author=${quote.author.toLowerCase()}">
                    <div class="authorInformation">
                        <span class="authorName">${MODEL.getAuthorName(quote.author)}</span>
                        <img class="authorAvatar" src="images/${quote.author}.jpg"/>
                    </div>
                </a>
            </div>
        </section>`;

    

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
                click.stopPropagation();
            }));

            const AUTHOR_INFORMATION = document.querySelectorAll(".authorInformation");
            AUTHOR_INFORMATION.forEach(info => info.addEventListener("click", click => {
                click.stopPropagation();
            }))

            document.querySelector(".icon.fa-search").addEventListener("click", () => {
                document.querySelector("h1").classList.toggle("hide");
                document.querySelector("input.search").classList.toggle("hide");
            })

            const SEARCH_BAR = document.querySelector("input.search");
            SEARCH_BAR.addEventListener("input", (e) => {
                clearTimeout(searchTimeout)
                searchTimeout = setTimeout(function(){
                    window.location = `#quotes?search=${SEARCH_BAR.value}`
                }, 300)
            });

        }
    });

    REFRESH();

    const HEADING = document.querySelector("h1");
    HEADING.addEventListener("click", REFRESH);

}

run();