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
const storage = multer.memoryStorage();
const upload = multer({ storage });
const sharp = require('sharp'); // For image conversion
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
require('dotenv').config(); // Load environment variables
const authMiddleware = require('./middleware/authMiddleware');
const approvedRoute = require('./routes/approved');
const rejectRoute = require('./routes/rejectRoute.js');
const userRoutes = require('./routes/userRoutes')

const app = express();

const router = express.Router();

// Ensure important environment variables are loaded
if (!process.env.JWT_SECRET || !process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error('FATAL ERROR: Missing essential environment variables.');
  process.exit(1); // Exit process if important environment variables are missing
}

// Connect to MongoDB and only start the server if the connection succeeds
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer(); // Start the server only after MongoDB is connected
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit process on MongoDB connection failure
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
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1-day expiration for cookies
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    autoRemove: 'native', // Automatically remove expired sessions
  }, function (err) {
    if (err) {
      console.error('Session store connection failed:', err.message);
    }
  })
}));

// Routes
app.use('/api/login', loginRoute); // Login route


app.use('/api/users', require('./routes/userManagement.js'));
app.use('/api/register', require('./routes/registration'));
app.use('/api/logout', logout);
app.use('/api/users_email', userEmailRoute);
app.use('/api/approve', approvedRoute);
app.use('/api/reject', rejectRoute);
app.use('/api/userdata',userRoutes)

// Assuming you're using Express and Mongoose
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


router.get('/protected-route', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session });
});
// Serve static files from the public/uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
      const webpBuffer = await sharp(req.file.buffer).webp().toBuffer();
      const fileName = `${Date.now()}.webp`;

      // Save the WebP file or send it as a response
      res.set('Content-Type', 'image/webp');
      res.set('Content-Disposition', `attachment; filename=${fileName}`);
      res.send(webpBuffer);
  } catch (error) {
      res.status(500).send('Error converting image to WebP');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}, // Only expose error details in development
  });
});

// New code for image-to-webp conversion


// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Image conversion route
app.post('/api/convert-to-webp', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const webpFilename = `converted_${Date.now()}.webp`;
    const webpPath = path.join(uploadDir, webpFilename);

    // Convert the image to WebP format and save it
    await sharp(req.file.buffer)
      .toFormat('webp', { quality: 80 })
      .toFile(webpPath);

    // Send the WebP file URL back to the frontend
    res.json({ webpUrl: `/uploads/${webpFilename}` });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

// New route for uploading and viewing WebP files
app.post('/api/upload-webp', upload.single('webpFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const webpFilename = `uploaded_${Date.now()}.webp`;
  const webpPath = path.join(__dirname, 'public/uploads/', webpFilename);

  // Ensure the directory exists
  fs.mkdirSync(path.join(__dirname, 'public/uploads/'), { recursive: true });

  // Save WebP image
  fs.writeFileSync(webpPath, req.file.buffer);

  // Return the URL for viewing the uploaded WebP file
  res.json({ webpUrl: `/uploads/${webpFilename}` });
});

// Function to handle server startup after MongoDB connection is established
const startServer = () => {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown handler
  const shutdown = (signal) => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      console.log('HTTP server closed');
      if (mongoose.connection.readyState === 1) {
        mongoose.connection.close(() => {
          console.log('MongoDB connection closed');
          process.exit(0); // Gracefully exit after closing the database
        });
      } else {
        process.exit(0); // Exit immediately if no MongoDB connection
      }
    });
  };

  // Graceful shutdown on SIGTERM (for production environments)
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', () => shutdown('SIGINT'));
};
