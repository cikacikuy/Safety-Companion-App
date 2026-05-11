import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Map, 
  PhoneCall, 
  Bell,
  LogOut,
  Navigation,
  Users,
  Clock,
  Zap,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { LiveLocationSharing } from '@/app/components/LiveLocationSharing';
import { EmergencyButton } from '@/app/components/EmergencyButton';
import { SafeRouteGuide } from '@/app/components/SafeRouteGuide';
import { FakeCall } from '@/app/components/FakeCall';
import { PanicAlarm } from '@/app/components/PanicAlarm';
import { ChatFeature } from '@/app/components/ChatFeature';
import { TrustedContacts } from '@/app/components/TrustedContacts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

interface HomePageProps {
  userName: string;
  userPhone: string;
  onLogout: () => void;
}

export function HomePage({ userName, userPhone, onLogout }: HomePageProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: 'location',
      title: 'Live Location',
      description: 'Share your real-time location with trusted contacts',
      icon: MapPin,
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      component: LiveLocationSharing
    },
    {
      id: 'emergency',
      title: 'Emergency SOS',
      description: 'Instantly contact police or emergency services',
      icon: Phone,
      color: 'bg-red-500 hover:bg-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      component: EmergencyButton
    },
    {
      id: 'route',
      title: 'Safe Route',
      description: 'Get suggestions for well-lit and crowded routes',
      icon: Map,
      color: 'bg-green-500 hover:bg-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      component: SafeRouteGuide
    },
    {
      id: 'fakecall',
      title: 'Fake Call',
      description: 'Create a fake call to escape risky situations',
      icon: PhoneCall,
      color: 'bg-purple-500 hover:bg-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      component: FakeCall
    },
    {
      id: 'alarm',
      title: 'Panic Alarm',
      description: 'Activate loud alarm to attract attention',
      icon: Bell,
      color: 'bg-orange-500 hover:bg-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      component: PanicAlarm
    },
    {
      id: 'chat',
      title: 'Chat Feature',
      description: 'Communicate with trusted contacts',
      icon: MessageSquare,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      component: ChatFeature
    },
    {
      id: 'contacts',
      title: 'Trusted Contacts',
      description: 'Manage and view your trusted contacts',
      icon: UserCheck,
      color: 'bg-gray-500 hover:bg-gray-600',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      component: TrustedContacts
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SCAPP</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-600">{currentTime.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-600">{userPhone}</p>
              </div>
              <Button variant="outline" size="icon" onClick={onLogout} className="h-9 w-9 sm:h-10 sm:w-10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 pb-20">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome, {userName.split(' ')[0]}! 👋</h2>
          <p className="text-gray-600 text-sm sm:text-base">Stay safe with our comprehensive safety features</p>
        </div>

        {/* PRIORITY: Emergency Quick Actions - Most Important at Top */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Priority Features</h3>
            <Badge variant="destructive" className="text-xs">Quick Access</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Emergency SOS - Largest Button */}
            <Card 
              className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 cursor-pointer hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setActiveFeature('emergency')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Phone className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Emergency SOS</h3>
                    <p className="text-red-100 text-sm">Press for immediate help</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Panic Alarm */}
            <Card 
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 cursor-pointer hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setActiveFeature('alarm')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Bell className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Panic Alarm</h3>
                    <p className="text-orange-100 text-sm">Loud attention alarm</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Feature */}
            <Card 
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 cursor-pointer hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setActiveFeature('chat')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Chat Contacts</h3>
                    <p className="text-indigo-100 text-sm">Quick safety messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fake Call */}
            <Card 
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setActiveFeature('fakecall')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <PhoneCall className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Fake Call</h3>
                    <p className="text-purple-100 text-sm">Escape risky situations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-100 rounded-xl inline-flex mb-2">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <p className="text-base sm:text-lg font-bold">Safe</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-100 rounded-xl inline-flex mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Contacts</p>
              <p className="text-base sm:text-lg font-bold">{JSON.parse(localStorage.getItem('safetyContacts') || '[]').length}</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-100 rounded-xl inline-flex mb-2">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Location</p>
              <p className="text-base sm:text-lg font-bold">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Safety Features Grid */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900">All Safety Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-200 border-2 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className={`p-4 rounded-2xl inline-flex mb-3 ${feature.iconBg}`}>
                      <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className={`w-full h-12 ${feature.color} text-white shadow-lg`}>
                      Open Feature
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Safety Tip of the Day */}
        <Card className="mt-6 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-200 rounded-lg">
                <Shield className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-900 mb-1">💡 Safety Tip</h4>
                <p className="text-sm text-yellow-800">
                  Always let someone know where you're going and when you expect to arrive. Share your live location when traveling alone, especially at night.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Dialog */}
      <Dialog open={activeFeature !== null} onOpenChange={() => setActiveFeature(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              {activeFeatureData && (
                <>
                  <div className={`p-3 rounded-xl ${activeFeatureData.iconBg}`}>
                    <activeFeatureData.icon className={`w-6 h-6 ${activeFeatureData.iconColor}`} />
                  </div>
                  {activeFeatureData.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {activeFeatureData && <activeFeatureData.component userName={userName} userPhone={userPhone} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}