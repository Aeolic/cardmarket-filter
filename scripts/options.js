const saveOptions = () => {
    const format = document.getElementById('format').value;

    chrome.storage.sync.set(
        {filterFormat: format},
        () => {
            console.log("Saved format", format);
        }
    );
};

const restoreOptions = () => {
    console.log("Restoring format selection")
    chrome.storage.sync.get(
        {filterFormat: "modern"},
        (items) => {
            document.getElementById('format').value = items.filterFormat;
        }
    );
};


document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('format').addEventListener('click', saveOptions);
