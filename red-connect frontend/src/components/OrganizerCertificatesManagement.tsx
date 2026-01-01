import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: number;
  donor_id: number;
  event_id: number | null;
  donation_date: string;
  blood_type: string;
  units: number;
  status: string;
  certificate_url: string | null;
}

interface Certificate {
  id: number;
  donation_id: number;
  donor_id: number;
  certificate_number: string;
  issue_date: string;
  blood_units: number;
  blood_type: string;
  status: string;
  certificate_url: string | null;
  issued_by: string;
  notes: string | null;
}

const OrganizerCertificatesManagement = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [formData, setFormData] = useState({
    blood_units: "",
    blood_type: "",
    issued_by: "",
    notes: "",
  });

  useEffect(() => {
    fetchDonations();
    fetchCertificates();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/donations/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch donations");
      
      const data = await response.json();
      // Filter donations that don't have certificates yet
      setDonations(data.filter((d: Donation) => d.status === "COMPLETED"));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch donations",
        variant: "destructive",
      });
    }
  };

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/certificates/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch certificates");
      
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch certificates",
        variant: "destructive",
      });
    }
  };

  const handleCreateCertificate = async () => {
    if (!selectedDonation) return;

    if (!formData.blood_units || !formData.blood_type || !formData.issued_by) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/certificates/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donation_id: selectedDonation.id,
          blood_units: parseFloat(formData.blood_units),
          blood_type: formData.blood_type,
          issued_by: formData.issued_by,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create certificate");

      toast({
        title: "Success",
        description: "Certificate created successfully",
      });

      setShowCreateDialog(false);
      setFormData({ blood_units: "", blood_type: "", issued_by: "", notes: "" });
      setSelectedDonation(null);
      fetchCertificates();
      fetchDonations();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create certificate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingCertificates = donations.filter(
    (d) => !certificates.some((c) => c.donation_id === d.id)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{pendingCertificates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Issued Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{certificates.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Issued Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Issued Certificates</CardTitle>
          <CardDescription>
            {certificates.length === 0
              ? "No certificates issued yet"
              : `${certificates.length} certificate${certificates.length !== 1 ? "s" : ""} issued`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No certificates issued yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {certificates.map((cert) => (
                <Card key={cert.id} className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{cert.certificate_number}</p>
                        <p className="text-sm text-gray-600">
                          {cert.blood_units} unit(s) of {cert.blood_type} - {cert.issued_by}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Donations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Donations</CardTitle>
            <CardDescription>
              {pendingCertificates.length === 0
                ? "No pending donations"
                : `${pendingCertificates.length} donation${pendingCertificates.length !== 1 ? "s" : ""} awaiting certificates`}
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">Issue Certificate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Certificate</DialogTitle>
                <DialogDescription>
                  Issue a certificate for a blood donation
                </DialogDescription>
              </DialogHeader>

              {selectedDonation ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">Selected Donation</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Date: {new Date(selectedDonation.donation_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Blood Type: {selectedDonation.blood_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Units: {selectedDonation.units}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Units *</Label>
                    <Input
                      type="number"
                      placeholder="1.0"
                      step="0.5"
                      value={formData.blood_units}
                      onChange={(e) => setFormData({ ...formData, blood_units: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Type *</Label>
                    <Input
                      placeholder="e.g., O+, A-, AB+"
                      value={formData.blood_type}
                      onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Issued By *</Label>
                    <Input
                      placeholder="Hospital/Organization Name"
                      value={formData.issued_by}
                      onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Optional notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setSelectedDonation(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Change Donation
                    </Button>
                    <Button
                      onClick={handleCreateCertificate}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      {loading ? "Creating..." : "Create Certificate"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingCertificates.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No pending donations</p>
                    </div>
                  ) : (
                    pendingCertificates.map((donation) => (
                      <Card
                        key={donation.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setFormData({
                            ...formData,
                            blood_units: donation.units.toString(),
                            blood_type: donation.blood_type,
                          });
                        }}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Donation #{donation.id}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(donation.donation_date).toLocaleDateString()} -{" "}
                                {donation.blood_type} ({donation.units} unit{donation.units !== 1 ? "s" : ""})
                              </p>
                            </div>
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {pendingCertificates.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">All donations have certificates!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingCertificates.map((donation) => (
                <Card key={donation.id} className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Donation #{donation.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.donation_date).toLocaleDateString()} -{" "}
                          {donation.blood_type}
                        </p>
                        <p className="text-sm text-gray-600">Units: {donation.units}</p>
                      </div>
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerCertificatesManagement;
