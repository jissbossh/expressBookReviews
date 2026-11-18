import express from 'express';
import customerRoutes from './router/auth_users.js';
import generalRoutes from './router/general.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
app.use(express.json());

// Protege /customer/auth/*
app.use('/customer/auth', authenticateToken);

app.use('/customer', customerRoutes);
app.use('/', generalRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));