import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { 
  Send, 
  Zap, 
  MessageSquare,
  Clock,
  CheckCheck,
  User,
  Mic,
  Play,
  Square,
  Volume2
} from 'lucide-react';

interface ChatFeatureProps {
  userName: string;
  userPhone: string;
}

interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: Date;
  read: boolean;
  contactId?: string;
  isVoice?: boolean;
  voiceDuration?: number;
  audioUrl?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export function ChatFeature({ userName, userPhone }: ChatFeatureProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick text message templates
  const quickTemplates = [
    {
      id: 'safe',
      text: "I'm safe now",
      icon: '✓',
      color: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-700'
    },
    {
      id: 'arrived',
      text: "Arrived safely",
      icon: '🏠',
      color: 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700'
    },
    {
      id: 'help',
      text: "Need help!",
      icon: '⚠️',
      color: 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'
    },
    {
      id: 'late',
      text: "Running late, will update soon",
      icon: '🕐',
      color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-700'
    },
    {
      id: 'sharing',
      text: "Sharing my location",
      icon: '📍',
      color: 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700'
    }
  ];

  // Voice message templates
  const voiceTemplates = [
    {
      id: 'emergency',
      text: "I need help immediately! This is an emergency!",
      icon: <Mic className="w-4 h-4" />,
      color: 'bg-red-500 hover:bg-red-600 text-white',
      duration: 3
    },
    {
      id: 'safe-voice',
      text: "I'm safe and sound. Just checking in.",
      icon: <Mic className="w-4 h-4" />,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      duration: 3
    },
    {
      id: 'location-voice',
      text: "Please track my location. I'm sharing it with you now.",
      icon: <Mic className="w-4 h-4" />,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      duration: 4
    },
    {
      id: 'uncomfortable-voice',
      text: "I feel uncomfortable. Please call me in 5 minutes.",
      icon: <Mic className="w-4 h-4" />,
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      duration: 4
    }
  ];

  useEffect(() => {
    // Load contacts from localStorage
    const storedContacts = JSON.parse(localStorage.getItem('safetyContacts') || '[]');
    setContacts(storedContacts);
    
    // Load messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    if (selectedContact) {
      setMessages(storedMessages[selectedContact.id] || []);
    }
  }, [selectedContact]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date(),
      read: false,
      contactId: selectedContact.id
    };

    const updatedMessages = [...messages, newMessage];
    setMessages((prev) => {
      const updated = [...prev, newMessage];

      const allMessages = JSON.parse(
        localStorage.getItem('chatMessages') || '{}'
      );

      if (selectedContact) {
        allMessages[selectedContact.id] = updated;
      }

      localStorage.setItem(
        'chatMessages',
        JSON.stringify(allMessages)
      );

      return updated;
    });

    // Save to localStorage
    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    allMessages[selectedContact.id] = updatedMessages;
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));

    setInputMessage('');

    // Simulate contact response after 2 seconds
    setTimeout(() => {
      // Generate contextual response based on message content
      let responseText = "Got it! Stay safe! 👍";
      const lowerContent = content.toLowerCase();
      
      if (lowerContent.includes('arrived')) {
        responseText = "Thank goodness you arrived safely";
      } else if (lowerContent.includes('safe')) {
        responseText = "Glad you're safe";
      } else if (lowerContent.includes('help') || lowerContent.includes('need')) {
        responseText = "On my way! Calling you now";
      } else if (lowerContent.includes('uncomfortable') || lowerContent.includes('situation')) {
        responseText = "Stay alert! Do you need me to call you?";
      } else if (lowerContent.includes('location') || lowerContent.includes('sharing')) {
        responseText = "Got your location! I'm tracking you now";
      } else if (lowerContent.includes('late') || lowerContent.includes('delayed')) {
        responseText = "No worries! Just stay safe and keep me updated";
      }
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'contact',
        content: responseText,
        timestamp: new Date(),
        read: true,
        contactId: selectedContact.id
      };

      const newUpdatedMessages = [...updatedMessages, responseMessage];
      setMessages(newUpdatedMessages);

      const allMessagesUpdate = JSON.parse(localStorage.getItem('chatMessages') || '{}');
      allMessagesUpdate[selectedContact.id] = newUpdatedMessages;
      localStorage.setItem('chatMessages', JSON.stringify(allMessagesUpdate));
    }, 2000);
  };

  const sendQuickMessage = (template: string) => {
    sendMessage(template);
  };

  const sendVoiceMessage = (text: string, duration: number) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
      read: false,
      contactId: selectedContact.id,
      isVoice: true,
      voiceDuration: duration
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Save to localStorage
    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    allMessages[selectedContact.id] = updatedMessages;
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));

    // Play the voice message using text-to-speech
    speakText(text);

    // Simulate contact response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'contact',
        content: "Received your voice message! 🎤",
        timestamp: new Date(),
        read: true,
        contactId: selectedContact.id
      };

      const newUpdatedMessages = [...updatedMessages, responseMessage];
      setMessages(newUpdatedMessages);

      const allMessagesUpdate = JSON.parse(localStorage.getItem('chatMessages') || '{}');
      allMessagesUpdate[selectedContact.id] = newUpdatedMessages;
      localStorage.setItem('chatMessages', JSON.stringify(allMessagesUpdate));
    }, 3000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playVoiceMessage = (
    messageId: string,
    audioUrl?: string
  ) => {
    if (!audioUrl) return;

    if (playingMessageId === messageId) {
      audioRef.current?.pause();
      setPlayingMessageId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);

    audioRef.current = audio;

    setPlayingMessageId(messageId);

    audio.play();

    audio.onended = () => {
      setPlayingMessageId(null);
    };
  };

  const simulateRecording = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const duration = Math.max(
            1,
            Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
          );

          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          const audioUrl = URL.createObjectURL(audioBlob);

          const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content: 'Voice message',
            timestamp: new Date(),
            read: false,
            contactId: selectedContact?.id,
            isVoice: true,
            voiceDuration: duration,
            audioUrl,
          };

          const updatedMessages = [...messages, newMessage];
          setMessages(updatedMessages);

          const allMessages = JSON.parse(
            localStorage.getItem('chatMessages') || '{}'
          );

          if (selectedContact) {
            allMessages[selectedContact.id] = updatedMessages;
          }

          localStorage.setItem(
            'chatMessages',
            JSON.stringify(allMessages)
          );

          stream.getTracks().forEach((track) => track.stop());
        };
        
        recordingStartTimeRef.current = Date.now();
        mediaRecorder.start();
        setIsRecording(true);
      } else {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Recording failed:', error);
      alert('Microphone access denied');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (contacts.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 inline-flex p-4 bg-gray-100 rounded-full">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold mb-2">No Trusted Contacts</h3>
        <p className="text-gray-600 mb-4">
          Add trusted contacts in the Live Location feature to start chatting with them.
        </p>
        <Badge variant="outline" className="text-xs">
          💡 Tip: Contacts added in any feature are available for chat
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(85vh-120px)]">
      {/* Contacts List or Chat View */}
      {!selectedContact ? (
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Select a Contact to Chat
            </h3>
          </div>
          <div className="space-y-2">
            {contacts.map((contact) => {
              const initials = contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              
              const colors = [
                'bg-blue-500',
                'bg-purple-500',
                'bg-green-500',
                'bg-orange-500',
                'bg-pink-500',
                'bg-indigo-500'
              ];
              const colorIndex = contact.name.charCodeAt(0) % colors.length;

              return (
                <Card
                  key={contact.id}
                  className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-blue-300"
                  onClick={() => setSelectedContact(contact)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className={`${colors[colorIndex]} w-12 h-12`}>
                        <AvatarFallback className="text-white font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-xs text-gray-600">{contact.relation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{contact.phone}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          Chat
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b px-1 pb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedContact(null)}
              className="mb-3 hover:bg-gray-100 rounded-full"
            >
              ← Back
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="bg-gradient-to-br from-blue-500 to-purple-500 w-12 h-12 shadow-lg">
                  <AvatarFallback className="text-white font-bold">
                    {selectedContact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-bold text-base">
                    {selectedContact.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-500">
                      Online now
                    </p>
                  </div>
                </div>
              </div>

              <Badge className="bg-green-100 text-green-700 border border-green-300">
                Trusted
              </Badge>
            </div>
          </div>

          {/* Quick Message Templates */}
          <div className="py-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-semibold text-gray-600">Quick Messages</h4>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-hide">
                {quickTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    className={`
                      text-[11px]
                      whitespace-nowrap
                      rounded-full
                      px-3
                      py-1.5
                      h-auto
                      border
                      shadow-sm
                      transition-all
                      hover:scale-105
                      ${template.color}
                    `}
                    onClick={() => sendQuickMessage(template.text)}
                  >
                    <span className="mr-1">{template.icon}</span>
                    {template.text}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Voice Message Templates */}
          <div className="py-3 border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-2 mb-2 px-3">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-semibold text-gray-600">Voice Templates</h4>
              <Badge variant="secondary" className="text-xs">Text-to-Speech</Badge>
            </div>
            <ScrollArea className="w-full px-3">
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                {voiceTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    className={`
                      min-w-[140px] sm:min-w-[180px]
                      rounded-2xl
                      px-3
                      py-3
                      border
                      shadow-sm
                      flex items-center gap-2
                      transition-all
                      hover:scale-[1.02]
                      active:scale-95
                      ${template.color}
                    `}
                    onClick={() => sendVoiceMessage(template.text, template.duration)}
                  >
                    {template.icon}
                    <div className="text-left">
                      <p className="text-xs font-semibold">
                        Voice Message
                      </p>

                      <p className="text-[10px] opacity-90 line-clamp-1">
                        {template.text}
                      </p>
                    </div>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className={`
                    min-w-[180px]
                    rounded-2xl
                    px-3
                    py-3
                    border
                    shadow-sm
                    flex items-center gap-2
                    transition-all
                    hover:scale-[1.02]
                    active:scale-95
                    ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }
                  `}
                  onClick={simulateRecording}
                  disabled={!selectedContact}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <div className="text-left">
                    <p className="text-xs font-semibold">
                      {isRecording ? 'Recording...' : 'Custom Voice'}
                    </p>

                    <p className="text-[10px] opacity-90">
                      Tap to record audio
                    </p>
                  </div>
                </Button>
              </div>
            </ScrollArea>
          </div>

          {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto py-3 px-2 sm:px-3 bg-gradient-to-b from-slate-50 via-white to-slate-100"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)
                `,
                backgroundSize: '20px 20px'
              }}
            >
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex p-3 bg-gray-100 rounded-full mb-2">
                  <MessageSquare className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.isVoice ? (
                    // Voice Message
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-sm'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-tl-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-10 w-10 ${
                            message.sender === 'user'
                              ? 'bg-white/20 hover:bg-white/30 text-white rounded-full'
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full'
                          }`}
                          onClick={() =>
                            playVoiceMessage(message.id, message.audioUrl)
                          }
                        >
                          {playingMessageId === message.id ? (
                            <Square className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Volume2 className="w-4 h-4" />
                            <span className="text-xs font-semibold">Voice Message</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {[8,14,10,18,6,12,16,9,15,7,13,5,17,8].map((height, i) => (
                              <div
                                key={i}
                                className="w-1 bg-white/70 rounded-full"
                                style={{
                                  height: `${height}px`
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                              {playingMessageId === message.id && (
                                <div className="h-full bg-white animate-pulse w-full"></div>
                              )}
                            </div>
                            <span className="text-xs">{message.voiceDuration}s</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 mt-2 text-xs ${
                        message.sender === 'user' ? 'text-white/70 justify-end' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && (
                          <CheckCheck className="w-3 h-3 ml-1" />
                        )}
                      </div>
                    </div>
                  ) : (
                    // Text Message
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 ${
                        message.sender === 'user'
                          ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-sm shadow-sm'
                          : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200 shadow-sm'
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed break-words">
                        {message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        message.sender === 'user' ? 'text-blue-100 justify-end' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && (
                          <CheckCheck className="w-3 h-3 ml-1" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="pt-3 border-t bg-white/80 backdrop-blur-md sticky bottom-0">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-2 h-11 sm:h-12 px-4 shadow-sm text-sm"
              />
              <Button
                onClick={() => sendMessage(inputMessage)}
                className="bg-blue-500 hover:bg-blue-600 rounded-full w-11 h-11 sm:w-12 sm:h-12 shadow-lg flex-shrink-0"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <User className="w-3 h-3" />
              Messages are stored locally on your device
            </p>
          </div>
        </div>
      )}
    </div>
  );
}