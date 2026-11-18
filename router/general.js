import express from 'express';
import bcrypt from 'bcryptjs';
import books from './booksdb.js';
import { users } from './auth_users.js';

const router = express.Router();

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

// GET /  → todos los libros
router.get('/', async (req, res) => {
  return res.status(200).json(books);
});

// GET /isbn/:isbn
router.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const book =
    books[isbn] ||
    Object.values(books).find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }

  return res.status(200).json(book);
});

// GET /author/:author
router.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  const matches = Object.values(books).filter(
    (b) => b.author.toLowerCase() === author.toLowerCase()
  );

  if (matches.length === 0) {
    return res.status(404).json({
      message: `No books found for author ${author}`
    });
  }

  return res.status(200).json(matches);
});

// GET /title/:title
router.get('/title/:title', async (req, res) => {
  const { title } = req.params;

  const matches = Object.values(books).filter((b) =>
    b.title.toLowerCase().includes(title.toLowerCase())
  );

  if (matches.length === 0) {
    return res.status(404).json({
      message: `No books found with title ${title}`
    });
  }

  return res.status(200).json(matches);
});

// GET /review/:isbn
router.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const book =
    books[isbn] ||
    Object.values(books).find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }

  return res.status(200).json(book.reviews);
});

export default router;