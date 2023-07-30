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
    console.log("Triggering extension!");
    //TODO disable klicks/grey out/ show loading until all elements are removed

    //let format = "modern";

    restoreOptions();

    const offersTable = document.getElementById("UserOffersTable");

    if (offersTable) {
        console.log("Got Table!")
        // alert("Found table!")

        const tableBody = offersTable.querySelector(".table-body");

        if (tableBody) {
            console.log("Got table Body!", tableBody);
            for (let entry of tableBody.children) {

                const seller = entry.querySelector(".col-seller");
                const sellerA = seller.querySelector("a");

                let cardName = sellerA.text

                if (cardName.includes("(V.")) {
                    cardName = cardName.slice(0, cardName.indexOf(("V.")) - 1);
                    cardName = cardName.trim();
                }

                console.log("Cardname:", cardName);

                let cardInfo = await fetch(`https://api.scryfall.com/cards/named?exact=${cardName}`)
                await new Promise(r => setTimeout(r, 55));
                let jsonInfo = await cardInfo.json();
                console.log("Got response:", jsonInfo)

                //TODO list in extension settings
                if (jsonInfo.legalities[format] === "not_legal") {
                    console.log(cardName + "is not modern legal, hiding!")
                    entry.style.display = "none";
                    //TODO add to already checked -> reduces amount of requests to scryfall
                }

            }
        }
    }
})();


