function createQuoteElement(quote) {
  const li = document.createElement('li');
  li.className = 'quote-card';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'blockquote';

  const p = document.createElement('p');
  p.className = 'mb-0';
  p.textContent = quote.text;

  const footer = document.createElement('footer');
  footer.className = 'blockquote-footer';
  footer.textContent = quote.author;

  const br = document.createElement('br');

  
  const likeButton = document.createElement('button');
  likeButton.className = 'btn-success';
  likeButton.setAttribute('data-quote-id', quote.id);
  likeButton.innerHTML = `Likes: <span>0</span>`; // Set initial likes count
  
  likeButton.addEventListener('click', () => addLike(quote.id));
  

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn-danger';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteQuote(quote.id, li));

  blockquote.appendChild(p);
  blockquote.appendChild(footer);
  blockquote.appendChild(br);
  blockquote.appendChild(likeButton);
  blockquote.appendChild(deleteButton);

  li.appendChild(blockquote);

  return li;
}

function addQuoteToList(quote) {
  const quoteList = document.getElementById('quote-list');
  const quoteElement = createQuoteElement(quote);
  quoteList.appendChild(quoteElement);
}

// Function to fetch quotes from the server
function fetchQuotes() {
  fetch('http://localhost:3000/posts?_embed=comments') // Fetch quotes from 'http://localhost:3000/posts' with comments embedded
    .then(response => response.json())
    .then(quotes => {
      quotes.forEach(quote => {
        addQuoteToList(quote);
      });
    });
}

// Function to create a new quote
function createQuote(text, author) {
  fetch('http://localhost:3000/posts', { // Create a new quote at 'http://localhost:3000/posts'
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      author: author
    })
  })
  .then(response => response.json())
  .then(quote => {
    addQuoteToList(quote);
  });
}

// Function to delete a quote
function deleteQuote(quoteId, quoteElement) {
  fetch(`http://localhost:3000/posts/${quoteId}`, { // Delete the quote from 'http://localhost:3000/posts' with the specified ID
    method: 'DELETE'
  })
  .then(() => {
    quoteElement.remove();
  });
}

// Function to add a like to a quote
function addLike(quoteId) {
  fetch('http://localhost:3000/comments', { // Create a new like at 'http://localhost:3000/comments'
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId: quoteId
    })
  })
  .then(response => response.json())
  .then(like => {
    const likeButton = document.querySelector(`[data-quote-id="${quoteId}"]`);
    const likeCount = likeButton.querySelector('span');
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
  });
}

// Event listener for new quote form submission
document.getElementById('new-quote-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const quoteText = document.getElementById('new-quote').value;
  const quoteAuthor = document.getElementById('author').value;
  createQuote(quoteText, quoteAuthor);
  event.target.reset();
});

// Fetch quotes on page load
fetchQuotes();