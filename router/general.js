import express from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { users } from './auth_users.js';

const router = express.Router();

// URL interna desde la que Axios recupera los libros.
// Se sirve como archivo estático desde index.js (data/books.json).
const BOOKS_API_URL = 'http://localhost:5000/books.json';

// Helper con Axios (usa async/await).
// Recupera todos los libros desde el origen de datos.
async function fetchAllBooks() {
  const response = await axios.get(BOOKS_API_URL);
  return response.data;
}

function doesExist(username) {
  return users.some((u) => u.username === username);
}

// POST /register
router.post('/register', async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (doesExist(username)) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });

  return res.status(201).json({
    message: 'User successfully registered. Now you can login'
  });
});

// GET /  → todos los libros (recuperados vía Axios con async/await)
router.get('/', async (req, res) => {
  try {
    const books = await fetchAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books',
      error: error.message
    });
  }
});

// GET /isbn/:isbn  → libro por ISBN (Axios + async/await)
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const books = await fetchAllBooks();

    const book =
      books[isbn] ||
      Object.values(books).find((b) => b.isbn === isbn);

    if (!book) {
      return res.status(404).json({
        message: `Book with ISBN ${isbn} not found`
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving book by ISBN',
      error: error.message
    });
  }
});

// GET /author/:author  → libros por autor (Axios + async/await)
router.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const books = await fetchAllBooks();

    const matches = Object.values(books).filter(
      (b) => b.author.toLowerCase() === author.toLowerCase()
    );

    if (matches.length === 0) {
      return res.status(404).json({
        message: `No books found for author ${author}`
      });
    }

    return res.status(200).json(matches);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books by author',
      error: error.message
    });
  }
});

// GET /title/:title  → libros por título (Axios + async/await)
router.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const books = await fetchAllBooks();

    const matches = Object.values(books).filter((b) =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );

    if (matches.length === 0) {
      return res.status(404).json({
        message: `No books found with title ${title}`
      });
    }

    return res.status(200).json(matches);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books by title',
      error: error.message
    });
  }
});

// GET /review/:isbn  → reseñas del libro (Axios + async/await)
router.get('/review/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const books = await fetchAllBooks();

    const book =
      books[isbn] ||
      Object.values(books).find((b) => b.isbn === isbn);

    if (!book) {
      return res.status(404).json({
        message: `Book with ISBN ${isbn} not found`
      });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving reviews',
      error: error.message
    });
  }
});

export default router;