import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  ArrowLeft, 
  Share2, 
  Heart,
  CheckCircle2,
  AlertCircle,
  Info,
  Droplet
} from "lucide-react";

type EventType = {
  id: number;
  title: string;
  description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  organizer_name?: string;
  max_participants?: number;
  registered_participants?: number;
};

const EventView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await api.getEvent(Number(id));
        setEvent(data);
      } catch (err: any) {
        toast({ title: "Failed to load event", description: err?.message || "Error", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!id) return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast({ title: "Not logged in", description: "Please login to join this event", variant: "destructive" });
      navigate("/donor-login");
      return;
    }

    setJoining(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to register");
      }

      toast({ 
        title: "Registration Successful!", 
        description: `You have been registered for ${event.title}. ${data.remaining_slots !== null ? `Remaining slots: ${data.remaining_slots}` : ''}` 
      });
      
      // Refresh event data
      const updated = await api.getEvent(Number(id));
      setEvent(updated);
    } catch (err: any) {
      toast({ title: "Registration failed", description: err?.message || "Could not register", variant: "destructive" });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-[#C8102E]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h3>
              <p className="text-gray-600 mb-6">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/events")} className="bg-[#C8102E] hover:bg-[#a00d25]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isFull = typeof event.max_participants === "number" && typeof event.registered_participants === "number" && event.registered_participants >= event.max_participants;
  const remaining = Math.max(0, (event.max_participants || 0) - (event.registered_participants || 0));
  const percentFilled = (event.max_participants && event.max_participants > 0) 
    ? ((event.registered_participants || 0) / event.max_participants) * 100 
    : 0;
  
  console.log('Event Progress:', {
    registered: event.registered_participants,
    max: event.max_participants,
    percentFilled,
    remaining
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/events")}
            className="text-gray-600 hover:text-[#C8102E]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          {localStorage.getItem("access_token") && localStorage.getItem("user_role") === "donor" && (
            <Button 
              variant="outline" 
              onClick={() => navigate("/donor-dashboard")}
              className="text-[#C8102E] border-[#C8102E] hover:bg-[#C8102E] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#C8102E] to-[#a00d25] text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Badge 
                variant={isFull ? "destructive" : "secondary"} 
                className={`${isFull ? "bg-red-900" : "bg-green-500"} text-white text-sm px-4 py-2`}
              >
                {isFull ? "Event Full" : `${remaining} Slots Available`}
              </Badge>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Droplet className="w-4 h-4" />
                <span className="text-sm">Blood Donation</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {event.title}
            </h1>

            {/* Organizer */}
            <div className="flex items-center gap-3 text-red-100">
              <Building2 className="w-5 h-5" />
              <span className="text-lg">Organized by {event.organizer_name || "Community Organizer"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#C8102E]" />
                    About This Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {event.description ? (
                    <div 
                      className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  ) : (
                    <p className="text-gray-600 italic">
                      Join us for this life-saving blood donation event. Your contribution can save up to 3 lives!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Event Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C8102E]" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-[#C8102E]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase mb-1">Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {event.event_date 
                            ? new Date(event.event_date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })
                            : "To Be Announced"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase mb-1">Time</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {event.start_time ? formatTimeTo12Hour(event.start_time) : "TBA"}
                          {event.end_time ? ` - ${formatTimeTo12Hour(event.end_time)}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 uppercase mb-1">Location</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {event.venue || "Location To Be Announced"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Bring */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    What to Bring
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Valid ID proof (Aadhar Card, Driving License, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Be well-rested and have eaten before donation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Minimum age: 18 years, Maximum age: 65 years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Minimum weight: 50 kg</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Registration Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-2 border-[#C8102E]/20">
                  <CardHeader className="bg-gradient-to-br from-red-50 to-white">
                    <CardTitle className="flex items-center gap-2 text-[#C8102E]">
                      <Users className="w-5 h-5" />
                      Registration Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Participants Info */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Participants</span>
                        <span className="text-lg font-bold text-gray-900">
                          {event.registered_participants || 0} / {event.max_participants || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden mb-2 border border-gray-400">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentFilled > 0 ? Math.min(percentFilled, 100) : 0}%`,
                            minWidth: percentFilled > 0 ? '3%' : '0%',
                            backgroundColor: percentFilled >= 90 ? "#ef4444" : percentFilled >= 70 ? "#f97316" : "#22c55e"
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {isFull ? "This event is full" : `${remaining} slot${remaining !== 1 ? 's' : ''} remaining`}
                      </p>
                    </div>

                    <Separator />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#C8102E]">{event.registered_participants || 0}</p>
                        <p className="text-xs text-gray-600">Registered</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{remaining > 0 ? remaining : 0}</p>
                        <p className="text-xs text-gray-600">Available</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        onClick={handleJoin} 
                        disabled={joining || isFull}
                        className={`w-full py-6 text-lg font-semibold ${
                          isFull 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-[#C8102E] hover:bg-[#a00d25]"
                        } text-white`}
                      >
                        {isFull ? (
                          <>
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Event Full
                          </>
                        ) : joining ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 mr-2" />
                            Join This Event
                          </>
                        )}
                      </Button>

                      <Button 
                        variant="outline" 
                        className="w-full border-2"
                        onClick={() => {
                          navigator.share?.({ 
                            title: event.title, 
                            text: event.description,
                            url: window.location.href 
                          });
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Event
                      </Button>
                    </div>

                    {/* Help Text */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> You must be logged in as a donor to register for this event.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;
