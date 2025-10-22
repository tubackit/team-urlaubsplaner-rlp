# GitHub Secrets Configuration

## Required Secrets for Deployment

### Vercel Deployment (Optional)
If you want to use automatic Vercel deployment, add these secrets to your GitHub repository:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add the following repository secrets:

#### `VERCEL_TOKEN`
- Get from: Vercel Dashboard → Settings → Tokens
- Create a new token with appropriate permissions

#### `VERCEL_ORG_ID`
- Get from: Vercel Dashboard → Settings → General
- Copy the "Organization ID"

#### `VERCEL_PROJECT_ID`
- Get from: Vercel Dashboard → Project Settings → General
- Copy the "Project ID"

## Alternative Deployment Options

### 1. Manual Deployment
- Build the project locally: `npm run build`
- Upload the `dist/` folder to your hosting provider

### 2. Netlify Deployment
- Connect your GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

### 3. GitHub Pages
- Enable GitHub Pages in repository settings
- Use the build artifacts from the CI/CD pipeline

## Environment Variables

### Required for Production
- `GEMINI_API_KEY`: Your Google Gemini API key

### Development
- Copy `.env.example` to `.env.local`
- Add your API key: `GEMINI_API_KEY=your_key_here`
