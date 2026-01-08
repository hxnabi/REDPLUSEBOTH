import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatTimeTo12Hour } from "@/lib/utils";

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

  if (loading) return <div className="p-6">Loading event...</div>;
  if (!event) return <div className="p-6">Event not found.</div>;

  const isFull = typeof event.max_participants === "number" && typeof event.registered_participants === "number" && event.registered_participants >= event.max_participants;
  const remaining = (event.max_participants || 0) - (event.registered_participants || 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{event.title}</h1>
      <p className="text-sm text-muted-foreground mb-4">{event.organizer_name || "Organizer"}</p>
      <div className="prose mb-4" dangerouslySetInnerHTML={{ __html: event.description || "" }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <strong>When</strong>
          <div>{event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</div>
          <div className="text-lg font-semibold text-primary">
            {event.start_time ? formatTimeTo12Hour(event.start_time) : "N/A"} 
            {event.end_time ? ` - ${formatTimeTo12Hour(event.end_time)}` : ""}
          </div>
        </div>
        <div>
          <strong>Where</strong>
          <div>{event.venue || "TBA"}</div>
          <div className="mt-3">
            <strong>Capacity:</strong> {event.max_participants ?? "—"}
          </div>
          <div>
            <strong>Registered:</strong> {event.registered_participants ?? 0}
          </div>
          <div className="mt-2">
            <strong>Remaining Slots:</strong> <span className={remaining > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{remaining > 0 ? remaining : "Full"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleJoin} disabled={joining || isFull} variant="default">
          {isFull ? "Full" : joining ? "Joining..." : "Join Event"}
        </Button>
      </div>
    </div>
  );
};

export default EventView;
