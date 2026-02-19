import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Award, CheckCircle, Clock, Users, ArrowLeft, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Participant {
  donation_id: number;
  donor_name: string;
  blood_type: string;
  status: string;
  donation_date: string;
  units: number;
  has_certificate: boolean;
  certificate_id?: number;
  certificate_number?: string;
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
        description: `Donation marked as completed for ${donorName}.`,
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

  const handleIssueCertificate = async (donationId: number, donorName: string) => {
    setProcessing(donationId);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/events/${eventId}/issue-certificate/${donationId}`,
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
        throw new Error(data.detail || "Failed to issue certificate");
      }

      toast({
        title: "Certificate Issued!",
        description: `Certificate issued successfully for ${donorName}.`,
      });

      // Refresh participants
      await fetchEventAndParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to issue certificate",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleDownloadCertificate = async (certificateId: number, donorName: string) => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait...",
      });

      const token = localStorage.getItem("access_token");

      // Download certificate HTML directly using certificate ID
      const response = await fetch(
        `http://127.0.0.1:8000/api/certificates/${certificateId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download certificate");
      }

      const htmlContent = await response.text();

      // Create a temporary div to render the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "0";
      tempDiv.style.top = "0";
      tempDiv.style.zIndex = "-1";
      tempDiv.style.background = "white";
      document.body.appendChild(tempDiv);

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find the certificate element
      const certificateElement = (tempDiv.querySelector('.certificate') as HTMLElement) || tempDiv;

      // Generate canvas from HTML
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // Download PDF
      pdf.save(`Certificate_${donorName.replace(/\s+/g, '_')}_${eventData?.title?.replace(/\s+/g, '_') || 'Event'}.pdf`);

      // Clean up
      document.body.removeChild(tempDiv);

      toast({
        title: "Success",
        description: "Certificate downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download certificate",
        variant: "destructive",
      });
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
        <Card className="mb-6">
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span>Blood Type: <strong>{participant.blood_type}</strong></span>
                        <span>Units: <strong>{participant.units}</strong></span>
                        <span>Date: {new Date(participant.donation_date).toLocaleDateString()}</span>
                        {participant.certificate_number && (
                          <span>Cert: <strong className="text-primary">{participant.certificate_number}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {participant.status.toLowerCase() === "scheduled" && (
                        <Button
                          onClick={() => handleCompleteDonation(participant.donation_id, participant.donor_name)}
                          disabled={processing === participant.donation_id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processing === participant.donation_id ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Completed
                            </>
                          )}
                        </Button>
                      )}
                      {participant.status.toLowerCase() === "completed" && !participant.has_certificate && (
                        <Button
                          onClick={() => handleIssueCertificate(participant.donation_id, participant.donor_name)}
                          disabled={processing === participant.donation_id}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {processing === participant.donation_id ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Issuing...
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4 mr-2" />
                              Issue Certificate
                            </>
                          )}
                        </Button>
                      )}
                      {participant.status.toLowerCase() === "completed" && participant.has_certificate && (
                        <>
                          <Button variant="outline" className="border-green-600 text-green-600" disabled>
                            <Award className="w-4 h-4 mr-2" />
                            Certificate Issued
                          </Button>
                          {participant.certificate_id && (
                            <Button
                              variant="default"
                              onClick={() => handleDownloadCertificate(participant.certificate_id!, participant.donor_name)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Donations - Ready for Certificate */}
        {participants.filter((p) => p.status.toLowerCase() === "completed" && !p.has_certificate).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Completed Donations - Ready for Certificate Issuance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants
                  .filter((p) => p.status.toLowerCase() === "completed" && !p.has_certificate)
                  .map((participant) => (
                    <div
                      key={participant.donation_id}
                      className="flex items-center justify-between p-4 border-2 border-primary/30 rounded-lg bg-primary/5"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{participant.donor_name}</h3>
                          <Badge className="bg-green-500">Donation Completed</Badge>
                          <Badge variant="outline" className="border-orange-500 text-orange-600">
                            Certificate Pending
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span>Blood Type: <strong>{participant.blood_type}</strong></span>
                          <span>Units: <strong>{participant.units}</strong></span>
                          <span>Date: {new Date(participant.donation_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleIssueCertificate(participant.donation_id, participant.donor_name)}
                        disabled={processing === participant.donation_id}
                        className="bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        {processing === participant.donation_id ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Issuing Certificate...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Issue Certificate Now
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventManagement;
