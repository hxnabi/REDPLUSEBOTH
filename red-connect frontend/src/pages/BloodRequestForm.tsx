import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AlertCircle, Droplet, UploadCloud, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";


const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  { value: "normal", label: "Normal (within 72 hours)" },
  { value: "urgent", label: "Urgent (within 24 hours)" },
  { value: "critical", label: "Critical (immediate)" },
];


const BloodRequestForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<{
    id: number;
    approval_status: string;
    donor_status: string;
    completion_status: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const requiredFields = [
      "patient_name",
      "required_blood_group",
      "quantity_units",
      "hospital_name",
      "contact_name",
      "contact_phone",
      "urgency_level",
    ];

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields marked with *.",
          variant: "destructive",
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await api.createBloodRequest(formData);
      setTrackingInfo({
        id: response.id,
        approval_status: response.approval_status,
        donor_status: response.donor_status,
        completion_status: response.completion_status,
      });
      toast({
        title: "Blood request submitted",
        description: "We have received your request. Our team will contact you shortly.",
      });
      form.reset();
      setFileName(null);
    } catch (error) {
      toast({
        title: "Unable to submit request",
        description: "Please check your connection and try again, or contact the helpline for emergencies.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/40 to-white">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-red-600 uppercase mb-2">Need Blood?</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
              Blood Request Form
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Submit a request and we&apos;ll match you with available donors and blood banks in your area.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
              <p>
                Emergency? Call your nearest hospital or official blood helpline immediately. Use this form for
                non‑life‑threatening requests or when you have at least a short planning window.
              </p>
            </div>
          </div>

          <Card className="border border-red-100 shadow-lg shadow-red-100/40 rounded-3xl p-6 md:p-8 bg-white/95 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div>
                  <h2 className="text-sm font-semibold text-red-600 tracking-[0.2em] uppercase mb-1">
                    Patient Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient Name<span className="text-red-500">*</span>
                      </label>
                      <Input name="patient_name" placeholder="Patient full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Required Blood Group<span className="text-red-500">*</span>
                      </label>
                      <Select name="required_blood_group">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOOD_GROUPS.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity Required (units)<span className="text-red-500">*</span>
                      </label>
                      <Input name="quantity_units" type="number" min={1} defaultValue={1} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level<span className="text-red-500">*</span>
                      </label>
                      <Select name="urgency_level" defaultValue="normal">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {URGENCY_LEVELS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-red-600 tracking-[0.2em] uppercase mb-1">
                    Hospital Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hospital Name<span className="text-red-500">*</span>
                      </label>
                      <Input name="hospital_name" placeholder="Hospital name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                      <Input name="doctor_name" placeholder="Attending doctor" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
                      <Input name="hospital_address" placeholder="Full address" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-red-600 tracking-[0.2em] uppercase mb-1">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person Name<span className="text-red-500">*</span>
                      </label>
                      <Input name="contact_name" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number<span className="text-red-500">*</span>
                      </label>
                      <Input name="contact_phone" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input name="contact_email" type="email" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship to Patient
                      </label>
                      <Input name="relation_to_patient" placeholder="Son, Daughter, Friend, etc." />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-red-600 tracking-[0.2em] uppercase mb-1">
                    Medical Proof
                  </h2>
                  <div className="mt-3">
                    <label
                      htmlFor="medical_proof"
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-4 py-6 cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <UploadCloud className="w-8 h-8 text-red-500" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-800">
                          {fileName || "Drag & drop file or click to browse"}
                        </p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                      </div>
                      <input
                        id="medical_proof"
                        name="medical_proof"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-red-600 tracking-[0.2em] uppercase mb-1">
                    Additional Notes
                  </h2>
                  <Textarea
                    name="additional_notes"
                    placeholder="Any additional information about the patient or requirement..."
                    className="mt-3"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {trackingInfo && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Blood Request Tracking</p>
                      <p className="mb-1 text-xs text-emerald-900/80">
                        Request ID: <span className="font-mono font-semibold">#{trackingInfo.id}</span>
                      </p>
                      <p className="text-xs text-emerald-900/80">
                        Approval status: <span className="font-semibold capitalize">{trackingInfo.approval_status}</span> •
                        Donor status: <span className="font-semibold capitalize">{trackingInfo.donor_status}</span> •
                        Completion status:{" "}
                        <span className="font-semibold capitalize">{trackingInfo.completion_status}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-1 h-9 rounded-full border-red-300 text-red-700 hover:bg-red-600 hover:text-white text-xs px-4 whitespace-nowrap"
                      onClick={() => navigate(`/blood-request/track/${trackingInfo.id}`)}
                    >
                      Track this request
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 md:h-14 rounded-full text-sm md:text-base font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                >
                  <Droplet className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit Blood Request"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default BloodRequestForm;
