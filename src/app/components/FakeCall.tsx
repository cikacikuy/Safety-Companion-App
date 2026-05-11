import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { PhoneCall, Phone, PhoneOff, User, Clock, Shield, Mic, Square, Play, Trash2, Volume2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/app/components/ui/card';

interface FakeCallProps {
  userName: string;
  userPhone: string;
}

interface VoiceRecording {
  id: string;
  name: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
}

export function FakeCall({ }: FakeCallProps) {
  const [callerName, setCallerName] = useState('');
  const [delay, setDelay] = useState('0');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [incomingNumber, setIncomingNumber] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ringtoneAudioContextRef = useRef<AudioContext | null>(null);
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateFakePhoneNumber = () => {
    const prefixes = ['812', '813', '821', '822', '851', '878', '895'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    const middle = Math.floor(1000 + Math.random() * 9000);
    const end = Math.floor(1000 + Math.random() * 9000);

    return `+62 ${prefix}-${middle}-${end}`;
  };

  const presetCallers = [
    { 
      name: 'Mom', 
      phone: '+62 812-1111-2345',
      icon: '👩',
      voiceScript: "Hi sweetie, it's mom. I need you to come home right away. It's urgent. Can you leave now?",
      voiceGender: 'female' as const,
      voicePitch: 1.2
    },
    { 
      name: 'Dad', 
      phone: '+62 813-2222-5678',
      icon: '👨',
      voiceScript: "Hey, it's dad. I need your help with something important. Can you come over as soon as possible?",
      voiceGender: 'male' as const,
      voicePitch: 0.8
    },
    { 
      name: 'Boss', 
      phone: '+62 821-4455-8899',
      icon: '💼',
      voiceScript: "Hello, this is your manager. We have an urgent situation at the office. I need you to come in immediately.",
      voiceGender: 'male' as const,
      voicePitch: 0.9
    },
    { 
      name: 'Friend', 
      phone: '+62 878-9988-7766',
      icon: '👤',
      voiceScript: "Hey! I really need your help right now. It's an emergency. Can you meet me? I'm waiting for you.",
      voiceGender: 'female' as const,
      voicePitch: 1.1
    },
    { 
      name: 'Partner', 
      phone: '+62 895-3344-2211',
      icon: '💑',
      voiceScript: "Hey babe, I miss you. Can you come see me now? I really need to talk to you about something important.",
      voiceGender: 'female' as const,
      voicePitch: 1.15
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFakeCall = () => {
    const delayMs = parseInt(delay) * 1000;

    if (!callerName.trim()) {
    toast.error('Please enter a caller name');
    return;
}
    
    if (delayMs > 0) {
      toast.info(`Incoming call in ${delay} seconds...`);
    }

    const presetCaller = presetCallers.find(c => c.name === callerName);

    if (presetCaller?.phone) {
      setIncomingNumber(presetCaller.phone);
    } else {
      setIncomingNumber(generateFakePhoneNumber());
    }

    setTimeout(() => {
      setIsRinging(true);
      toast.success('Incoming call!', {
        description: `${callerName} is calling...`
      });
      
      // Play ringtone
      playRingtone();
      
      // Vibrate if supported
      if (navigator.vibrate) {
        const vibratePattern = [500, 200, 500, 200, 500];
        const vibrateInterval = setInterval(() => {
          if (navigator.vibrate) {
            navigator.vibrate(vibratePattern);
          }
        }, 2000);
        
        // Stop vibrating after 30 seconds or when call is answered/declined
        setTimeout(() => {
          clearInterval(vibrateInterval);
        }, 30000);
      }
    }, delayMs);
  };

  const playRingtone = () => {
    try {
      if (!ringtoneAudioContextRef.current) {
        ringtoneAudioContextRef.current = new AudioContext();
      }
      
      const context = ringtoneAudioContextRef.current;
      let isPlaying = true;
      
      const playTone = () => {
        if (!isPlaying) return;
        
        // Create dual oscillators for more realistic ringtone
        const osc1 = context.createOscillator();
        const osc2 = context.createOscillator();
        const gainNode = context.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(800, context.currentTime);
        osc2.frequency.setValueAtTime(1000, context.currentTime);
        
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(context.destination);
        
        osc1.start(context.currentTime);
        osc2.start(context.currentTime);
        osc1.stop(context.currentTime + 0.5);
        osc2.stop(context.currentTime + 0.5);
        
        setTimeout(() => {
          if (isPlaying) {
            const osc3 = context.createOscillator();
            const osc4 = context.createOscillator();
            const gainNode2 = context.createGain();
            
            osc3.type = 'sine';
            osc4.type = 'sine';
            osc3.frequency.setValueAtTime(600, context.currentTime);
            osc4.frequency.setValueAtTime(750, context.currentTime);
            
            gainNode2.gain.setValueAtTime(0, context.currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
            gainNode2.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
            
            osc3.connect(gainNode2);
            osc4.connect(gainNode2);
            gainNode2.connect(context.destination);
            
            osc3.start(context.currentTime);
            osc4.start(context.currentTime);
            osc3.stop(context.currentTime + 0.5);
            osc4.stop(context.currentTime + 0.5);
          }
        }, 600);
      };
      
      // Play ringtone pattern repeatedly
      playTone();
      ringtoneIntervalRef.current = setInterval(playTone, 2000);
      
      // Cleanup function
      return () => {
        isPlaying = false;
        if (ringtoneIntervalRef.current) {
          clearInterval(ringtoneIntervalRef.current);
        }
      };
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
  };

  const stopRingtone = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
    if (ringtoneAudioContextRef.current) {
      ringtoneAudioContextRef.current.close();
      ringtoneAudioContextRef.current = null;
    }
  };

  const answerCall = () => {
    setIsRinging(false);
    setIsCallActive(true);
    setCallDuration(0);
    stopRingtone();
    toast.success('Call connected');
    
    // Play voice after 2 seconds of "answering"
    setTimeout(() => {
      playCallerVoice();
    }, 2000);
  };

  const declineCall = () => {
    setIsRinging(false);
    stopRingtone();
    toast.info('Call declined');
  };

  const playCallerVoice = () => {
    // First check if user has custom recording
    if (selectedVoice && audioRef.current) {
      const selectedRecording = voiceRecordings.find(rec => rec.id === selectedVoice);
      if (selectedRecording) {
        audioRef.current.src = selectedRecording.audioUrl;
        audioRef.current.play();
        toast.info('Playing voice message...', {
          description: 'Custom recording'
        });
        return;
      }
    }

    // Otherwise, use text-to-speech for preset callers
    const caller = presetCallers.find(c => c.name === callerName);
    if (caller && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(caller.voiceScript);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Better voice selection logic with multiple fallbacks
      let selectedVoice: SpeechSynthesisVoice | null = null;
      
      if (caller.voiceGender === 'female') {
        // Try to find female voice with multiple criteria
        selectedVoice = 
          voices.find(v => v.lang.startsWith('en') && (
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('susan') ||
            v.name.toLowerCase().includes('karen') ||
            v.name.toLowerCase().includes('moira') ||
            v.name.toLowerCase().includes('fiona') ||
            v.name.toLowerCase().includes('zira')
          )) ||
          // Fallback: try natural-sounding English voices (often female by default)
          voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male')) ||
          null;
      } else {
        // Try to find male voice with multiple criteria
        selectedVoice = 
          voices.find(v => v.lang.startsWith('en') && (
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('man') ||
            v.name.toLowerCase().includes('daniel') ||
            v.name.toLowerCase().includes('alex') ||
            v.name.toLowerCase().includes('tom') ||
            v.name.toLowerCase().includes('oliver') ||
            v.name.toLowerCase().includes('fred') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('mark')
          )) ||
          null;
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.95;
      utterance.pitch = caller.voicePitch;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
      toast.info('Voice message playing...', {
        description: `${callerName} is speaking`
      });
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Stop text-to-speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    toast.info('Call ended');
  };

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const newRecording: VoiceRecording = {
              id: Date.now().toString(),
              name: recordingName || 'Recording',
              audioUrl,
              duration: recordingDuration,
              createdAt: new Date()
            };
            setVoiceRecordings(prev => [...prev, newRecording]);
            setSelectedVoice(newRecording.id);
            audioChunksRef.current = [];
          };
          mediaRecorder.start();
          setIsRecording(true);
          recordingTimerRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
          }, 1000);
        })
        .catch(err => {
          toast.error('Error accessing microphone', {
            description: err.message
          });
        });
    } else {
      toast.error('Your browser does not support audio recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingDuration(0);
    }
  };

  const playVoice = (id: string) => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = voiceRecordings.find(rec => rec.id === id)?.audioUrl || '';
      audio.play();
      setPlayingVoiceId(id);
    }
  };

  const pauseVoice = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setPlayingVoiceId(null);
    }
  };

  const deleteVoice = (id: string) => {
    setVoiceRecordings(prev => prev.filter(rec => rec.id !== id));
    if (selectedVoice === id) {
      setSelectedVoice(null);
    }
  };

  return (
    <div className="space-y-6">
      {isRinging ? (
        <>
          {/* Incoming Call Screen */}
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 py-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              {/* Caller Avatar with Pulsing Animation */}
              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                  <span className="text-6xl">
                    {presetCallers.find(c => c.name === callerName)?.icon || '📞'}
                  </span>
                </div>
                {/* Pulsing rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-purple-400 rounded-full opacity-30 animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                  <div className="w-48 h-48 bg-pink-400 rounded-full opacity-20 animate-ping"></div>
                </div>
              </div>
              
              {/* Caller Info */}
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-white">{callerName}</h2>
                <p className="text-gray-400 text-sm">
                  {incomingNumber}
                </p>
                <p className="text-xl text-gray-300">Mobile</p>
                <Badge className="bg-blue-500 text-white px-4 py-1.5 text-sm">
                  Incoming Call...
                </Badge>
              </div>

              {/* Phone ringing animation */}
              <div className="flex justify-center gap-3 py-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-12 bg-green-400 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '1s'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Answer/Decline Buttons */}
            <div className="flex items-center justify-center gap-12 pt-8">
              {/* Decline Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={declineCall}
                  className="rounded-full w-20 h-20 shadow-2xl bg-red-500 hover:bg-red-600 border-4 border-red-300"
                >
                  <PhoneOff className="w-8 h-8" />
                </Button>
                <p className="text-sm text-gray-300 mt-3 font-medium">Decline</p>
              </div>

              {/* Answer Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={answerCall}
                  className="rounded-full w-20 h-20 shadow-2xl bg-green-500 hover:bg-green-600 border-4 border-green-300 animate-bounce"
                >
                  <Phone className="w-8 h-8" />
                </Button>
                <p className="text-sm text-gray-300 mt-3 font-medium">Answer</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 max-w-md">
              <p className="text-xs text-gray-400 text-center">
                💡 Pretend to answer this call to escape uncomfortable situations
              </p>
            </div>
          </div>
        </>
      ) : !isCallActive ? (
        <>
          {/* Setup */}
          <div className="space-y-5">
            <div>
              <Label htmlFor="callerName" className="text-sm font-semibold">Caller Name</Label>
              <Input
                id="callerName"
                placeholder="Who's calling?"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Quick Presets</Label>
              <div className="grid grid-cols-5 gap-2">
                {presetCallers.map((caller) => (
                  <Button
                    key={caller.name}
                    variant={callerName === caller.name ? 'default' : 'outline'}
                    onClick={() => setCallerName(caller.name)}
                    className={`flex-col h-auto py-4 border-2 transition-all relative ${
                      callerName === caller.name 
                        ? 'bg-purple-500 hover:bg-purple-600 border-purple-500' 
                        : 'hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white px-1.5 py-0.5 text-xs">
                      <Volume2 className="w-3 h-3" />
                    </Badge>
                    <span className="text-2xl mb-1.5">{caller.icon}</span>
                    <span className="text-xs font-medium">{caller.name}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                All presets include built-in voice messages using text-to-speech
              </p>
            </div>

            <div>
              <Label htmlFor="delay" className="text-sm font-semibold">Delay Before Call</Label>
              <Select value={delay} onValueChange={setDelay}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Immediately</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Voice Recordings */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-2xl border-2 border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <Label className="text-sm font-semibold">Custom Voice for Call</Label>
                  <Badge variant="secondary" className="text-xs">NEW</Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRecordingModal(!showRecordingModal)}
                  className="border-2 border-purple-300 hover:bg-purple-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Voice
                </Button>
              </div>

              {showRecordingModal && (
                <div className="mb-4 p-4 bg-white rounded-xl border-2 border-purple-300">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="recordingName" className="text-xs font-semibold">Recording Name</Label>
                      <Input
                        id="recordingName"
                        placeholder="e.g., Mom Emergency, Boss Call"
                        value={recordingName}
                        onChange={(e) => setRecordingName(e.target.value)}
                        className="mt-1 h-10"
                      />
                    </div>
                    
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        className="w-full bg-red-500 hover:bg-red-600"
                        size="sm"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg border-2 border-red-300">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-red-600">Recording... {formatDuration(recordingDuration)}</span>
                        </div>
                        <Button
                          onClick={stopRecording}
                          className="w-full bg-gray-600 hover:bg-gray-700"
                          size="sm"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop & Save
                        </Button>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-600 text-center">
                      💡 Record a voice message that will play during the fake call
                    </p>
                  </div>
                </div>
              )}

              {voiceRecordings.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">
                  No voice recordings yet. Add one to make your fake call more realistic!
                </p>
              ) : (
                <div className="space-y-2">
                  {voiceRecordings.map((recording) => (
                    <Card
                      key={recording.id}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedVoice === recording.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'hover:border-purple-300'
                      }`}
                      onClick={() => setSelectedVoice(recording.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (playingVoiceId === recording.id) {
                                pauseVoice();
                              } else {
                                playVoice(recording.id);
                              }
                            }}
                          >
                            {playingVoiceId === recording.id ? (
                              <Square className="w-5 h-5 text-purple-600" />
                            ) : (
                              <Play className="w-5 h-5 text-purple-600" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{recording.name}</p>
                            <p className="text-xs text-gray-600">{formatDuration(recording.duration)}</p>
                          </div>
                          {selectedVoice === recording.id && (
                            <Badge className="bg-purple-500">Selected</Badge>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteVoice(recording.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <audio ref={audioRef} className="hidden" />

            <Button onClick={startFakeCall} className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-semibold" size="lg">
              <PhoneCall className="w-6 h-6 mr-2" />
              Start Fake Call
            </Button>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <PhoneCall className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-purple-900 mb-2">How It Works</h4>
                <ul className="space-y-1.5 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Choose who appears to be calling you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Set a delay or receive the call immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Pretend to answer and have a conversation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Use as an excuse to leave uncomfortable situations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">When to Use</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Uncomfortable social situations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Unwanted conversations or interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Walking alone and feeling unsafe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Need an excuse to leave quickly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Active Call Screen */}
          <div className="text-center space-y-6 py-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1">
                Connected
              </Badge>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-2">{callerName}</h3>
              <p className="text-gray-600 font-medium">Mobile</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 bg-white p-4 rounded-xl border-2 border-gray-200">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono font-bold">{formatDuration(callDuration)}</span>
            </div>

            {/* Call Animation */}
            <div className="flex justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-green-500 rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.sin(i) * 20}px`,
                    animationDelay: `${i * 150}ms`
                  }}
                ></div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                variant="destructive"
                onClick={endCall}
                className="rounded-full w-20 h-20 shadow-2xl bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <p className="text-sm text-gray-600 mt-4 font-medium">End Call</p>
            </div>

            {/* Conversation Prompts */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl text-left border-2 border-gray-200">
              <h4 className="font-bold mb-3 text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Conversation Prompts
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="p-2 bg-white rounded-lg border">"Hey {callerName}, what's up?"</p>
                <p className="p-2 bg-white rounded-lg border">"Oh really? When do you need me there?"</p>
                <p className="p-2 bg-white rounded-lg border">"Okay, I'll leave right now."</p>
                <p className="p-2 bg-white rounded-lg border">"See you soon!"</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Warning */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <Shield className="w-5 h-5 text-yellow-900" />
          </div>
          <div>
            <p className="font-bold text-yellow-900 mb-1">Remember</p>
            <p className="text-sm text-yellow-800">
              This is a tool to help you exit uncomfortable situations safely. The call is simulated and won't actually connect to anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}