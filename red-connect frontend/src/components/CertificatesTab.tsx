import { useState, useEffect } from "react";
import { Award, Download, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
  updated_at: string;
}

const CertificatesTab = () => {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/certificates/my-certificates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }

      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "bg-green-50 border-green-200";
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "revoked":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "issued":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />;
      case "revoked":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-600" />;
    }
  };

  const downloadCertificate = async (certificate: Certificate) => {
    if (certificate.certificate_url) {
      // If certificate has a URL, open it in new tab
      window.open(certificate.certificate_url, "_blank");
    } else {
      toast({
        title: "Not Available",
        description: "Certificate PDF is not yet available. Please contact the organizer.",
        variant: "default",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="py-12">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Your certificates will appear here as you complete blood donations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id} className={`border ${getStatusColor(cert.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(cert.status)}
                  <div>
                    <CardTitle className="text-lg">{cert.certificate_number}</CardTitle>
                    <CardDescription>
                      Issued on {new Date(cert.issue_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {cert.blood_units} unit{cert.blood_units !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-600">{cert.blood_type}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Issued By</p>
                  <p className="text-sm font-medium text-gray-900">{cert.issued_by}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{cert.status}</p>
                </div>
              </div>

              {cert.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm text-gray-700">{cert.notes}</p>
                </div>
              )}

              <Button
                onClick={() => downloadCertificate(cert)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={!cert.certificate_url}
              >
                <Download className="w-4 h-4 mr-2" />
                {cert.certificate_url ? "Download Certificate" : "Certificate Pending"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificatesTab;
