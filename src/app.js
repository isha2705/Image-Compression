const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const expressLayouts = require('express-ejs-layouts');
const imageRoutes = require('./routes/imageRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Ensure required directories exist
const dirs = [
  path.join(__dirname, '../public/uploads'),
  path.join(__dirname, '../public/compressed'),
  path.join(__dirname, '../data')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize data file if it doesn't exist
const dataFilePath = path.join(__dirname, '../data/images.json');
if (!fs.existsSync(dataFilePath)) {
  fs.writeJSONSync(dataFilePath, { images: [], analytics: { totalCompression: 0, totalSaved: 0, count: 0 } });
}

// Routes
app.use('/', imageRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 