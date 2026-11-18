import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function getAllBooks() {
  const { data } = await axios.get(`${BASE_URL}/`);
  return data;
}

async function getBookByISBN(isbn) {
  const { data } = await axios.get(`${BASE_URL}/isbn/${isbn}`);
  return data;
}

async function getBooksByAuthor(author) {
  const { data } = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return data;
}

async function getBooksByTitle(title) {
  const { data } = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );
  return data;
}

async function getBookReviews(isbn) {
  const { data } = await axios.get(`${BASE_URL}/review/${isbn}`);
  return data;
}

async function register(username, password) {
  const { data } = await axios.post(
    `${BASE_URL}/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );
  return data;
}

async function login(username, password) {
  const { data } = await axios.post(
    `${BASE_URL}/customer/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );
  return data;
}

async function addOrUpdateReview(token, isbn, review) {
  const { data } = await axios.put(
    `${BASE_URL}/customer/auth/review/${isbn}?review=${encodeURIComponent(review)}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

async function deleteReview(token, isbn) {
  const { data } = await axios.delete(
    `${BASE_URL}/customer/auth/review/${isbn}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviews,
  register,
  login,
  addOrUpdateReview,
  deleteReview
};