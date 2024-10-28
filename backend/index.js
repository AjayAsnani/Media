const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const loginRoute = require('./routes/login');
const userEmailRoute = require('./routes/userEmailRoute');
const logout = require('./routes/logout.js');
const multer = require('multer'); // For handling file uploads
const sharp = require('sharp'); // For image conversion
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
require('dotenv').config(); // Load environment variables
const authMiddleware = require('./middleware/authMiddleware');
const approvedRoute = require('./routes/approved');
const rejectRoute = require('./routes/rejectRoute');
const userRoutes = require('./routes/userRoutes');
const withdrawalRoutes = require('./routes/withdrawlRoutes.js');
const changePasswordRoute = require('./routes/userPassword.js'); // New route for password change

const app = express();
const router = express.Router();

// Check for essential environment variables
if (!process.env.JWT_SECRET || !process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error('FATAL ERROR: Missing essential environment variables.');
  process.exit(1);
}

// Connect to MongoDB and start server only if successful
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    autoRemove: 'native',
  }, function (err) {
    if (err) {
      console.error('Session store connection failed:', err.message);
    }
  })
}));

// Routes
app.use('/api/login', loginRoute);
app.use('/api/users', require('./routes/userManagement.js'));
app.use('/api/register', require('./routes/registration'));
app.use('/api/logout', logout);
app.use('/api/users_email', userEmailRoute);
app.use('/api/approve', approvedRoute);
app.use('/api/reject', rejectRoute);
app.use('/api/userdata', userRoutes);
app.use('/api/withdraw', withdrawalRoutes);
app.use('/api/change', changePasswordRoute); // New change password route

app.get('/api/findusers/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('email');
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error.');
  }
});

// Endpoint to fetch pending users
app.get('/api/users/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({
      $or: [{ status: 'Pending' }, { status: { $exists: false } }]
    });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).send('Server error');
  }
});

// Protected route example
router.get('/protected-route', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session });
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Image upload and conversion to WebP
app.post('/upload', multer({ storage: multer.memoryStorage() }).single('image'), async (req, res) => {
  try {
    const webpBuffer = await sharp(req.file.buffer).webp().toBuffer();
    const fileName = `${Date.now()}.webp`;
    res.set('Content-Type', 'image/webp');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(webpBuffer);
  } catch (error) {
    res.status(500).send('Error converting image to WebP');
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// Image conversion to WebP and serving
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.post('/api/convert-to-webp', multer({ storage: multer.memoryStorage() }).single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  try {
    const webpFilename = `converted_${Date.now()}.webp`;
    const webpPath = path.join(uploadDir, webpFilename);
    await sharp(req.file.buffer).toFormat('webp', { quality: 80 }).toFile(webpPath);
    res.json({ webpUrl: `/uploads/${webpFilename}` });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

app.post('/api/upload-webp', multer({ storage: multer.memoryStorage() }).single('webpFile'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  const webpFilename = `uploaded_${Date.now()}.webp`;
  const webpPath = path.join(__dirname, 'public/uploads/', webpFilename);
  fs.writeFileSync(webpPath, req.file.buffer);
  res.json({ webpUrl: `/uploads/${webpFilename}` });
});

// Server startup function with graceful shutdown
const startServer = () => {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      console.log('HTTP server closed');
      if (mongoose.connection.readyState === 1) {
        mongoose.connection.close(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};
