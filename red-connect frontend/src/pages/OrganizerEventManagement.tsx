import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Award, CheckCircle, Clock, Users, ArrowLeft } from "lucide-react";

interface Participant {
  donation_id: number;
  donor_name: string;
  blood_type: string;
  status: string;
  donation_date: string;
  has_certificate: boolean;
}

const OrganizerEventManagement = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventData, setEventData] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchEventAndParticipants();
  }, [eventId]);

  const fetchEventAndParticipants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      
      // Fetch event details
      const eventResponse = await fetch(`http://127.0.0.1:8000/api/events/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (eventResponse.ok) {
        const event = await eventResponse.json();
        setEventData(event);
      }

      // Fetch participants
      const participantsResponse = await fetch(`http://127.0.0.1:8000/api/events/${eventId}/participants`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (participantsResponse.ok) {
        const data = await participantsResponse.json();
        setParticipants(data.participants);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async (donationId: number, donorName: string) => {
    setProcessing(donationId);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/events/${eventId}/complete-donation/${donationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to complete donation");
      }

      toast({
        title: "Success!",
        description: `Donation completed for ${donorName}. Certificate issued.`,
      });

      // Refresh participants
      await fetchEventAndParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete donation",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-500">Scheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/organizer-dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Event Management</h1>
          {eventData && (
            <p className="text-muted-foreground text-lg">{eventData.title}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData?.registered_participants || 0}</div>
              <p className="text-xs text-muted-foreground">
                {eventData?.max_participants ? `out of ${eventData.max_participants}` : "No limit"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {participants.filter((p) => p.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Donations completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {participants.filter((p) => p.has_certificate).length}
              </div>
              <p className="text-xs text-muted-foreground">Certificates generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Participants List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Participants</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No participants registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div
                    key={participant.donation_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{participant.donor_name}</h3>
                        {getStatusBadge(participant.status)}
                        {participant.has_certificate && (
                          <Badge variant="outline" className="bg-primary/10">
                            <Award className="w-3 h-3 mr-1" />
                            Certificate Issued
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Blood Type: <strong>{participant.blood_type}</strong></span>
                        <span>Date: {new Date(participant.donation_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      {participant.status.toLowerCase() === "scheduled" && (
                        <Button
                          onClick={() => handleCompleteDonation(participant.donation_id, participant.donor_name)}
                          disabled={processing === participant.donation_id}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {processing === participant.donation_id ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete & Issue Certificate
                            </>
                          )}
                        </Button>
                      )}
                      {participant.status.toLowerCase() === "completed" && (
                        <Button variant="outline" disabled>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizerEventManagement;
