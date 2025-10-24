import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BottomNav } from './components/navigation/BottomNav';
import { SDAdminLayout } from './components/admin/SDAdminLayout';
import { SDLeaderboard } from './components/admin/SDLeaderboard';
import { SDNotifications } from './components/admin/SDNotifications';
import { SDSettings } from './components/admin/SDSettings';

// Screens
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { ConsentUploadScreen } from './components/screens/ConsentUploadScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { LogHoursScreen } from './components/screens/LogHoursScreen';
import { BadgesScreen } from './components/screens/BadgesScreen';
import { ClaimsScreen } from './components/screens/ClaimsScreen';
import { AdminStudentDashboard } from './components/screens/AdminStudentDashboard';
import { AdminCoordinatorDashboard } from './components/screens/AdminCoordinatorDashboard';
import { CoordinatorDashboard } from './components/screens/CoordinatorDashboard';
import { CoordinatorHomeScreen } from './components/screens/CoordinatorHomeScreen';
import { StudentsListScreen } from './components/screens/StudentsListScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { StudentProfileScreen } from './components/screens/StudentProfileScreen';

// Modals and overlays
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { toast, Toaster } from 'sonner@2.0.3';

type AppScreen = 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'consent-upload'
  | 'dashboard' 
  | 'log-hours' 
  | 'badges' 
  | 'history' 
  | 'profile'
  | 'coordinator'
  | 'claims'
  | 'notifications'
  | 'leaderboard'
  | 'students'
  | 'events';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'dashboard' | 'history' | 'badges' | 'profile' | 'coordinator' | 'claims' | 'notifications' | 'leaderboard' | 'students' | 'events'>('dashboard');
  
  const { user, loading, logout } = useAuth();

  // Handle navigation based on auth state and user needs
  useEffect(() => {
    if (loading) return;

    if (!user) {
      // User not logged in - show welcome/auth screens
      if (!['welcome', 'login', 'register'].includes(currentScreen)) {
        setCurrentScreen('welcome');
      }
    } else {
      // User is logged in
      if (user.role === 'coordinator' || user.role === 'admin-coordinator') {
        // Coordinators go straight to dashboard (home screen)
        if (['welcome', 'login', 'register', 'consent-upload'].includes(currentScreen)) {
          setCurrentScreen('dashboard');
          setActiveBottomTab('dashboard');
        }
      } else {
        // Students (regular and admin-student) - check if they need consent upload
        if (user.isMinor && (!user.consentStatus || user.consentStatus === 'pending')) {
          if (currentScreen !== 'consent-upload') {
            setCurrentScreen('consent-upload');
          }
        } else {
          // Student with proper consent (or not a minor) - go to dashboard
          if (['welcome', 'login', 'register', 'consent-upload'].includes(currentScreen)) {
            setCurrentScreen('dashboard');
            setActiveBottomTab('dashboard');
          }
        }
      }
    }
  }, [user, loading, currentScreen]);

  // Handle bottom navigation
  const handleBottomNavChange = (tab: typeof activeBottomTab) => {
    setActiveBottomTab(tab);
    
    if (user?.role === 'coordinator' || user?.role === 'admin-coordinator') {
      // For coordinators/admin-coordinators, navigate to the appropriate screen
      setCurrentScreen(tab);
    } else if (tab === 'dashboard') {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen(tab);
    }
  };

  // Screen navigation handlers
  const handleGetStarted = () => setCurrentScreen('register');
  const handleShowLogin = () => setCurrentScreen('login');
  const handleShowRegister = () => setCurrentScreen('register');
  const handleShowPrivacy = () => setShowPrivacyModal(true);
  const handleForgotPassword = () => {
    toast.info('Password reset link would be sent to your email');
  };

  const handleConsentContinue = () => {
    if (user?.consentStatus === 'approved') {
      setCurrentScreen('dashboard');
      setActiveBottomTab('dashboard');
    } else {
      toast.success('Consent form submitted! You\'ll be notified when it\'s approved.');
    }
  };

  const handleLogHours = () => setCurrentScreen('log-hours');
  const handleViewBadges = () => {
    setCurrentScreen('badges');
    setActiveBottomTab('badges');
  };
  const handleViewHistory = () => {
    setCurrentScreen('history');
    setActiveBottomTab('history');
  };
  const handleViewSchools = () => {
    toast.info('Schools directory coming soon!');
  };

  const handleBackToDashboard = () => {
    if (user?.role === 'coordinator') {
      setCurrentScreen('coordinator');
      setActiveBottomTab('claims');
    } else {
      setCurrentScreen('dashboard');
      setActiveBottomTab('dashboard');
    }
  };

  const handleLogSuccess = () => {
    toast.success('Volunteer hours submitted successfully!');
    handleBackToDashboard();
  };

  const handleViewDocument = (docUrl: string) => {
    // In a real app, this would open a document viewer modal
    toast.info('Document viewer would open here');
    console.log('View document:', docUrl);
  };

  const handleOpenNotifications = () => {
    setCurrentScreen('notifications');
    setActiveBottomTab('notifications');
  };

  const handleOpenSettings = () => {
    console.log('Settings pressed');
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const showBottomNav = user && !['welcome', 'login', 'register', 'consent-upload', 'log-hours'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className={showBottomNav ? 'pb-20' : ''}>
        {currentScreen === 'welcome' && (
          <WelcomeScreen 
            onGetStarted={handleGetStarted}
            onViewPrivacy={handleShowPrivacy}
          />
        )}
        
        {currentScreen === 'login' && (
          <LoginScreen 
            onRegister={handleShowRegister}
            onForgotPassword={handleForgotPassword}
          />
        )}
        
        {currentScreen === 'register' && (
          <RegisterScreen 
            onLogin={handleShowLogin}
            onPrivacyPolicy={handleShowPrivacy}
          />
        )}
        
        {currentScreen === 'consent-upload' && (
          <ConsentUploadScreen 
            onContinue={handleConsentContinue}
          />
        )}
        
        {currentScreen === 'dashboard' && (
          (user?.role === 'coordinator' || user?.role === 'admin-coordinator') ? (
            <CoordinatorHomeScreen 
              onAlertsPress={() => {
                setCurrentScreen('notifications');
                setActiveBottomTab('notifications');
              }}
              onProfilePress={() => {
                setCurrentScreen('profile');
                setActiveBottomTab('profile');
              }}
            />
          ) : user?.role === 'admin-student' ? (
            <AdminStudentDashboard 
              onLogHours={handleLogHours}
              onViewBadges={handleViewBadges}
              onViewHistory={handleViewHistory}
              onViewSchools={handleViewSchools}
              onAlertsPress={handleOpenNotifications}
              onSettingsPress={handleOpenSettings}
            />
          ) : (
            <DashboardScreen 
              onLogHours={handleLogHours}
              onViewBadges={handleViewBadges}
              onViewHistory={handleViewHistory}
              onViewSchools={handleViewSchools}
              onAlertsPress={handleOpenNotifications}
              onSettingsPress={handleOpenSettings}
            />
          )
        )}
        
        {currentScreen === 'log-hours' && (
          <LogHoursScreen 
            onBack={handleBackToDashboard}
            onSuccess={handleLogSuccess}
          />
        )}
        
        {currentScreen === 'badges' && (
          <BadgesScreen 
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentScreen === 'claims' && (
          (user?.role === 'coordinator' || user?.role === 'admin-coordinator') ? (
            <CoordinatorDashboard 
              onViewDocument={handleViewDocument}
            />
          ) : (
            <ClaimsScreen 
              onBack={handleBackToDashboard}
            />
          )
        )}
        
        {currentScreen === 'notifications' && (
          <div className="min-h-screen">
            <SDNotifications />
          </div>
        )}
        
        {currentScreen === 'coordinator' && (
          <div className="min-h-screen">
            <SDAdminLayout 
              activeTab={activeBottomTab as 'dashboard' | 'claims' | 'notifications' | 'leaderboard' | 'profile'}
              onSettingsPress={handleOpenSettings}
              onAlertsPress={handleOpenNotifications}
              onLeaderboardPress={() => {
                toast.info('Leaderboard feature coming soon!');
              }}
            />
          </div>
        )}
        
        {currentScreen === 'history' && (
          <ClaimsScreen 
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentScreen === 'leaderboard' && (
          <div className="min-h-screen">
            <SDLeaderboard />
          </div>
        )}
        
        {currentScreen === 'students' && (
          <StudentsListScreen 
            isAdmin={user?.role === 'admin-coordinator'}
            onAlertsPress={handleOpenNotifications}
            onSettingsPress={handleOpenSettings}
          />
        )}
        
        {currentScreen === 'profile' && (
          (user?.role === 'coordinator' || user?.role === 'admin-coordinator') ? (
            <SDSettings 
              onAlertsPress={handleOpenNotifications}
              onSettingsPress={handleOpenSettings}
            />
          ) : (
            <StudentProfileScreen 
              onAlertsPress={handleOpenNotifications}
              onSettingsPress={handleOpenSettings}
            />
          )
        )}
        
        {currentScreen === 'events' && (
          <EventsScreen 
            onBack={handleBackToDashboard}
            onAlertsPress={handleOpenNotifications}
            onSettingsPress={handleOpenSettings}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNav 
          activeTab={activeBottomTab}
          onTabChange={handleBottomNavChange}
          userRole={user?.role || 'student'}
        />
      )}

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy & Consent</DialogTitle>
            <DialogDescription>
              Please read and agree to our privacy policy and consent terms.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">Data Collection</h4>
              <p className="text-muted-foreground">
                Stone Dragon NPO collects personal information including name, email, school, 
                and volunteer activity records to track and verify your community contributions.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">POPIA Compliance</h4>
              <p className="text-muted-foreground">
                We comply with South Africa's Protection of Personal Information Act (POPIA). 
                Your data is processed lawfully and stored securely.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Data Usage</h4>
              <p className="text-muted-foreground">
                Your information is used solely for volunteer hour tracking, badge awarding, 
                and communication about your volunteer activities.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Your Rights</h4>
              <p className="text-muted-foreground">
                You can request access to, correction of, or deletion of your personal data. 
                Contact our Information Officer at info@stonedragon.org.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Consent for Minors</h4>
              <p className="text-muted-foreground">
                Users under 18 require guardian consent before logging volunteer hours. 
                This ensures compliance with child protection requirements.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}