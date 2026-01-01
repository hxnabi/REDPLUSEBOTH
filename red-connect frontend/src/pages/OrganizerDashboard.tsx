import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Plus, Users, LogOut, User, Settings, MapPin, Clock, Users2, Edit, Trash2, X, AlertTriangle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import OrganizerCertificatesManagement from "@/components/OrganizerCertificatesManagement";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API_URL = "http://127.0.0.1:8000";

interface OrganizerProfile {
  organization_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registration_number: string;
  website: string;
  description: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  city: string;
  state: string;
  max_participants: number;
  registered_participants: number;
  status: string;
  created_at: string;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  city: string;
  state: string;
  max_participants: string;
}

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventCreating, setEventCreating] = useState(false);
  const [eventUpdating, setEventUpdating] = useState(false);
  const [eventDeleting, setEventDeleting] = useState(false);
  const [profile, setProfile] = useState<OrganizerProfile>({
    organization_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    registration_number: "",
    website: "",
    description: "",
  });
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    city: "",
    state: "",
    max_participants: "",
  });

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/organizer-login");
      return;
    }
    fetchOrganizerProfile();
    fetchMyEvents();
  }, []);

  // Fetch organizer profile from API
  const fetchOrganizerProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/organizers/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load profile";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile input changes
  const handleInputChange = (field: keyof OrganizerProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Save organizer profile to API
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/organizers/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save profile";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/");
  };

  // Fetch organizer events
  const fetchMyEvents = async () => {
    try {
      setEventLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/events/my-events`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load events";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setEventLoading(false);
    }
  };

  // Handle event form input change
  const handleEventInputChange = (field: keyof EventFormData, value: string) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
  };

  // Create event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.event_date || !eventForm.venue || !eventForm.city || !eventForm.state) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setEventCreating(true);
      const token = localStorage.getItem("access_token");
      const eventPayload = {
        ...eventForm,
        max_participants: parseInt(eventForm.max_participants) || 100,
      };

      const response = await fetch(`${API_URL}/api/events/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to create event: ${response.status}`);
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setEventForm({
        title: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        venue: "",
        city: "",
        state: "",
        max_participants: "",
      });
      setShowCreateEvent(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create event";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setEventCreating(false);
    }
  };

  // Update event
  const handleUpdateEvent = async (eventId: number) => {
    if (!eventForm.title || !eventForm.event_date || !eventForm.venue || !eventForm.city || !eventForm.state) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setEventUpdating(true);
      const token = localStorage.getItem("access_token");
      const eventPayload = {
        ...eventForm,
        max_participants: parseInt(eventForm.max_participants) || 100,
      };

      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update event: ${response.status}`);
      }

      const updatedEvent = await response.json();
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
      setEditingEventId(null);
      setEventForm({
        title: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        venue: "",
        city: "",
        state: "",
        max_participants: "",
      });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update event";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setEventUpdating(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: number) => {
    try {
      setDeletingEventId(eventId);
      setEventDeleting(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to delete event: ${response.status}`);
      }

      setEvents(events.filter(e => e.id !== eventId));
      setDeletingEventId(null);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete event";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setEventDeleting(false);
    }
  };

  // Load event data for editing
  const handleEditClick = (event: Event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      venue: event.venue,
      city: event.city,
      state: event.state,
      max_participants: event.max_participants.toString(),
    });
    setShowCreateEvent(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <p className="text-muted-foreground">Loading organizer profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="border-b border-border bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">+</span>
              </div>
              <span className="font-display font-bold text-lg text-primary">RED</span>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Organization Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`pb-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "events"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Events
              </div>
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`pb-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "certificates"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certificates
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8">Organization Profile</h2>
            <div className="bg-card rounded-2xl shadow-soft p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Organization Name</Label>
                  <Input
                    value={profile.organization_name}
                    onChange={(e) => handleInputChange("organization_name", e.target.value)}
                    placeholder="Your organization name"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Contact Person</Label>
                  <Input
                    value={profile.contact_person}
                    onChange={(e) => handleInputChange("contact_person", e.target.value)}
                    placeholder="Full name of contact person"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled
                    className="rounded-lg bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Address</Label>
                <Textarea
                  value={profile.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address"
                  className="rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">City</Label>
                  <Input
                    value={profile.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">State</Label>
                  <Input
                    value={profile.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Pincode</Label>
                  <Input
                    value={profile.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="Pincode"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Registration Number</Label>
                  <Input
                    value={profile.registration_number}
                    onChange={(e) => handleInputChange("registration_number", e.target.value)}
                    placeholder="Org. registration number"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Website</Label>
                  <Input
                    value={profile.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Description</Label>
                <Textarea
                  value={profile.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tell us about your organization"
                  className="rounded-lg"
                />
              </div>

              <Button 
                variant="green" 
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">Manage Events</h2>
              <Button variant="green" onClick={() => setShowCreateEvent(!showCreateEvent)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </div>

            {/* Create/Edit Event Form */}
            {showCreateEvent && (
              <div className="bg-card rounded-2xl shadow-soft p-8 mb-8">
                <h3 className="text-xl font-display font-bold mb-6">
                  {editingEventId ? "Edit Event" : "Create New Event"}
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (editingEventId) {
                    handleUpdateEvent(editingEventId);
                  } else {
                    handleCreateEvent(e as any);
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Event Title *</Label>
                      <Input
                        value={eventForm.title}
                        onChange={(e) => handleEventInputChange("title", e.target.value)}
                        placeholder="e.g., Blood Donation Camp 2025"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Event Date *</Label>
                      <Input
                        type="date"
                        value={eventForm.event_date}
                        onChange={(e) => handleEventInputChange("event_date", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => handleEventInputChange("description", e.target.value)}
                      placeholder="Tell donors about your event..."
                      className="rounded-lg min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Start Time</Label>
                      <Input
                        type="time"
                        value={eventForm.start_time}
                        onChange={(e) => handleEventInputChange("start_time", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">End Time</Label>
                      <Input
                        type="time"
                        value={eventForm.end_time}
                        onChange={(e) => handleEventInputChange("end_time", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Venue Name *</Label>
                      <Input
                        value={eventForm.venue}
                        onChange={(e) => handleEventInputChange("venue", e.target.value)}
                        placeholder="e.g., Community Center"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Max Participants</Label>
                      <Input
                        type="number"
                        value={eventForm.max_participants}
                        onChange={(e) => handleEventInputChange("max_participants", e.target.value)}
                        placeholder="100"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">City *</Label>
                      <Input
                        value={eventForm.city}
                        onChange={(e) => handleEventInputChange("city", e.target.value)}
                        placeholder="City"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">State *</Label>
                      <Input
                        value={eventForm.state}
                        onChange={(e) => handleEventInputChange("state", e.target.value)}
                        placeholder="State"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => {
                      setShowCreateEvent(false);
                      setEditingEventId(null);
                      setEventForm({
                        title: "",
                        description: "",
                        event_date: "",
                        start_time: "",
                        end_time: "",
                        venue: "",
                        city: "",
                        state: "",
                        max_participants: "",
                      });
                    }} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" variant="green" disabled={eventCreating || eventUpdating} className="flex-1">
                      {editingEventId ? (eventUpdating ? "Updating..." : "Update Event") : (eventCreating ? "Creating..." : "Create Event")}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Events List */}
            {eventLoading ? (
              <div className="bg-card rounded-2xl shadow-soft p-8 text-center">
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-card rounded-2xl shadow-soft p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No events created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3"></div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          {event.start_time} - {event.end_time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          {event.venue}, {event.city}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users2 className="w-4 h-4 text-primary" />
                          {event.registered_participants} / {event.max_participants} registered
                        </div>
                      </div>

                      <div className="bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all" 
                          style={{ width: `${(event.registered_participants / event.max_participants) * 100}%` }}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(event)}
                          className="flex-1 gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setDeletingEventId(event.id);
                            setDeleteConfirmOpen(true);
                          }}
                          disabled={eventDeleting && deletingEventId === event.id}
                          className="flex-1 gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {eventDeleting && deletingEventId === event.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete event?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The event will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  if (deletingEventId) {
                    handleDeleteEvent(deletingEventId);
                  }
                  setDeleteConfirmOpen(false);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8">Settings</h2>
            <div className="bg-card rounded-2xl shadow-soft p-8">
              <div className="space-y-6">
                <div className="pb-6 border-b border-border">
                  <h3 className="font-medium text-lg mb-2">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account preferences</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your password regularly</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-8">Certificate Management</h2>
            <OrganizerCertificatesManagement />
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerDashboard;
