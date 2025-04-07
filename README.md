# AI Image Generator

A simple React application that uses the Stable Horde API to generate AI images based on text prompts.

## Features

- Text-to-image generation using Stable Horde API
- Simple and clean user interface
- Responsive design
- Error handling and loading states

## Project Structure

```
src/
├── components/
│   ├── ImageGenerator.jsx    # Main component for image generation
│   └── ImageGenerator.css    # Styles for the ImageGenerator component
├── services/
│   └── stableHordeService.js # API service for Stable Horde
├── App.jsx                   # Main App component
├── App.css                   # App styles
├── index.jsx                 # Entry point
└── index.css                 # Global styles
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## API Usage

This project uses the Stable Horde API for image generation. The current implementation uses anonymous access, which has rate limits. For production use, consider obtaining an API key from [Stable Horde](https://stablehorde.net/).

## Integration

This project is designed with a modular structure to make it easy to integrate into larger projects. The main `ImageGenerator` component can be imported and used in any React application.

## License

MIT
