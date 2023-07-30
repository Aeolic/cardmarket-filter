//Filter Icon https://www.flaticon.com/de/autoren/freepik

let format = "modern";

function restoreOptions() {
    chrome.storage.sync.get(
        {filterFormat: 'modern'},
        (items) => {
            format = items.filterFormat;
            console.log("Got:", format)
        }
    );
}

(async function main() {
    console.log("Triggering Cardmarket extension!");
    //TODO disable clicks/grey out/ show loading until all elements are removed?

    restoreOptions();

    const offersTable = document.getElementById("UserOffersTable");

    if (offersTable) {

        const tableBody = offersTable.querySelector(".table-body");

        if (tableBody) {

            let notLegalCardmarketNames = new Set();

            for (let entry of tableBody.children) {

                const seller = entry.querySelector(".col-seller");
                const sellerA = seller.querySelector("a");

                let cardName = sellerA.text

                if (cardName.includes("(V.")) {
                    cardName = cardName.slice(0, cardName.indexOf(("V.")) - 1);
                    cardName = cardName.trim();
                }

                //if there are multiple cards with different versions, we don't need to check
                //do this after (V. checks to handle different versions with the same edition + different editions
                if (notLegalCardmarketNames.has(cardName)) {
                    entry.style.display = "none";
                    continue;
                }

                let cardInfo = await fetch(`https://api.scryfall.com/cards/named?exact=${cardName}`)
                await new Promise(r => setTimeout(r, 55));
                let jsonInfo = await cardInfo.json();

                if (jsonInfo.legalities[format] === "not_legal") {
                    console.log(cardName + "is not legal, hiding!")
                    entry.style.display = "none";
                    notLegalCardmarketNames.add(cardName);
                }
            }
        }
    }
})();


