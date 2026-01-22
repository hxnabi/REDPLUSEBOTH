import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";
import { Calendar, Clock, MapPin, Users, Building2, ArrowRight, Droplet, Sparkles } from "lucide-react";

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

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const pageSize = 100; // backend max is 100
        let allEvents: EventType[] = [];
        let skip = 0;

        while (true) {
          const chunk: EventType[] = await api.getEvents({ skip, limit: pageSize });
          if (!chunk || chunk.length === 0) break;
          allEvents = allEvents.concat(chunk);
          if (chunk.length < pageSize) break;
          skip += pageSize;
        }

        setEvents(allEvents);
      } catch (err: any) {
        toast({ title: "Failed to load events", description: err?.message || "Error", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleJoin = async (eventId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast({ title: "Login required", description: "Please log in to join events", variant: "destructive" });
      navigate("/donor-login");
      return;
    }

    setJoiningId(eventId);
    try {
      const res = await api.registerForEvent(eventId);
      toast({ title: "Registered", description: res?.message || "Successfully registered" });
      // refresh single event data
      const updated = await api.getEvent(eventId);
      setEvents((prev) => prev.map((ev) => (ev.id === eventId ? updated : ev)));
    } catch (err: any) {
      toast({ title: "Registration failed", description: err?.message || "Could not register", variant: "destructive" });
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-gray-600">Loading amazing events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#C8102E] to-[#a00d25] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Join Our Life-Saving Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blood Donation Events
            </h1>
            <p className="text-xl text-red-100 mb-6">
              Find events near you and make a difference. Every donation saves up to 3 lives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{events.length} Events Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5" />
                <span>Safe & Professional</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-12">
        {events.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-[#C8102E]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-600 mb-6">
                Check back soon for upcoming blood donation events in your area.
              </p>
              <Button onClick={() => navigate("/home")} className="bg-[#C8102E] hover:bg-[#a00d25]">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {events.map((ev) => {
              const isFull = typeof ev.max_participants === "number" && typeof ev.registered_participants === "number" && ev.registered_participants >= ev.max_participants;
              const remaining = (ev.max_participants || 0) - (ev.registered_participants || 0);
              const percentFilled = ev.max_participants ? ((ev.registered_participants || 0) / ev.max_participants) * 100 : 0;

              return (
                <Card 
                  key={ev.id} 
                  className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white"
                >
                  {/* Card Header with Gradient */}
                  <div className="relative bg-gradient-to-br from-[#C8102E] to-[#a00d25] p-6 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <Badge 
                          variant={isFull ? "destructive" : "secondary"} 
                          className={`${isFull ? "bg-red-900" : "bg-green-500"} text-white`}
                        >
                          {isFull ? "Event Full" : `${remaining} Slots Left`}
                        </Badge>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:scale-105 transition-transform">
                        {ev.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-red-100">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{ev.organizer_name || "Organizer"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6">
                      {/* Date */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-[#C8102E]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {ev.event_date 
                              ? new Date(ev.event_date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              : "To Be Announced"}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {ev.start_time ? formatTimeTo12Hour(ev.start_time) : "TBA"}
                            {ev.end_time ? ` - ${formatTimeTo12Hour(ev.end_time)}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {ev.venue || "Location TBA"}
                          </p>
                        </div>
                      </div>

                      {/* Participants Progress */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase">Participants</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {ev.registered_participants || 0} / {ev.max_participants || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden border border-gray-400">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentFilled > 0 ? Math.min(percentFilled, 100) : 0}%`,
                              minWidth: percentFilled > 0 ? '3%' : '0%',
                              backgroundColor: percentFilled >= 90 ? "#ef4444" : percentFilled >= 70 ? "#f97316" : "#22c55e"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link to={`/events/${ev.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-gray-200 hover:border-[#C8102E] hover:text-[#C8102E] group/btn"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleJoin(ev.id)} 
                        disabled={isFull || joiningId === ev.id}
                        className={`flex-1 ${
                          isFull 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-[#C8102E] hover:bg-[#a00d25]"
                        } text-white font-semibold`}
                      >
                        {isFull ? "Event Full" : joiningId === ev.id ? "Joining..." : "Join Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
