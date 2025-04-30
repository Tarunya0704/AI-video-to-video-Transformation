# AI Video Transformation Tool - Deployment Guide

This document provides instructions for deploying the AI Video Transformation Tool to Vercel.

## Prerequisites

Before deploying, you'll need:

1. A [Vercel account](https://vercel.com/signup)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) for the database
3. A [Cloudinary account](https://cloudinary.com/users/register/free) for video storage
4. Access to the Fai API (Hunyuan-Video Model)
5. [Node.js](https://nodejs.org/) (v16 or later) and npm installed locally

## Setup External Services

### 1. MongoDB Atlas Setup

1. Create a new MongoDB Atlas cluster or use an existing one
2. Create a database named `video-transformation`
3. Create the following collections:
   - `uploads`
   - `transformations`
4. Create a database user with read/write permissions
5. Get your MongoDB connection string (You'll need this for environment variables)

### 2. Cloudinary Setup

1. Create a Cloudinary account or log in to your existing account
2. Navigate to the Dashboard to get your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. Configure upload presets with the following settings:
   - Allowed formats: mp4, webm, mov, avi
   - Max file size: 100MB

### 3. Fai API (Hunyuan-Video Model) Access

1. Obtain API credentials for the Fai API
2. Note the API key and endpoint URL

## Local Development

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-video-transformation
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the required environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   MONGODB_URI=<your-mongodb-connection-string>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   FAI_API_KEY=<your-fai-api-key>
   FAI_API_URL=<fai-api-endpoint>
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploying to Vercel

1. Create a new project on Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository

2. Configure environment variables:
   - In your project settings, add the following environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
     - `FAI_API_KEY`: Your Fai API key
     - `FAI_API_URL`: The Fai API endpoint URL
     - `NEXT_PUBLIC_API_URL`: Your deployed app URL (e.g., `https://your-app.vercel.app`)

3. Deploy the application:
   - Vercel will automatically deploy your application
   - You can trigger manual deployments from the Vercel dashboard

4. Set up a custom domain (optional):
   - In the Vercel dashboard, navigate to your project
   - Go to "Settings" > "Domains"
   - Add and configure your custom domain

## Webhook Configuration

For the asynchronous video transformation to work correctly, you need to configure the webhook URL:

1. Once your app is deployed, note your application URL
2. Update the webhook URL in your Fai API configuration:
   - Set the webhook URL to `https://your-app.vercel.app/api/webhook`
   - Ensure the webhook endpoint is publicly accessible

## Monitoring and Maintenance

1. Monitor your application using Vercel Analytics
2. Check MongoDB Atlas for database performance and storage usage
3. Monitor Cloudinary usage for storage and bandwidth
4. Regularly check for API rate limits and usage with the Fai API

## Troubleshooting

1. **Webhook Issues**: Ensure your webhook URL is correctly configured and publicly accessible
2. **Video Upload Problems**: Check Cloudinary logs and verify upload preset configurations
3. **Database Connectivity**: Verify MongoDB Atlas connection string and network access settings
4. **API Rate Limiting**: Check if you're hitting rate limits with the Fai API

## Security Considerations

1. Always use environment variables for sensitive credentials
2. Implement proper authentication and authorization
3. Validate all user inputs and file uploads
4. Consider implementing CORS restrictions on your API endpoints