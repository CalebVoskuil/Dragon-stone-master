# Stone Dragon Admin - React Native Implementation Guide

## Overview
This document provides guidance for implementing the Stone Dragon admin/coordinator experience in React Native using the provided components and design tokens.

## Design System

### Colors
All Stone Dragon colors are defined in `/tokens/stone-dragon-tokens.json`:

```javascript
// React Native StyleSheet
const colors = {
  sd_color_bg: '#FDFDFD',
  sd_surface_primary: '#5A2D82',
  sd_surface_secondary: '#7B4CB3',
  sd_accent_reject: '#E63946',
  sd_accent_pending: '#F77F00',
  sd_accent_accept: '#FFD60A',
  sd_accent_green: '#3BB273',
  sd_text_dark: '#2D2D2D',
  sd_text_light: '#FFFFFF'
};
```

### Typography
Font sizing and weights for React Native:

```javascript
const typography = {
  sd_h1: { fontSize: 24, fontWeight: '600', lineHeight: 31 },
  sd_h2: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  sd_subhead: { fontSize: 16, fontWeight: '500', lineHeight: 22 },
  sd_body: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  sd_caption: { fontSize: 12, fontWeight: '400', lineHeight: 17 }
};
```

### Shadows
React Native shadow configuration:

```javascript
const shadows = {
  sd_shadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6, // Android
    shadowColor: '#000000'
  }
};
```

## Component Mapping

### Core Layout Components

#### SDTopPill
```javascript
// Usage in React Native
<SDTopPill 
  onSettingsPress={() => navigation.navigate('Settings')}
  onLeaderboardPress={() => navigation.navigate('Leaderboard')}
/>
```

#### SDRaisedPage
```javascript
// Wraps main content with consistent styling
<SDRaisedPage>
  {/* Your content here */}
</SDRaisedPage>
```

#### SDBottomNav
```javascript
<SDBottomNav 
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### Claims Components

#### SDClaimCard
```javascript
<SDClaimCard
  id={claim.id}
  studentName={claim.studentName}
  claimId={claim.claimId}
  date={claim.date}
  hours={claim.hours}
  description={claim.description}
  isSelected={selectedClaims.has(claim.id)}
  onSelect={handleClaimSelect}
  onApprove={handleApprove}
  onReject={handleReject}
  onCardPress={handleClaimPress}
/>
```

#### SDClaimModal
```javascript
<SDClaimModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  claim={selectedClaim}
  onApprove={handleApprove}
  onReject={handleReject}
/>
```

## API Integration

### Endpoints and Component Mapping

#### Claims Management
- **GET /api/logs/pending** → `SDClaimsMerged` component
- **PATCH /api/logs/:id/verify** → `SDActionAccept`/`SDActionReject` buttons
- **GET /api/logs/:id** → `SDClaimModal` detailed view

#### Dashboard Stats
- **GET /api/admin/stats** → `SDStatCircle` components
- **GET /api/admin/recent-activity** → `SDAdminDashboard`

#### Notifications
- **GET /api/notifications** → `SDNotifications` component
- **PATCH /api/notifications/:id/read** → `SDNotificationCard` read state

#### User Management
- **GET /api/users/:id/export** → Settings export functionality
- **PATCH /api/admin/settings** → `SDSettings` preferences

## Navigation Structure

```javascript
// React Navigation structure
const AdminStack = createStackNavigator();

function AdminNavigator() {
  return (
    <AdminStack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      <AdminStack.Screen name="AdminMain" component={SDAdminLayout} />
      <AdminStack.Screen 
        name="ClaimDetail" 
        component={SDClaimModal}
        options={{ presentation: 'modal' }}
      />
    </AdminStack.Navigator>
  );
}
```

## Animations

### Modal Transitions
```javascript
// Modal slide-up animation
const slideUpAnimation = {
  transform: [
    {
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0]
      })
    }
  ]
};
```

### Toggle Filter Animation
```javascript
// Smooth sliding thumb
const thumbPosition = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [4, 116] // 4px to 116px based on activeTab
});
```

### Action Button Press
```javascript
// Scale animation on press
const scaleAnimation = {
  transform: [{ scale: pressed ? 0.95 : 1.0 }]
};
```

## Accessibility

### Touch Targets
All interactive elements meet minimum 40x40 point touch targets:

```javascript
const styles = StyleSheet.create({
  touchableButton: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

### Screen Reader Support
```javascript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Approve claim"
  accessibilityRole="button"
  accessibilityHint="Approves the volunteer claim and awards points"
>
  <SDActionAccept />
</TouchableOpacity>
```

### High Contrast Support
```javascript
// Alternative color palette for high contrast mode
const highContrastColors = {
  sd_surface_primary: '#3D1A5B', // Darker purple
  sd_accent_accept: '#FFE500',   // Brighter yellow
  sd_accent_reject: '#FF0000'    // Pure red
};
```

## State Management

### Claims State
```javascript
// Redux/Context state structure
const claimsState = {
  pending: [],
  settled: [],
  selected: new Set(),
  activeFilter: 'pending',
  loading: false,
  error: null
};
```

### Modal State
```javascript
const modalState = {
  visible: false,
  claim: null,
  comment: '',
  loading: false
};
```

## Performance Optimizations

### List Virtualization
```javascript
// Use FlatList for large claim lists
<FlatList
  data={filteredClaims}
  renderItem={({ item }) => <SDClaimCard {...item} />}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: 84, // Fixed height
    offset: 84 * index,
    index
  })}
  removeClippedSubviews={true}
/>
```

### Image Optimization
```javascript
// Lazy load proof images
<Image
  source={{ uri: proofUrl }}
  style={styles.proofThumbnail}
  resizeMode="cover"
  loadingIndicatorSource={require('./placeholder.png')}
/>
```

## Testing

### Component Tests
```javascript
// Jest/React Native Testing Library
describe('SDClaimCard', () => {
  it('calls onApprove when approve button is pressed', () => {
    const onApprove = jest.fn();
    const { getByLabelText } = render(
      <SDClaimCard {...mockClaim} onApprove={onApprove} />
    );
    
    fireEvent.press(getByLabelText('Approve'));
    expect(onApprove).toHaveBeenCalledWith(mockClaim.id);
  });
});
```

### Accessibility Tests
```javascript
// Accessibility testing
it('meets accessibility standards', () => {
  const { getByA11yLabel } = render(<SDClaimCard {...mockClaim} />);
  expect(getByA11yLabel('Approve claim')).toBeTruthy();
});
```

## Deployment

### Expo Configuration
```json
{
  "expo": {
    "name": "Stone Dragon Admin",
    "slug": "stone-dragon-admin",
    "platforms": ["ios", "android"],
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#5A2D82"
    }
  }
}
```

### Platform-Specific Considerations

#### iOS
- Use `SafeAreaView` for proper safe area handling
- Implement haptic feedback for action buttons
- Use `UIBlurEffect` for modal backgrounds

#### Android
- Handle hardware back button in modals
- Use Material Design ripple effects
- Implement proper elevation shadows

## Error Handling

### Network Errors
```javascript
const handleApiError = (error) => {
  if (error.status === 401) {
    // Redirect to login
    navigation.replace('Login');
  } else if (error.status >= 500) {
    // Show generic error message
    showToast('Server error. Please try again.');
  }
};
```

### Offline Support
```javascript
// Check network connectivity
const isConnected = useNetInfo();

if (!isConnected) {
  // Show offline banner
  return <OfflineBanner />;
}
```

This implementation guide provides the foundation for building a production-ready React Native admin experience that matches the Stone Dragon design system and provides excellent user experience for coordinators managing volunteer claims.