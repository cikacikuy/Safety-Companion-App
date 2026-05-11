import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Phone, MapPin, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyButtonProps {
  userName: string;
  userPhone: string;
}

export function EmergencyButton({ userName, userPhone }: EmergencyButtonProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);

  const emergencyNumbers = [
    { name: 'Police', number: '110', color: 'bg-blue-500', icon: '🚓' },
    { name: 'Ambulance', number: '119', color: 'bg-red-500', icon: '🚑' },
    { name: 'Fire', number: '113', color: 'bg-orange-500', icon: '🚒' },
    { name: 'National Emergency', number: '112', color: 'bg-purple-500', icon: '📞' }
  ];

  const handleEmergencyCall = (serviceName: string, number: string) => {
    // In a real app, this would trigger an actual call
    toast.success(`Calling ${serviceName}...`, {
      description: `Dialing ${number}`
    });
    
    // Simulate emergency notification
    setTimeout(() => {
      toast.info('Emergency contacts have been notified', {
        description: 'Your location has been shared'
      });
    }, 1000);
  };

  const startHoldSOS = () => {
    setIsHolding(true);
    setHoldProgress(0);

    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Start countdown after hold complete
        let count = 5;
        setCountdown(count);

        const timer = setInterval(() => {
          count--;

          if (count <= 0) {
            clearInterval(timer);
            setCountdown(null);
            setIsEmergency(true);

            toast.error('🚨 EMERGENCY SOS ACTIVATED!', {
              description: 'Emergency contacts & services notified'
            });

            // Simulate slower notification sending
            setTimeout(() => {
              toast.success('Location & emergency alert sent', {
                description: 'President University, Cikarang'
              });
            }, 3000);

            setTimeout(() => {
              setIsEmergency(false);
            }, 7000);

          } else {
            setCountdown(count);
          }
        }, 1000);

        setCountdownInterval(timer);
      }
    }, 300);

    setHoldTimeout(interval);
  };

  const stopHoldSOS = () => {
    setIsHolding(false);
    setHoldProgress(0);

    if (holdTimeout) {
      clearInterval(holdTimeout);
    }
  };

  const cancelSOS = () => {
    setCountdown(null);
    toast.info('SOS cancelled');
  };

  return (
    <div className="space-y-6">
      {/* SOS Button */}
      <div className="text-center">
        {countdown !== null ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-40 h-40 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="text-7xl font-bold text-white">
                  {countdown}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-red-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 mb-2">Activating Emergency SOS</p>
              <p className="text-gray-600">Emergency services will be contacted</p>
            </div>
            <Button variant="outline" onClick={cancelSOS} className="w-full h-12 text-base font-semibold border-2">
              Cancel Activation
            </Button>
          </div>
        ) : isEmergency ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                <AlertCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-red-500 rounded-full opacity-30 animate-ping"></div>
              </div>
            </div>
            <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-6">
              <p className="text-2xl font-bold text-red-600 mb-2">🚨 EMERGENCY ACTIVE 🚨</p>
              <p className="text-sm text-red-700 font-medium">Emergency services and contacts have been notified</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl border-2 border-red-200">
              <Button
                size="lg"
                className="w-full h-40 text-3xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl shadow-2xl"
                onMouseDown={startHoldSOS}
                onMouseUp={stopHoldSOS}
                onMouseLeave={stopHoldSOS}
              >
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-3" />
                  <div className="font-bold">EMERGENCY SOS</div>
                  <div className="text-base font-normal mt-2 opacity-90">Hold to Activate</div>
                  <div className="w-full bg-red-300 rounded-full h-2 mt-4 overflow-hidden">
                  <div
                    className="bg-white h-2 transition-all duration-200"
                    style={{ width: `${holdProgress}%` }} />
                </div>
                </div>
              </Button>
            </div>
            <p className="text-sm text-gray-600 px-4">
              This will alert emergency services and all your trusted contacts with your location
            </p>
          </div>
        )}
      </div>

      {/* Emergency Numbers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-lg">Quick Dial Emergency Services</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyNumbers.map((service) => (
            <Button
              key={service.name}
              variant="outline"
              className="h-auto py-5 justify-start border-2 hover:shadow-lg transition-all hover:scale-[1.02]"
              onClick={() => handleEmergencyCall(service.name, service.number)}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <div className={`p-3 rounded-xl ${service.color} text-2xl flex-shrink-0`}>
                  {service.icon}
                </div>

                <div className="text-left min-w-0">
                  <p className="font-bold text-sm leading-tight break-words whitespace-normal">
                    {service.name}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">
                    {service.number}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Your Information</h4>
            <div className="space-y-2 text-sm">
              <p className="text-blue-800"><strong>Name:</strong> {userName}</p>
              <p className="text-blue-800"><strong>Phone:</strong> {userPhone}</p>
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-blue-200">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700">This information will be automatically shared with emergency services when you activate SOS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-900" />
          </div>
          <div>
            <p className="font-bold text-yellow-900 mb-1">Important</p>
            <p className="text-sm text-yellow-800">
              The SOS button will automatically contact emergency services and notify all your trusted contacts with your location. Use only in genuine emergencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}