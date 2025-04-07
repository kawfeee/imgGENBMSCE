import axios from 'axios';

// Stable Horde API endpoints
const API_URL = 'https://stablehorde.net/api/v2';

// Get API key from environment variable or use anonymous access
const API_KEY = import.meta.env.VITE_STABLE_HORDE_API_KEY || '0000000000';

// Function to generate an image
export const generateImage = async (prompt) => {
  try {
    console.log('Starting image generation for prompt:', prompt);
    
    // Step 1: Create a generation request
    const generationResponse = await axios.post(`${API_URL}/generate/async`, {
      prompt: prompt,
      params: {
        width: 512,
        height: 512,
        steps: 30,
        cfg_scale: 7.5,
      },
      nsfw: false,
      censor_nsfw: true,
      trusted_workers: true,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY,
        'Client-Agent': 'imagegen-app:1.0.0'
      }
    });

    const { id } = generationResponse.data;
    console.log('Generation request submitted, ID:', id);
    
    // Step 2: Check status and wait for completion
    let status = { done: false };
    let attempts = 0;
    const maxAttempts = 60; // Limit to prevent infinite loops (2 minutes max)
    
    while (!status.done && attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
      const statusResponse = await axios.get(`${API_URL}/generate/check/${id}`);
      status = statusResponse.data;
      console.log(`Status check #${attempts}:`, status);
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Image generation timed out');
    }
    
    // Step 3: Get the generated image
    const resultResponse = await axios.get(`${API_URL}/generate/status/${id}`);
    console.log('Result received:', resultResponse.data);
    
    if (resultResponse.data.generations && resultResponse.data.generations.length > 0) {
      const imageData = resultResponse.data.generations[0];
      console.log('Image generation successful. Image data type:', typeof imageData.img);
      console.log('Image data length:', imageData.img ? imageData.img.length : 'N/A');
      
      // Check if we have a URL or base64 data
      if (imageData.img && typeof imageData.img === 'string') {
        if (imageData.img.startsWith('http')) {
          console.log('Returning image URL');
          return imageData.img;
        } else {
          console.log('Returning base64 image data');
          return imageData.img;
        }
      } else {
        console.error('Invalid image data received:', imageData);
        throw new Error('Invalid image data received from API');
      }
    }
    
    throw new Error('No image was generated');
  } catch (error) {
    console.error('Error generating image:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}; 