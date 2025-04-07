# Deploying to Vercel

This guide will help you deploy your Image Generator application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure your project:
   - Framework Preset: Vite
   - Build Command: `npm run build` (should be auto-detected)
   - Output Directory: `dist` (should be auto-detected)
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Navigate to your project directory and run:
   ```
   vercel
   ```

3. Follow the prompts to complete the deployment

## Environment Variables

If you need to use your own Stable Horde API key in production, you can add it as an environment variable in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add a new variable:
   - Name: `VITE_STABLE_HORDE_API_KEY`
   - Value: Your API key

## Custom Domain (Optional)

To add a custom domain to your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the instructions

## Automatic Deployments

Vercel automatically deploys your application when you push changes to your Git repository. No additional configuration is needed.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel dashboard
2. Ensure your application works locally with `npm run build && npm run preview`
3. Verify that all dependencies are correctly listed in your package.json 