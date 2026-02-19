import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Droplet, Clock, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";


interface BloodRequestStatusData {
  id: number;
  patient_name: string;
  required_blood_group: string;
  quantity_units: number;
  hospital_name: string;
  hospital_address?: string | null;
  urgency_level: string;
  contact_name: string;
  contact_phone: string;
  approval_status: string;
  donor_status: string;
  completion_status: string;
  created_at: string;
}


const statusLabelMap: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  searching: "Searching for donor",
  matched: "Donor matched",
  confirmed: "Donor confirmed",
  open: "Open",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};


const BloodRequestStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<BloodRequestStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lookupId, setLookupId] = useState("");

  const loadData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new Error("Invalid request ID");
      }
      const response = await api.getBloodRequestById(numericId);
      setData(response);
    } catch (err) {
      setError("We could not find this blood request. Please check the ID and try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  const renderStatusBadge = (value: string, type: "approval" | "donor" | "completion") => {
    const normalized = value.toLowerCase();
    if (type === "approval") {
      if (normalized === "approved") return <Badge className="bg-emerald-600">Approved</Badge>;
      if (normalized === "rejected") return <Badge className="bg-red-600">Rejected</Badge>;
      return <Badge className="bg-amber-500">Pending</Badge>;
    }
    if (type === "donor") {
      if (normalized === "matched") return <Badge className="bg-sky-600">Matched</Badge>;
      if (normalized === "confirmed") return <Badge className="bg-indigo-600">Confirmed</Badge>;
      return <Badge className="bg-slate-600">Searching</Badge>;
    }
    if (normalized === "fulfilled") return <Badge className="bg-emerald-600">Fulfilled</Badge>;
    if (normalized === "cancelled") return <Badge className="bg-red-600">Cancelled</Badge>;
    return <Badge className="bg-slate-600">Open</Badge>;
  };

  const renderUrgencyBadge = (value: string) => {
    const normalized = value.toLowerCase();
    if (normalized === "critical")
      return <Badge className="bg-red-600 text-white px-3 py-1 rounded-full">Critical</Badge>;
    if (normalized === "urgent")
      return <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full">Urgent</Badge>;
    return <Badge className="bg-amber-400 text-white px-3 py-1 rounded-full">Normal</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/40 to-white">
      <Navbar />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-red-600 uppercase mb-2">
                Track Request
              </p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
                Blood Request Status
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">
                Use your request ID to check the latest status any time you return to this website.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Request ID"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  className="w-40 rounded-full text-sm"
                />
                <Button
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white text-sm"
                  onClick={() => {
                    const trimmed = lookupId.trim();
                    if (!trimmed) return;
                    navigate(`/blood-request/track/${trimmed}`);
                  }}
                >
                  Track
                </Button>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-red-500 text-red-700 hover:bg-red-600 hover:text-white"
                onClick={() => void loadData()}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {error && (
            <Card className="border border-red-100 bg-red-50/90 mb-6">
              <div className="flex items-start gap-3 px-4 py-3 text-sm text-red-800">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
                <p>{error}</p>
              </div>
            </Card>
          )}

          <Card className="border border-red-100 shadow-lg shadow-red-100/40 rounded-3xl p-6 md:p-8 bg-white/95 backdrop-blur">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Clock className="w-7 h-7 text-red-500 animate-pulse" />
                <p className="text-sm text-gray-600">Loading your request details...</p>
              </div>
            ) : !data ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Droplet className="w-8 h-8 text-red-500" />
                <p className="text-sm text-gray-700">
                  We could not find a blood request with this ID.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-1">
                      Request ID
                    </p>
                    <p className="font-mono text-sm md:text-base font-semibold text-gray-900">
                      #{data.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderUrgencyBadge(data.urgency_level)}
                    <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                      <Droplet className="w-3 h-3" />
                      {data.required_blood_group}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-900">Patient & Hospital</h2>
                    <div className="rounded-2xl bg-rose-50/70 border border-rose-100 px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {data.patient_name} ({data.required_blood_group})
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {data.quantity_units} unit{data.quantity_units > 1 ? "s" : ""} required
                      </p>
                      <p className="text-xs text-gray-700 mt-2">
                        {data.hospital_name}
                        {data.hospital_address ? ` • ${data.hospital_address}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-900">Contact</h2>
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm">
                      <p className="font-medium text-gray-900">{data.contact_name}</p>
                      <p className="text-xs text-gray-700 mt-1">{data.contact_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-gray-900">Status Timeline</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                        Approval
                      </p>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(data.approval_status, "approval")}
                        <span className="text-xs text-gray-600">
                          {statusLabelMap[data.approval_status] || data.approval_status}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                        Donor Match
                      </p>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(data.donor_status, "donor")}
                        <span className="text-xs text-gray-600">
                          {statusLabelMap[data.donor_status] || data.donor_status}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                        Completion
                      </p>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(data.completion_status, "completion")}
                        <span className="text-xs text-gray-600">
                          {statusLabelMap[data.completion_status] || data.completion_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Created on {new Date(data.created_at).toLocaleString()}
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default BloodRequestStatus;
