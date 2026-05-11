import { useState, useEffect } from 'react';
import { LoginRegister } from '@/app/components/LoginRegister';
import { HomePage } from '@/app/components/HomePage';
import { Toaster } from '@/app/components/ui/sonner';

interface User {
  name: string;
  phone: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('safetyCompanionUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (name: string, phone: string) => {
    const newUser = { name, phone };
    setUser(newUser);
    localStorage.setItem('safetyCompanionUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('safetyCompanionUser');
  };

  return (
    <>
      <div className="min-h-screen">
        {user ? (
          <HomePage 
            userName={user.name} 
            userPhone={user.phone} 
            onLogout={handleLogout}
          />
        ) : (
          <LoginRegister onLogin={handleLogin} />
        )}
      </div>
      <Toaster position="top-center" />
    </>
  );
}
