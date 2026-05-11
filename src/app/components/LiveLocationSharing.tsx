import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { MapPin, Share2, Users, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
}

interface LiveLocationSharingProps {
  userName: string;
  userPhone: string;
}

export function LiveLocationSharing({ userName }: LiveLocationSharingProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sharingDuration, setSharingDuration] = useState<number>(0);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem('safetyContacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  useEffect(() => {
  // Demo location - President University
  setLocation({
    lat: -6.2846,
    lng: 107.1687
  });
}, []);

  useEffect(() => {
    // Update sharing duration every second
    let interval: NodeJS.Timeout;
    if (isSharing) {
      interval = setInterval(() => {
        setSharingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setSharingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isSharing]);

  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  const startSharing = () => {
    if (contacts.length === 0) {
      toast.error('No trusted contacts available', {
        description: 'Add contacts in the Trusted Contacts feature first'
      });
      return;
    }
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact', {
        description: 'Choose who should receive your location'
      });
      return;
    }
    if (!location) {
      toast.error('Location not available. Please enable location services.');
      return;
    }
    setIsSharing(true);
    const selectedNames = contacts
      .filter(c => selectedContacts.includes(c.id))
      .map(c => c.name)
      .join(', ');
    toast.success('Location sharing started!', {
      description: `Sharing with: ${selectedNames}`
    });
  };

  const stopSharing = () => {
    setIsSharing(false);
    toast.info('Location sharing stopped');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Current Location */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-blue-900">Current Location</h4>
              {location && <Badge className="bg-blue-500">Live</Badge>}
            </div>
            {location ? (
              <div className="space-y-1">
                <p className="text-sm text-blue-800 font-semibold">
                  President Univeristy, Cikarang
                </p>
                <p className="text-xs text-blue-600 font-mono mt-1">
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <p className="text-xs text-blue-700">Updated just now</p>
              </div>
            ) : (
              <p className="text-sm text-blue-700">Getting your location...</p>
            )}
          </div>
        </div>
      </div>

      {/* Sharing Status */}
      <div className={`p-5 rounded-2xl border-2 ${isSharing ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSharing ? 'bg-green-500' : 'bg-gray-400'}`}>
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">
                {isSharing ? 'Sharing Active' : 'Not Sharing'}
              </span>
              {isSharing && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 font-medium">
                    Broadcasting for {formatDuration(sharingDuration)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {isSharing && selectedContacts.length > 0 && (
          <div className="mb-4 p-3 bg-white/50 rounded-xl">
            <p className="text-xs font-semibold text-green-800 mb-2">Currently sharing with:</p>
            <div className="flex flex-wrap gap-2">
              {contacts
                .filter(c => selectedContacts.includes(c.id))
                .map(contact => (
                  <Badge key={contact.id} className="bg-green-600">
                    {contact.name}
                  </Badge>
                ))}
            </div>
          </div>
        )}
        {isSharing ? (
          <Button variant="destructive" onClick={stopSharing} className="w-full h-12 text-base font-semibold">
            <Share2 className="w-5 h-5 mr-2" />
            Stop Sharing Location
          </Button>
        ) : (
          <Button onClick={startSharing} className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-base font-semibold">
            <Share2 className="w-5 h-5 mr-2" />
            Start Sharing Location
          </Button>
        )}
      </div>

      {/* Select Contacts to Share With */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-lg">Select Recipients</h4>
            <Badge variant="secondary">{selectedContacts.length} of {contacts.length}</Badge>
          </div>
          {contacts.length > 0 && (
            <Button variant="outline" size="sm" onClick={selectAllContacts}>
              {selectedContacts.length === contacts.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
        </div>
        
        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-700 font-semibold mb-2">No trusted contacts available</p>
                <p className="text-xs text-gray-500 mb-4">
                  Add contacts in the Trusted Contacts feature first
                </p>
                <Badge variant="outline" className="text-xs">
                  💡 Go to Trusted Contacts to add people
                </Badge>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact) => {
              const isSelected = selectedContacts.includes(contact.id);
              return (
                <Card
                  key={contact.id}
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleContactSelection(contact.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className={`h-12 w-12 ${contact.avatar}`}>
                          <AvatarFallback className="text-white font-bold text-lg">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                            <UserCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {contact.relation}
                        </Badge>
                      </div>
                      {isSelected && (
                        <Badge className="bg-blue-500">Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <MapPin className="w-5 h-5 text-yellow-900" />
          </div>
          <div>
            <p className="font-bold text-yellow-900 mb-1">💡 How it works</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Select one or more trusted contacts to share with</li>
              <li>• Your real-time GPS location will be continuously shared</li>
              <li>• Selected contacts can track your movement</li>
              <li>• Stop sharing anytime with one tap</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
