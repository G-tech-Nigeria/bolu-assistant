# 🚀 Deployment Guide

This guide will help you deploy your Bolu Assistant app to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables are configured
- [ ] Supabase project is set up and running
- [ ] Database tables are created
- [ ] Build passes successfully (`npm run build`)
- [ ] All unused files are removed

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Pros**: Fast, automatic deployments, great for React apps, free tier available

**Steps**:
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

### 2. Netlify

**Pros**: Good free tier, easy setup, custom domains

**Steps**:
1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (or your version)

4. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the same variables as above

5. **Deploy**
   - Netlify will build and deploy automatically

### 3. GitHub Pages

**Pros**: Free, integrated with GitHub

**Steps**:
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

**Pros**: Google's platform, good performance

**Steps**:
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub Actions: `No`

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Environment Variables

Make sure these are set in your hosting platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📱 PWA Configuration

Your app is already configured as a PWA with:
- Service Worker for offline functionality
- Web App Manifest for installability
- Icons for various platforms

## 🔍 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] All features work correctly
- [ ] Database connections work
- [ ] PWA installs properly
- [ ] Dark/light mode works
- [ ] All routes are accessible
- [ ] Mobile responsiveness works

## 🐛 Troubleshooting

### Build Errors
- Check for TypeScript errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules && npm install`

### Environment Variables
- Verify variables are set correctly in hosting platform
- Check for typos in variable names
- Ensure `.env.local` is not committed to git

### Database Issues
- Verify Supabase project is active
- Check database connection in browser console
- Ensure RLS policies are configured correctly

### PWA Issues
- Check if HTTPS is enabled (required for PWA)
- Verify service worker is registered
- Test offline functionality

## 📊 Performance Optimization

### Build Optimization
- The build shows a warning about large chunks
- Consider code splitting for better performance
- Use dynamic imports for heavy components

### Database Optimization
- Implement proper indexing
- Use pagination for large datasets
- Optimize queries

## 🔒 Security Considerations

- Environment variables are properly secured
- Supabase RLS policies are configured
- No sensitive data in client-side code
- HTTPS is enabled

## 📈 Monitoring

After deployment, monitor:
- App performance
- Error rates
- User engagement
- Database usage

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables
3. Test locally with production build
4. Check hosting platform logs

---

**Happy Deploying! 🚀**
