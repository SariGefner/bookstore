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
async function getBooks() {
  try {
    console.log('Fetching books...');
    const response = await api.get('/books');
    console.log('Raw API response:', response);
    const books = response.books || response;
    console.log('Processed books:', books);
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

//GET book by id
async function getBookById(id) {
  try {
    const response = await api.get(`/books/${id}`);
    console.log('tha api response :', response);
    return response
  } catch (error) {
    console.error(`Error fetching book: ${id}:`, error);
    throw error;
  }

}


// POST a new book
async function createBook(bookData) {
  try {
    const newBook = await api.post('/books', bookData);
    console.log('New book created:', newBook);
    loadTable()
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
    await api.delete(`/books/${id}`, `DELETE`);
    console.log('Book deleted');
    localStorage.removeItem(id);
    loadTable()
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



//display the details per book
async function showDetails(id) {

  console.log('inside the more details function');
  try {
    const book = await getBookById(id);
    console.log(`i get the dunction: `, book)
    const body = document.body;
    const display = document.createElement('div');
    display.id = 'bookCard'


    const title = document.createElement('h1');
    title.textContent = `${book.title}`
    title.id = 'cardTile';
    display.appendChild(title);


    const img = document.createElement('img');
    img.src = book.img;
    img.id = 'cardImg';
    console.log('Image URL:', book.img);
    display.appendChild(img);


    const price = document.createElement('h4');
    price.textContent = `Price: ${book.price} $`
    price.id = 'cardImg';
    display.appendChild(price);


    const rate = document.createElement('lable');
    rate.textContent = `Rate:`
    rate.id = 'cardRate';
    display.appendChild(rate);


    const rateBtn = document.createElement('input');
    rateBtn.type = `range`
    rateBtn.min = '1';
    rateBtn.max = '5';
    rateBtn.id = 'cardRate';
    rateBtn.value = !localStorage.getItem(id) ? '3' : localStorage.getItem(id);
    rateBtn.oninput = () => localStorage.setItem(id, rateBtn.value)

    display.appendChild(rateBtn);

    body.appendChild(display);
  } catch (error) {
    console.log('Error fetching book details:', error)
  }
}

// display form for new book and save the details.
 function addBook(){

  const body = document.body;
  const display = document.createElement('div');
  display.id = 'addBookPlace';
  
  const title = document.createElement('h1')
  title.textContent = 'New book'
  display.appendChild(title);

  const idTxt = document.createElement('h4');
  idTxt.textContent = 'id';
  display.appendChild(idTxt);

  const idBtn = document.createElement('input');
  display.appendChild(idBtn);

  const titleTxt = document.createElement('h4');
  titleTxt.textContent = 'Title';
  display.appendChild(titleTxt);

  const titleBtn = document.createElement('input');
  display.appendChild(titleBtn);

  const priceTxt = document.createElement('h4');
  priceTxt.textContent = 'price';
  display.appendChild(priceTxt);

  const priceBtn = document.createElement('input');
  display.appendChild(priceBtn);

  const imgTxt = document.createElement('h4');
  imgTxt.textContent = 'Cover Image URL';
  display.appendChild(imgTxt);

  const imgBtn = document.createElement('input');
  display.appendChild(imgBtn);

  const addBtn = document.createElement('button');
  addBtn.textContent = 'add';
  addBtn.onclick = () => {
    const newBook = {
      id: idBtn.value,
      title: titleBtn.value,
      price:  parseFloat(priceBtn.value),
      img: imgBtn.value,
      action: 'not read'
    }
    console.log('New Book:', JSON.stringify(newBook));
    createBook(newBook)
    
  }
  
  display.appendChild(addBtn);


  body.appendChild(display)
}


window.onload = async () => {
  loadTable();
};