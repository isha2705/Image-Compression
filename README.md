# Image Compression & Analytics App

A web application for compressing images and analyzing compression metrics, built with Node.js and Express.

## Features

- Upload and compress images with customizable options
- View detailed compression statistics and image information
- Track compression analytics with visual charts
- Download compressed images
- No database required - uses local JSON storage

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: EJS templates, Bootstrap 5, Chart.js
- **Image Processing**: Sharp
- **Storage**: Local file system and JSON files

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd image-compressor
```

2. Install dependencies:
```
npm install
```

3. Start the application:
```
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Upload an Image**: Select an image file from your computer
2. **Configure Compression Settings**:
   - Adjust quality level (1-100)
   - Set optional dimensions
   - Choose output format (JPEG, PNG, WebP, AVIF)
3. **View Results**: See before/after comparison and detailed analytics
4. **Download**: Save your compressed images

## Compression Options

- **Quality**: Lower values = smaller file size, higher compression
- **Dimensions**: Optionally resize the image during compression
- **Format**: Choose from multiple output formats with different compression algorithms:
  - JPEG: Best for photographs
  - PNG: Best for images with transparency
  - WebP: Modern format with superior compression
  - AVIF: Latest format with excellent quality/size ratio

## Data Structure

The application uses a local JSON file (`data/images.json`) to store:
- Image metadata
- Compression statistics
- Analytics information

No database setup required!

## License

MIT 