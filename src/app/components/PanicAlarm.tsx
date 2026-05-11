import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Bell, BellOff, Volume2, AlertTriangle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface PanicAlarmProps {
  userName: string;
  userPhone: string;
}

export function PanicAlarm({ }: PanicAlarmProps) {
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopAlarmSound();

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const playAlarmSound = () => {
    try {
      // Create audio context for alarm sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create oscillator for siren sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure siren sound (alternating frequencies)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      
      // Create alternating effect
      let time = audioContext.currentTime;
      for (let i = 0; i < 100; i++) {
        oscillator.frequency.setValueAtTime(800, time);
        oscillator.frequency.setValueAtTime(400, time + 0.5);
        time += 1;
      }

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

      oscillator.start();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  };

  const stopAlarmSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (error) {
        console.error('Error stopping oscillator:', error);
      }
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const activateAlarm = () => {
  let count = 3;
  setCountdown(count);

  countdownTimerRef.current = setInterval(() => {
    count--;

    if (count <= 0) {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      setCountdown(null);
      setIsAlarmActive(true);
      playAlarmSound();

      // Vibrate continuously if supported
      if (navigator.vibrate) {
        const vibratePattern = [200, 100, 200, 100, 200, 100];

        const vibrateInterval = setInterval(() => {
          navigator.vibrate(vibratePattern);
        }, 1000);

        (window as any).panicVibrateInterval = vibrateInterval;
      }

      toast.error('PANIC ALARM ACTIVATED!', {
        description: 'Making loud noise to attract attention'
      });

      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const deactivateAlarm = () => {
    setIsAlarmActive(false);
    stopAlarmSound();
    
    // Stop vibration
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
    if ((window as any).panicVibrateInterval) {
      clearInterval((window as any).panicVibrateInterval);
    }
    
    toast.info('Alarm deactivated');
  };

  const cancelCountdown = () => {
  if (countdownTimerRef.current) {
    clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = null;
  }

  setCountdown(null);

    toast.info('Alarm cancelled');
  };

  return (
    <div className="space-y-6">
      {/* Main Control */}
      <div className="text-center">
        {countdown !== null ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-40 h-40 mx-auto bg-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                <div className="text-7xl font-bold text-white">
                  {countdown}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-orange-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600 mb-2">Activating Panic Alarm</p>
              <p className="text-gray-600">Alarm will sound in {countdown} second{countdown !== 1 ? 's' : ''}</p>
            </div>
            <Button variant="outline" onClick={cancelCountdown} className="w-full h-12 text-base font-semibold border-2">
              Cancel Alarm
            </Button>
          </div>
        ) : isAlarmActive ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-40 h-40 mx-auto bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                <Bell className="w-20 h-20 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-red-500 rounded-full opacity-30 animate-ping"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 bg-red-500 rounded-full opacity-20 animate-ping" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
            
            <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-6">
              <p className="text-2xl font-bold text-red-600 mb-2">🚨 ALARM ACTIVE 🚨</p>
              <p className="text-sm text-red-700 font-medium">Making loud noise to attract attention</p>
              <div className="mt-4">
                <Badge className="bg-red-600 text-white text-xs px-3 py-1">
                  Broadcasting at maximum volume
                </Badge>
              </div>
            </div>
            
            {/* Volume Indicator */}
            <div className="flex justify-center items-center gap-3 bg-white p-4 rounded-xl border-2 border-red-200">
              <Volume2 className="w-6 h-6 text-red-600 animate-pulse" />
              <div className="flex gap-1.5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-red-600 rounded-full animate-pulse"
                    style={{
                      height: `${(i + 1) * 4}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              variant="outline"
              onClick={deactivateAlarm}
              className="w-full h-14 border-2 border-red-500 hover:bg-red-50 font-semibold text-base"
            >
              <BellOff className="w-6 h-6 mr-2" />
              Stop Alarm
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border-2 border-orange-200">
              <Button
                size="lg"
                className="w-full h-40 text-3xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl shadow-2xl"
                onClick={activateAlarm}
              >
                <div className="text-center">
                  <Bell className="w-16 h-16 mx-auto mb-3" />
                  <div className="font-bold">Panic Alarm</div>
                  <div className="text-base font-normal mt-2 opacity-90">Press to Activate</div>
                </div>
              </Button>
            </div>
            <p className="text-sm text-gray-600 px-4">
              Activate a loud alarm sound and vibration to attract attention
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl text-center border-2 border-blue-200">
          <div className="p-3 bg-blue-500 rounded-xl inline-flex mb-3">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-base mb-1">Loud Siren</p>
          <p className="text-xs text-gray-600">Attention-grabbing alarm sound</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl text-center border-2 border-purple-200">
          <div className="p-3 bg-purple-500 rounded-xl inline-flex mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-base mb-1">Vibration</p>
          <p className="text-xs text-gray-600">Strong continuous vibration</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl text-center border-2 border-green-200">
          <div className="p-3 bg-green-500 rounded-xl inline-flex mb-3">
            <BellOff className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-base mb-1">Quick Stop</p>
          <p className="text-xs text-gray-600">Easy deactivation anytime</p>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-2">When to Use Panic Alarm</h4>
            <ul className="space-y-1.5 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>When being followed or feeling threatened</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>In dangerous or emergency situations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>To attract attention from nearby people</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>To deter potential attackers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">How It Works</h4>
            <p className="text-sm text-blue-800">
              The panic alarm produces a loud, attention-grabbing siren sound at maximum volume combined with continuous vibration. This helps alert people nearby that you need help and can deter potential threats.
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-900" />
          </div>
          <div>
            <p className="font-bold text-yellow-900 mb-1">Warning</p>
            <p className="text-sm text-yellow-800">
              The alarm will be very loud and may startle people nearby. Use responsibly and only in situations where you genuinely need to attract attention for your safety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}