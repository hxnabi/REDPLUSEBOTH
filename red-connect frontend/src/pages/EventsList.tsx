import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  if (loading) return <div className="p-6">Loading events...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-display font-bold mb-6">Events</h1>

      {events.length === 0 ? (
        <div className="p-8 bg-card rounded-lg">No events available.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((ev) => {
            const isFull = typeof ev.capacity === "number" && typeof ev.registered_count === "number" && ev.registered_count >= ev.capacity;
            return (
              <div key={ev.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">{ev.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{ev.organizer_name || "Organizer"}</p>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        <strong className="text-primary">Date:</strong> {ev.start_datetime ? new Date(ev.start_datetime).toLocaleString() : "TBA"}
                      </div>
                      <div>
                        <strong className="text-primary">Location:</strong> {ev.location || "TBA"}
                      </div>
                    </div>
                  </div>

                  <div className="w-40 flex-shrink-0 flex flex-col items-end">
                    <div className="mb-auto text-sm text-muted-foreground">&nbsp;</div>
                    <div className="flex flex-col items-end gap-3">
                      <Link to={`/events/${ev.id}`}>
                        <Button variant="outline" className="px-4">View</Button>
                      </Link>
                      <Button onClick={() => handleJoin(ev.id)} disabled={isFull || joiningId === ev.id} className="px-4 bg-primary text-white">
                        {isFull ? "Full" : joiningId === ev.id ? "Joining..." : "Join"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsList;
