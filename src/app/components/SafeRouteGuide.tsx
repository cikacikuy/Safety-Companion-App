import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { MapPin, Navigation, Sun, Users, Shield, Clock, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Route {
  id: string;
  name: string;
  distance: string;
  duration: string;
  safetyScore: number;
  features: string[];
}

interface SafeRouteGuideProps {
  userName: string;
  userPhone: string;
}

export function SafeRouteGuide({ }: SafeRouteGuideProps) {
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const findRoutes = () => {
    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    setIsSearching(true);
    
    // Simulate route finding
    setTimeout(() => {
      const mockRoutes: Route[] = [
        {
          id: '1',
          name: 'via Jl. H. Usmar Ismail',
          distance: '1.1 km',
          duration: '15 min',
          safetyScore: 95,
          features: ['Well-lit streets', 'High foot traffic', 'Security cameras', 'Police station nearby']
        },
        {
          id: '2',
          name: 'via Jl. Douwes Dekker',
          distance: '1.2 km',
          duration: '16 min',
          safetyScore: 88,
          features: ['Well-lit', 'Busy route', '24/7 businesses']
        },
      ];
      
      setRoutes(mockRoutes);
      setIsSearching(false);
      toast.success('Routes found!', {
        description: `${mockRoutes.length} safe routes available`
      });
    }, 1500);
  };

  const selectRoute = (route: Route) => {
    toast.success(`Navigating via ${route.name}`, {
      description: 'Route guidance started'
    });
  };

  const getSafetyColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getSafetyBadge = (score: number) => {
    if (score >= 85) return { text: 'Very Safe', color: 'bg-green-500' };
    if (score >= 70) return { text: 'Safe', color: 'bg-yellow-500' };
    return { text: 'Caution', color: 'bg-orange-500' };
  };

  const getSafetyIcon = (score: number) => {
    if (score >= 85) return <Shield className="w-4 h-4" />;
    if (score >= 70) return <Shield className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="destination" className="text-sm font-semibold">Where are you going?</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="destination"
              placeholder="Enter destination address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && findRoutes()}
              className="h-12"
            />
            <Button onClick={findRoutes} disabled={isSearching} className="h-12 px-6">
              {isSearching ? (
                'Searching...'
              ) : (
                <>
                  <Navigation className="w-5 h-5 mr-2" />
                  Find
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Current Location</h4>
            <p className="text-sm text-blue-800">PUCC, President University</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-blue-700 font-medium">Updated just now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Routes */}
      {routes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-600" />
            <h4 className="font-bold text-lg">Recommended Safe Routes</h4>
          </div>
          <div className="space-y-4">
            {routes.map((route, index) => {
              const safetyBadge = getSafetyBadge(route.safetyScore);
              return (
                <div
                  key={route.id}
                  className={`border-2 rounded-2xl p-5 hover:shadow-xl transition-all ${
                    index === 0 ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-lg">{route.name}</h5>
                        {index === 0 && <Badge className="bg-green-500">Recommended</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Navigation className="w-4 h-4" />
                          {route.distance}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-4 h-4" />
                          {route.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Score */}
                  <div className="mb-4 p-4 bg-white rounded-xl border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSafetyIcon(route.safetyScore)}
                        <span className="text-sm font-bold text-gray-700">Safety Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getSafetyColor(route.safetyScore)}`}>
                          {route.safetyScore}%
                        </span>
                        <Badge className={`${safetyBadge.color} text-white`}>
                          {safetyBadge.text}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={route.safetyScore} className="h-2" />
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Safety Features</p>
                    <div className="flex flex-wrap gap-2">
                      {route.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium border border-blue-200"
                        >
                          {feature.includes('lit') && <Sun className="w-3.5 h-3.5" />}
                          {feature.includes('traffic') && <Users className="w-3.5 h-3.5" />}
                          {feature.includes('camera') && <Shield className="w-3.5 h-3.5" />}
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => selectRoute(route)}
                    className={`w-full h-12 font-semibold text-base ${
                      index === 0 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Navigate This Route
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-2">Safety Tips</h4>
            <ul className="space-y-1.5 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Stick to well-lit and crowded areas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Stay aware of your surroundings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Share your route with trusted contacts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Avoid shortcuts through isolated areas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <Star className="w-5 h-5 text-yellow-900" />
          </div>
          <div>
            <p className="font-bold text-yellow-900 mb-1">How Safety Scoring Works</p>
            <p className="text-sm text-yellow-800">
              Routes are analyzed based on lighting conditions, foot traffic density, security camera coverage, and proximity to emergency services. Scores above 85% are considered very safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}