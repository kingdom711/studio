import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/providers/auth-provider';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import HomePage from '@/pages/HomePage';
import ChecklistNewPage from '@/pages/ChecklistNewPage';
import ChecklistDetailPage from '@/pages/ChecklistDetailPage';

function App() {
  return (
    <BrowserRouter>
      <FirebaseClientProvider>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/checklists/new" element={<ChecklistNewPage />} />
                <Route path="/checklists/:id" element={<ChecklistDetailPage />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </FirebaseClientProvider>
    </BrowserRouter>
  );
}

export default App;

