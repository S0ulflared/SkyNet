document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchHistory = document.getElementById('search-history');
    let historyItems = [];

    // Load history from local storage
    if (localStorage.getItem('searchHistory')) {
        historyItems = JSON.parse(localStorage.getItem('searchHistory'));
        displayHistory();
    }

    // Function to add a search term to the history
    function addToHistory(term) {
        if (!historyItems.includes(term)) {
            historyItems.push(term);
            localStorage.setItem('searchHistory', JSON.stringify(historyItems));
            displayHistory();
        }
    }

    // Function to display the search history
    function displayHistory() {
        searchHistory.innerHTML = ''; // Clear previous history
        historyItems.forEach(term => {
            const item = document.createElement('div');
            item.innerHTML = `User: -> <span class="search-history-item">${term}</span>`;
            item.addEventListener('click', () => {
                searchInput.value = term;
                performSearch(term);
            });
            searchHistory.appendChild(item);
        });
    }

    // Function to perform a Google search
    function performSearch(term) {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(term)}`;
        window.open(googleSearchUrl, '_blank'); // Open in a new tab
    }

    // Event listener for the search input
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const term = searchInput.value.trim();
            if (term) {
                addToHistory(term);
                performSearch(term);
                searchInput.value = ''; // Clear the input
            }
        }
    });
})
const rssUrl = "https://rss.nytimes.com/services/xml/rss/nyt/US.xml";

fetch(rssUrl)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const items = xml.querySelectorAll("item");

        const rssList = document.getElementById("rss-list");
        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;

            const listItem = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.textContent = title;
            anchor.href = link;
            anchor.target = "_blank";
            listItem.appendChild(anchor);
            rssList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.log("Error fetching RSS feed: ", error);
    });