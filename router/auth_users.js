import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import books from './booksdb.js';

const router = express.Router();

export let users = [
  {
    username: 'user1',
    password: await bcrypt.hash('pwd1', 10)
  }
];

// POST /customer/login
router.post('/login', async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password required'
    });
  }

  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      message: 'Invalid login. Check username and password'
    });
  }

  const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  return res.status(200).json({
    message: 'User successfully logged in',
    token
  });
});

// PUT /customer/auth/review/:isbn
router.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.user?.username;

  if (!username) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  const book =
    books[isbn] || Object.values(books).find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review text is required' });
  }

  const existing = book.reviews.find((r) => r.username === username);

  if (existing) {
    existing.review = review;
    return res.status(200).json({
      message: 'Review updated',
      reviews: book.reviews
    });
  }

  book.reviews.push({ username, review });
  return res.status(200).json({
    message: 'Review added',
    reviews: book.reviews
  });
});

// DELETE /customer/auth/review/:isbn
router.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user?.username;

  if (!username) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  const book =
    books[isbn] || Object.values(books).find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }

  const index = book.reviews.findIndex(
    (r) => r.username === username
  );

  if (index === -1) {
    return res.status(404).json({
      message: `No review by ${username} for ISBN ${isbn}`
    });
  }

  book.reviews.splice(index, 1);
  return res.status(200).json({
    message: 'Review deleted',
    reviews: book.reviews
  });
});

export default router;