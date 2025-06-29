const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

const quotes = [];

const showRandomQuote = () => {
    let quote;

    if (quotes.length === 0) return;

    if (quotes.length === 1) {
        quote = quotes[0];
    } else {
        const randIndex = Math.floor(Math.random() * (quotes.length - 1));

        quote = quotes[randIndex];
    }

    quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
};

const createAddQuoteForm = (text, category) => {
    quotes.push({
        text,
        category
    });
}

newQuoteBtn.addEventListener('click', showRandomQuote);

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    const text = newQuoteText.value;
    const category = newQuoteCategory.value;

    createAddQuoteForm(text, category);

    newQuoteText.value = '';
    newQuoteCategory.value = '';
}
