# 📱 Push Notifications Setup Guide

## 🎯 Goal
Enable push notifications on your phone when the app is closed/backgrounded.

## ✅ What You Already Have
- ✅ Service Worker (`public/sw.js`)
- ✅ Push Notification Service (`src/lib/notifications.ts`)
- ✅ API Routes (`api/send-push-notification.js`, `api/schedule-notification.js`)
- ✅ Database Tables (`push_subscriptions`, `notifications`)
- ✅ Supabase Edge Function (`supabase/functions/send-push-notification/index.ts`)

## 🔧 Setup Steps

### Step 1: Install Dependencies
```bash
npm install web-push
```

### Step 2: Generate VAPID Keys
```bash
node generate-vapid-keys.js
```

This will output:
```
🔑 VAPID Keys Generated:

Public Key (VITE_VAPID_PUBLIC_KEY):
BPHx...your_public_key_here

Private Key (VAPID_PRIVATE_KEY):
your_private_key_here

📝 Add these to your .env file:
VITE_VAPID_PUBLIC_KEY=BPHx...your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### Step 3: Update Environment Variables
Add to your `.env` file:
```env
# Push Notifications
VITE_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_CONTACT_EMAIL=your_email@example.com
```

### Step 4: Deploy Supabase Edge Function
```bash
# Navigate to your project directory
cd supabase/functions/send-push-notification

# Deploy the function
supabase functions deploy send-push-notification
```

### Step 5: Update Supabase Environment Variables
In your Supabase dashboard:
1. Go to Settings > API
2. Add environment variables:
   - `VAPID_PUBLIC_KEY`: Your public VAPID key
   - `VAPID_PRIVATE_KEY`: Your private VAPID key
   - `VAPID_CONTACT_EMAIL`: Your email

### Step 6: Test Push Notifications

#### Test on Desktop:
1. Open your app in Chrome
2. Grant notification permission
3. Check console for "✅ Push notifications initialized successfully"
4. Add a plant or create a calendar event
5. Close the browser tab
6. Wait for notification time

#### Test on Mobile:
1. Open your app in mobile browser
2. Grant notification permission
3. Add to home screen (PWA)
4. Close the app
5. Wait for notification time

## 🧪 Testing Commands

### Check Service Worker:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
})
```

### Check Push Subscription:
```javascript
// In browser console
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    console.log('Push Subscription:', subscription)
  })
})
```

### Manual Test Notification:
```javascript
// In browser console
fetch('/api/send-push-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    notification: {
      title: '🧪 Test Push',
      body: 'This is a test push notification!',
      type: 'info',
      category: 'general',
      priority: 'medium'
    },
    userId: 'default'
  })
})
```

## 📱 How It Works

### 1. Subscription Process:
1. User opens app
2. Service worker registers
3. Push subscription created
4. Subscription saved to database

### 2. Notification Flow:
1. App schedules notification (plant watering, calendar, etc.)
2. Notification saved to database with `scheduled_for` time
3. Background service checks for due notifications
4. API route sends push notification
5. Supabase Edge Function delivers to user's devices
6. Service worker shows notification on device

### 3. Mobile Support:
- **iOS Safari**: Limited push support (only when app is open)
- **Android Chrome**: Full push support
- **PWA**: Best experience when installed to home screen

## 🔍 Troubleshooting

### Common Issues:

#### 1. "No VAPID key found"
- Check `.env` file has `VITE_VAPID_PUBLIC_KEY`
- Restart development server

#### 2. "Push notifications not supported"
- Use HTTPS (required for push notifications)
- Check browser compatibility

#### 3. "Service worker registration failed"
- Check `public/sw.js` exists
- Clear browser cache

#### 4. "No push subscriptions found"
- Check user granted permission
- Check subscription saved to database

### Debug Commands:
```javascript
// Check notification permission
console.log('Permission:', Notification.permission)

// Check service worker
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs))

// Check push manager
navigator.serviceWorker.ready.then(sw => {
  sw.pushManager.getSubscription().then(sub => console.log(sub))
})
```

## 🚀 Production Deployment

### Vercel:
1. Add environment variables in Vercel dashboard
2. Deploy API routes automatically
3. Ensure HTTPS is enabled

### Supabase:
1. Deploy Edge Function
2. Set environment variables
3. Test with production URL

## 📊 Monitoring

### Check Database:
```sql
-- Check push subscriptions
SELECT * FROM push_subscriptions WHERE user_id = 'default';

-- Check scheduled notifications
SELECT * FROM notifications 
WHERE category = 'plants' 
AND scheduled_for > NOW()
ORDER BY scheduled_for;
```

### Check Logs:
- Browser console for client-side logs
- Vercel logs for API routes
- Supabase logs for Edge Functions

## 🎯 Success Indicators

✅ **Desktop**: Notifications work when browser is closed
✅ **Mobile**: Notifications work when app is backgrounded
✅ **PWA**: Notifications work when app is installed
✅ **Scheduling**: Notifications trigger at exact times
✅ **Persistence**: Notifications survive app restarts

## 📱 Mobile-Specific Notes

### iOS:
- Push notifications only work when app is open
- PWA installation improves experience
- Safari limitations apply

### Android:
- Full push notification support
- Works when app is closed
- Best experience with PWA

### PWA Installation:
- Add to home screen for best experience
- Enables background sync
- Improves notification reliability

---

**Your push notification system is now ready to work on mobile devices!** 📱✨
