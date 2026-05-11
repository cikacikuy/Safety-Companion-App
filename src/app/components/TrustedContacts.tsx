import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Plus, Trash2, Users, UserCheck, Shield, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
}

interface TrustedContactsProps {
  userName: string;
  userPhone: string;
}

export function TrustedContacts({ userName }: TrustedContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');

  // Avatar colors for contacts
  const avatarColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ];

  const relationOptions = [
    'Family',
    'Friend',
    'Spouse',
    'Parent',
    'Sibling',
    'Colleague',
    'Neighbor',
    'Other'
  ];

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

  const addContact = () => {
    if (newContactName.trim() && newContactPhone.trim() && newContactRelation) {
      const colorIndex = contacts.length % avatarColors.length;
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newContactName,
        phone: newContactPhone,
        relation: newContactRelation,
        avatar: avatarColors[colorIndex]
      };
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      localStorage.setItem('safetyContacts', JSON.stringify(updatedContacts));
      setNewContactName('');
      setNewContactPhone('');
      setNewContactRelation('');
      toast.success(`${newContactName} added as trusted contact`, {
        description: 'They can now receive your safety updates'
      });
    } else {
      toast.error('Please fill in all fields', {
        description: 'Name, phone, and relationship are required'
      });
    }
  };

  const removeContact = (id: string, name: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem('safetyContacts', JSON.stringify(updatedContacts));
    toast.success(`${name} removed from trusted contacts`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 mb-1">Trusted Contacts</h4>
            <p className="text-sm text-blue-800">
              Add people who can receive your location, emergency alerts, and safety messages. These contacts are available across all safety features.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-blue-500 rounded-xl inline-flex mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-blue-700 mb-1">Total Contacts</p>
            <p className="text-2xl font-bold text-blue-900">{contacts.length}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-green-500 rounded-xl inline-flex mb-2">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-green-700 mb-1">Safety Network</p>
            <p className="text-2xl font-bold text-green-900">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Contact Form */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-300">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-purple-600" />
          <h5 className="font-bold text-purple-900">Add New Trusted Contact</h5>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="contactName" className="text-sm font-semibold flex items-center gap-1">
              <UserCheck className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="contactName"
              placeholder="Enter full name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              className="mt-1 h-11"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" className="text-sm font-semibold flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="Enter phone number"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              className="mt-1 h-11"
            />
          </div>
          <div>
            <Label htmlFor="contactRelation" className="text-sm font-semibold flex items-center gap-1">
              <Users className="w-4 h-4" />
              Relationship
            </Label>
            <Select value={newContactRelation} onValueChange={setNewContactRelation}>
              <SelectTrigger className="mt-1 h-11">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationOptions.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={addContact} 
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Trusted Contact
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-lg">Your Trusted Contacts</h4>
            <Badge variant="secondary" className="text-xs">{contacts.length}</Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-base text-gray-700 font-semibold mb-2">No trusted contacts yet</p>
              <p className="text-sm text-gray-500 mb-4">Add your first trusted contact to get started</p>
              <Badge variant="outline" className="text-xs">
                💡 Tip: Add family members or close friends first
              </Badge>
            </div>
          ) : (
            contacts.map((contact, index) => (
              <Card
                key={contact.id}
                className="border-2 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className={`h-14 w-14 ${contact.avatar}`}>
                        <AvatarFallback className="text-white font-bold text-lg">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border-2 border-white">
                        <Badge className={`text-xs px-1.5 py-0 h-5 ${contact.avatar}`}>
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base">{contact.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {contact.relation}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(contact.id, contact.name)}
                      className="hover:bg-red-50 h-10 w-10"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <Shield className="w-5 h-5 text-yellow-900" />
          </div>
          <div>
            <p className="font-bold text-yellow-900 mb-1">💡 Privacy & Security</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Contacts are stored locally on your device</li>
              <li>• They will be notified when you share location or send alerts</li>
              <li>• Choose people you trust who can respond to emergencies</li>
              <li>• You can add or remove contacts anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
