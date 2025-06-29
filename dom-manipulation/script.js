const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('export');

const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');

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

const createAddQuoteForm = (text, category, save = false) => {
    quotes.push({
        text,
        category
    });

    if (save) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `${text} - ${category}`
    quoteDisplay.appendChild(quoteParagraph)
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    const text = newQuoteText.value;
    const category = newQuoteCategory.value;

    createAddQuoteForm(text, category, true);

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

quotes.forEach((quote) => {
    createAddQuoteForm(quote.text, quote.category);
});

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
