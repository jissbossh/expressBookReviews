import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import customerRoutes from './router/auth_users.js';
import generalRoutes from './router/general.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Sirve data/books.json en http://localhost:5000/books.json
// (fuente de datos que consumirá Axios en general.js)
app.use(express.static(path.join(__dirname, 'data')));

// Protege /customer/auth/*
app.use('/customer/auth', authenticateToken);

app.use('/customer', customerRoutes);
app.use('/', generalRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));