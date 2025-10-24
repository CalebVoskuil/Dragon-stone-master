# Navigation & Testing Guide

## 🚀 Quick Start

### 1. Install Required Dependency

```bash
cd stone-dragon-app/frontend
npx expo install @react-native-async-storage/async-storage
```

### 2. Start the App

```bash
npx expo start --clear
```

---

## 🔐 Mock Authentication

The app now uses **mock authentication** so you can navigate without a backend!

### Login Credentials (Any work!)

**Student Account:**
- Email: `student@example.com` (or any email without "coordinator")
- Password: `anything` (any password works)
- **Result**: Logs in as Sarah Johnson (Student)

**Coordinator Account:**
- Email: `coordinator@example.com` (or any email with "coordinator")
- Password: `anything` (any password works)
- **Result**: Logs in as John Smith (Coordinator)

---

## 📱 Navigation Flow

### Student Experience

1. **Welcome Screen** (3 slides)
   - Tap "Next" or "Skip"
   - Tap "Get Started"

2. **Register or Login**
   - Can register with any details
   - Or login with student@example.com

3. **Student Dashboard**
   - View stats (Total Hours, Day Streak, Points)
   - See recent activity
   - Badge progress

4. **Bottom Navigation (5 Tabs)**
   - **Home**: Dashboard
   - **Log**: Submit volunteer hours
   - **Badges**: View achievements
   - **Events**: Browse opportunities
   - **Profile**: Settings & logout

### Coordinator Experience

1. **Login with coordinator email**
   - Email: coordinator@example.com
   - Password: anything

2. **Coordinator Dashboard**
   - View pending claims
   - Statistics overview
   - Filter tabs

3. **Bottom Navigation (5 Tabs)**
   - **Home**: Dashboard
   - **Claims**: Review volunteer hours
   - **Students**: Browse student directory
   - **Board**: Leaderboard rankings
   - **Settings**: Account & preferences

---

## 🔄 Switch Between Roles (Dev Mode)

To quickly test both experiences, you can:

### Method 1: Logout and Login Again
1. Go to Profile/Settings
2. Tap "Logout"
3. Login with different email:
   - `student@example.com` → Student view
   - `coordinator@example.com` → Coordinator view

### Method 2: Add Dev Tools (Optional)

Add this button to any screen for quick role switching:

```typescript
import { useAuth } from '../store/AuthContext';

const { switchRole } = useAuth();

// Add button
<TouchableOpacity onPress={() => switchRole('COORDINATOR')}>
  <Text>Switch to Coordinator</Text>
</TouchableOpacity>
```

---

## 🎯 Test All Features

### Student Features to Test

✅ **Dashboard**
- View stats cards
- See recent activity
- Badge progress
- Quick actions

✅ **Log Hours**
- Fill form
- Add description
- Upload photo proof
- Submit

✅ **Badges**
- View earned badges
- See locked badges
- Progress bars

✅ **Events**
- Browse events
- Filter by category
- View event details
- Register

✅ **Profile**
- View stats
- Edit info
- Logout

### Coordinator Features to Test

✅ **Dashboard**
- Statistics grid
- Pending claims count
- Filter tabs
- Claims list

✅ **Claims Management**
- Search claims
- Filter (All, Pending, Approved, Rejected)
- Approve/reject buttons
- Bulk actions (long press)

✅ **Students List**
- Search students
- View student stats
- Filter by school

✅ **Leaderboard**
- Top 3 podium
- Full rankings
- Period selector (week/month/year)

✅ **Settings**
- Toggle notifications
- Toggle dark mode
- View profile
- Logout

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@react-native-async-storage/async-storage'"
**Solution:**
```bash
npx expo install @react-native-async-storage/async-storage
```

### Issue: Navigation doesn't work
**Solution:**
1. Check you're logged in
2. Try logout and login again
3. Restart Metro bundler: `npx expo start --clear`

### Issue: Screens show empty
**Solution:**
- This is expected - all data is MOCK data
- The UI and navigation work, just no real data yet

---

## 📋 Complete Test Checklist

### Auth Flow
- [ ] Welcome screen loads with gradient
- [ ] Can tap through 3 onboarding slides
- [ ] Can navigate to Register
- [ ] Can fill and submit registration
- [ ] Can navigate to Login
- [ ] Can login with any credentials
- [ ] Dashboard loads after login

### Student Navigation
- [ ] All 5 bottom tabs work
- [ ] Can navigate between tabs
- [ ] Can logout from Profile
- [ ] Login redirects back to Welcome

### Coordinator Navigation
- [ ] All 5 bottom tabs work
- [ ] Can view claims
- [ ] Can search students
- [ ] Can view leaderboard
- [ ] Can access settings
- [ ] Can logout

### UI Elements
- [ ] Gradient backgrounds display
- [ ] Glassmorphic cards have blur effect
- [ ] Buttons respond to taps
- [ ] Forms accept input
- [ ] Pull-to-refresh works
- [ ] Status badges display correctly

---

## 🎨 Visual Check

Verify these design elements match Figma:

- ✅ Deep purple (#58398B) gradient backgrounds
- ✅ Glassmorphic blur cards
- ✅ Golden (#FFD60A) accent buttons
- ✅ Orange (#F77F00) pending status
- ✅ Red (#E63946) reject buttons
- ✅ Smooth animations
- ✅ Custom bottom tab bar with active state

---

## 🚀 Next Steps

Once navigation works:
1. Connect to backend API
2. Replace mock data with real API calls
3. Add error handling
4. Implement real authentication
5. Add push notifications
6. Test on physical device

---

## 💡 Quick Tips

**Fast Testing:**
- Use Expo Go app on phone for quick testing
- Press `r` in terminal to reload
- Shake device to access dev menu
- Use iOS simulator for consistent testing

**Role Switching:**
```typescript
// Login as student
login({ email: 'student@example.com', password: 'test' })

// Login as coordinator
login({ email: 'coordinator@example.com', password: 'test' })
```

---

**Last Updated:** 2025-01-27

