const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('export');
const categoryFilter = document.getElementById('categoryFilter');
const info = document.getElementById('info');

const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
const lastCategory = localStorage.getItem('last-category') || 'all';

const showRandomQuote = () => {
    let quote;

    if (quotes.length === 0) return;

    if (quotes.length === 1) {
        quote = quotes[0];
    } else {
        const randIndex = Math.floor(Math.random() * (quotes.length));

        quote = quotes[randIndex];
    }

    quoteDisplay.innerHTML = `<p>${quote.text} - ${quote.category}</p>`;
};

const addQuoteToDisplay = (text, category) => {
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `${text} - ${category}`;
    quoteDisplay.appendChild(quoteParagraph);
}

const createAddQuoteForm = (text, category, save = false) => {
    quotes.push({
        text,
        category
    });

    if (save) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    addQuoteToDisplay(text, category);
}

async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    const text = newQuoteText.value;
    const category = newQuoteCategory.value;

    createAddQuoteForm(text, category, true);

    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: category,
            body: text,
            userId: 1
        })
    });

    newQuoteText.value = '';
    newQuoteCategory.value = '';
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        
        importedQuotes.forEach((quote) => {
            createAddQuoteForm(quote.text, quote.category);
        });

        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
    const quoteCategories = Array.from(new Set(quotes.map(({ category }) => category)));

    quoteCategories.forEach(category => {
        const categoryOption = document.createElement('option');
        categoryOption.value = category;
        categoryOption.innerText = category;
        categoryFilter.appendChild(categoryOption)
    });
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(({ category }) => category === selectedCategory);

    quoteDisplay.innerHTML = '';

    filteredQuotes.forEach(({ text, category }) => {
        addQuoteToDisplay(text, category);
    });

    localStorage.setItem('last-category', selectedCategory);
}

async function fetchQuotesFromServer() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const result = await response.json();

    result.forEach(({ title, body }) => {
        if (!quotes.find(({ text, category }) => text === body && category === title)) {
            createAddQuoteForm(body, title, true);
        }
    });

    info.textContent = `Quotes synced with server! Last updated ${new Date()}`;

    filterQuotes();
}

function syncQuotes() {
    setInterval(() => {
        fetchQuotesFromServer();
    }, 60000);
}

populateCategories();

categoryFilter.value = lastCategory;

quotes.forEach((quote) => {
    addQuoteToDisplay(quote.text, quote.category);
});

filterQuotes();

fetchQuotesFromServer();

syncQuotes();

newQuoteBtn.addEventListener('click', showRandomQuote);

exportBtn.addEventListener('click', () => {
    const jsonString = JSON.stringify(quotes, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quotes.json";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
});
