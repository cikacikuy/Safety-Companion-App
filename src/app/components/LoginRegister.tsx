import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Shield, Heart, Sparkles } from 'lucide-react';

interface LoginRegisterProps {
  onLogin: (name: string, phone: string) => void;
}

const SafetyLogo = () => {
  return (
    <div className="relative">
      {/* Outer glow circle */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-2xl scale-150"></div>
      
      {/* Logo container */}
      <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
        {/* Inner gradient circle */}
        <div className="absolute inset-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-90"></div>
        
        {/* Shield with heart */}
        <div className="relative z-10 flex items-center justify-center">
          <Shield className="w-12 h-12 text-white fill-white/20" strokeWidth={2.5} />
          <Heart className="absolute w-6 h-6 text-pink-200 fill-pink-200" strokeWidth={0} />
        </div>
        
        {/* Decorative sparkles */}
        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
        <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export function LoginRegister({ onLogin }: LoginRgitgiegisterProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (phone.length < 12 || phone.length > 13) {
      alert('Phone number must be 12-13 digits');
      return;
    }
  onLogin(name, phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-15 blur-2xl"></div>
      
      <Card className="w-full max-w-md shadow-2xl border-2 border-white/50 backdrop-blur-sm bg-white/95 relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <SafetyLogo />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            SCAPP
          </CardTitle>
          <CardDescription className="text-base mt-3 text-gray-600">
            Your personal safety assistant, always by your side ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-2 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, '');
                  setPhone(onlyNumbers);
                }}
                required
                minLength={12}
                maxLength={13}
                className="h-12 border-2 focus:border-purple-400"
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold text-base shadow-lg" size="lg">
              Get Started
            </Button>
          </form>
          
          {/* Safety tips */}
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
            <p className="text-xs text-center text-gray-600 font-medium">
              🛡️ Protected • 🔒 Secure • 💪 Empowered
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}