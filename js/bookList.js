const API_BASE_URL = 'http://localhost:3000';

async function fetchJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

const api = {
  get: (endpoint) => fetchJson(endpoint),

  post: (endpoint, data) => fetchJson(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  put: (endpoint, data) => fetchJson(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (endpoint) => fetchJson(endpoint, {
    method: 'DELETE',
  }),
};

// GET all books
// async function getBooks() {
//   debugger
//   try {

//     const books = await api.get('/books');
//     console.log(books);
//     return books;
//   } catch (error) {
//     console.error('Error fetching books:', error);
//   }
// }

async function getBooks() {
  try {
    console.log('Fetching books...');
    const response = await api.get('/books');
    console.log('Raw API response:', response);
    const books = response.books || response; // Handle both cases
    console.log('Processed books:', books);
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}


// POST a new book
async function createBook(bookData) {
  try {
    const newBook = await api.post('/books', bookData);
    console.log('New book created:', newBook);
  } catch (error) {
    console.error('Error creating book:', error);
  }
}

// PUT (update) a book
async function updateUser(id, bookData) {
  try {
    const updatedBook = await api.put(`/books/${id}`, bookData);
    console.log('Book updated:', updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
  }
}

// DELETE a book
async function deleteBook(id) {
  try {
    await api.delete(`/books/${id}`);
    console.log('Book deleted');
  } catch (error) {
    console.error('Error deleting book:', error);
  }
}

// Build and load the books table 
async function loadTable() {
  const tableBody = document.getElementById("booksTable");
  tableBody.innerHTML = '';

 
  const books = await getBooks();

  console.log('Fetched books:', books);

  if (!books || books.length === 0) {
    console.log("No books available");
    return; 
  }

  books.forEach((element) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${element.id}</td>
      <td>${element.price}</td>
      <td>${element.title}</td>
      <td>${element.action}</td>
    `;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => deleteBook(element.id);

    const editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.textContent = 'More details';
    editBtn.onclick = () => showDetails(element.id);

    row.appendChild(deleteBtn);
    row.appendChild(editBtn);

    tableBody.appendChild(row);
  });
}

window.onload = async () => {
  loadTable();
};

function showDetails(bookId) {
  // Implement showDetails functionality
}


// function deleteBook(bookId){

//   const books = await deleteBook(bookId);

//   console.log('Fetched books:', books);

//   if (!books || books.length === 0) {
//     console.log("No books available");
//     return; 
//   }

// }

 
