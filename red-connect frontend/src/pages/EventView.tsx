import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type EventType = {
  id: number;
  title: string;
  description?: string;
  start_datetime?: string;
  end_datetime?: string;
  location?: string;
  organizer_name?: string;
  capacity?: number;
  registered_count?: number;
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
      const res = await api.registerForEvent(Number(id));
      toast({ title: "Registered", description: res?.message || "Successfully registered" });
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

  const isFull = typeof event.capacity === "number" && typeof event.registered_count === "number" && event.registered_count >= event.capacity;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{event.title}</h1>
      <p className="text-sm text-muted-foreground mb-4">{event.organizer_name || "Organizer"}</p>
      <div className="prose mb-4" dangerouslySetInnerHTML={{ __html: event.description || "" }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <strong>When</strong>
          <div>{event.start_datetime ? new Date(event.start_datetime).toLocaleString() : "N/A"}</div>
          <div>{event.end_datetime ? new Date(event.end_datetime).toLocaleString() : null}</div>
        </div>
        <div>
          <strong>Where</strong>
          <div>{event.location || "TBA"}</div>
          <div>
            <strong>Capacity:</strong> {event.capacity ?? "—"}
          </div>
          <div>
            <strong>Registered:</strong> {event.registered_count ?? 0}
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
