import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock, Droplet } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const BLOOD_TYPES = ["All Types", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const BLOOD_COMPONENTS = [
  "All Components",
  "Whole Blood",
  "Packed Red Blood Cells",
  "Platelets",
  "Fresh Frozen Plasma",
  "Cryoprecipitate"
];

const BloodBanks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [states, setStates] = useState<string[]>(["All States"]);
  const [districts, setDistricts] = useState<string[]>(["All Districts"]);
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBloodType, setSelectedBloodType] = useState("All Types");
  const [selectedComponent, setSelectedComponent] = useState("All Components");
  const [searchCenter, setSearchCenter] = useState("");
  const [campStartDate, setCampStartDate] = useState("");
  const [campEndDate, setCampEndDate] = useState("");
  const [campState, setCampState] = useState("All States");
  const [campDistrict, setCampDistrict] = useState("All Districts");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [banksRes, statesRes, districtsRes, eventsRes] = await Promise.all([
          api.getBloodBanks(),
          api.getBloodBankStates().catch(() => ({ states: [] })),
          api.getDistricts().catch(() => ({ districts: [] })),
          api.getEvents({ status: "upcoming" }).catch(() => []),
        ]);
        setBanks(banksRes || []);
        setEvents(eventsRes || []);
        const uniqueStates = Array.isArray(statesRes?.states) ? statesRes.states : [];
        setStates(["All States", ...uniqueStates]);
        const uniqueDistricts = Array.isArray(districtsRes?.districts) ? districtsRes.districts : [];
        setDistricts(["All Districts", ...uniqueDistricts]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch events with filters
  const fetchFilteredCamps = async () => {
    setLoading(true);
    try {
      const params: any = { status: "upcoming" };
      if (campState !== "All States") params.state = campState;
      if (campDistrict !== "All Districts") params.city = campDistrict;
      if (campStartDate) params.from_date = campStartDate;
      if (campEndDate) params.to_date = campEndDate;
      const data = await api.getEvents(params);
      setEvents(data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltered = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedState !== "All States") params.state = selectedState;
      if (selectedBloodType !== "All Types") params.blood_type = selectedBloodType;
      const data = await api.getBloodBanks(params);
      setBanks(data || []);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = banks.filter((bank) => {
    const stateMatch = selectedState === "All States" || bank.state === selectedState;
    const bloodStr = bank.available_blood_types || "";
    const bloodMatch = selectedBloodType === "All Types" || bloodStr.includes(selectedBloodType);
    return stateMatch && bloodMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleShare = (bank: any) => {
    const message = `🩸 Blood Bank Information\n\n` +
      `Name: ${bank.name}\n` +
      `Address: ${bank.address}, ${bank.city}, ${bank.state}\n` +
      `Phone: ${bank.phone}\n` +
      `Email: ${bank.email}\n` +
      `Category: ${bank.category}\n` +
      `Available Blood Types: ${bank.available_blood_types || "Contact for details"}\n\n` +
      `Find more: http://localhost:5173/blood-banks`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    const emailSubject = `Blood Bank Information - ${bank.name}`;
    const emailBody = message;
    const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Show share options
    if (navigator.share) {
      navigator.share({
        title: `Blood Bank - ${bank.name}`,
        text: message,
      }).catch(() => {
        // Fallback to WhatsApp
        window.open(whatsappUrl, '_blank');
      });
    } else {
      // Show modal with share options
      const choice = window.confirm("Share via WhatsApp? (Click OK)\nOr Email? (Click Cancel)");
      if (choice) {
        window.open(whatsappUrl, '_blank');
      } else {
        window.location.href = emailUrl;
      }
    }
  };

  const handleRegisterForCamp = (eventId: number) => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    if (!token) {
      // Not logged in - must check eligibility first
      toast({
        title: "Eligibility Check Required",
        description: "Please check your eligibility and register as a donor first",
      });
      navigate("/donor-eligibility");
      return;
    }

    if (userRole === "donor") {
      // Logged in donor - check if they've been through eligibility (we'll assume yes if registered)
      navigate(`/events/${eventId}`);
    } else {
      toast({
        title: "Donor Account Required",
        description: "Only registered donors can register for blood donation camps",
        variant: "destructive",
      });
      navigate("/donor-eligibility");
    }
  };

  const upcomingEvents = events.filter(e => {
    let matches = e.status === "upcoming";
    
    // Filter by state
    if (campState !== "All States") {
      matches = matches && e.state === campState;
    }
    
    // Filter by district/city
    if (campDistrict !== "All Districts") {
      matches = matches && e.city === campDistrict;
    }
    
    // Filter by date range
    if (campStartDate) {
      matches = matches && new Date(e.event_date) >= new Date(campStartDate);
    }
    if (campEndDate) {
      matches = matches && new Date(e.event_date) <= new Date(campEndDate);
    }
    
    return matches;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#C8102E] to-[#a00d25] rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">
                  Blood Services Directory
                </h1>
                <p className="text-white/90 text-lg">
                  Find blood banks, check availability, and request blood support
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/40 rounded-full px-5 h-11 text-sm md:text-base"
                  onClick={() => navigate("/donor-eligibility")}
                >
                  Become a Donor
                </Button>
                <Button
                  variant="hero"
                  className="rounded-full px-6 h-11 text-sm md:text-base shadow-lg shadow-red-900/40"
                  onClick={() => navigate("/blood-request")}
                >
                  Request Blood
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 h-11 text-sm md:text-base bg-white text-red-700 hover:bg-red-50 border-none"
                  onClick={() => navigate("/blood-request/track")}
                >
                  Track Request
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs for Blood Services */}
          <Tabs defaultValue="availability" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="availability" className="text-base">
                <Droplet className="w-4 h-4 mr-2" />
                Blood Availability
              </TabsTrigger>
              <TabsTrigger value="directory" className="text-base">
                <MapPin className="w-4 h-4 mr-2" />
                Blood Center Directory
              </TabsTrigger>
              <TabsTrigger value="camps" className="text-base">
                <Calendar className="w-4 h-4 mr-2" />
                Camp Schedule
              </TabsTrigger>
            </TabsList>

            {/* Blood Availability Tab */}
            <TabsContent value="availability">
              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select State</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full h-12 rounded-lg">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select District</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-full h-12 rounded-lg">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Type Blood Center Name</label>
                  <input
                    type="text"
                    value={searchCenter}
                    onChange={(e) => setSearchCenter(e.target.value)}
                    placeholder="Enter blood center name..."
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Blood Group</label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger className="w-full h-12 rounded-lg">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Blood Component</label>
                  <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                    <SelectTrigger className="w-full h-12 rounded-lg">
                      <SelectValue placeholder="Select Component" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_COMPONENTS.map((component) => (
                        <SelectItem key={component} value={component}>{component}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="rounded-lg h-12 w-full" 
                    onClick={fetchFiltered} 
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Selected Filters Display */}
              {(selectedState !== "All States" || selectedBloodType !== "All Types" || selectedComponent !== "All Components") && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    <strong>Selected Filters:</strong> {selectedState} 
                    {selectedBloodType !== "All Types" && ` / ${selectedBloodType}`}
                    {selectedComponent !== "All Components" && ` / ${selectedComponent}`}
                  </p>
                </div>
              )}

              {/* Blood Availability Table */}
              <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">S.No.</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Blood Center</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Availability</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Last Updated</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                            No blood availability data found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((bank, index) => (
                          <tr key={bank.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-4 text-sm text-foreground font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-semibold text-foreground">{bank.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {bank.address}, {bank.city}, {bank.state}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Phone: {bank.phone} | Email: {bank.email}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                {bank.category || "Govt."}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {bank.available_blood_types ? (
                                <span className="text-green-600 font-semibold text-sm">Available</span>
                              ) : (
                                <span className="text-red-600 font-semibold text-sm">Not Available</span>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {bank.available_blood_types || "Contact for details"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-muted-foreground">
                              {new Date(bank.updated_at || bank.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-foreground">
                              {bank.category === "Blood Bank" ? "BB" : "BSU"}
                            </td>
                            <td className="px-4 py-4">
                              <Button
                                variant="link"
                                className="text-blue-600 hover:underline p-0 h-auto font-semibold"
                                onClick={() => handleShare(bank)}
                              >
                                Share
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {paginatedData.length > 0 && (
                  <>
                    <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </Button>
                      
                      {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                      
                      {totalPages > 4 && <span className="px-2 text-muted-foreground">...</span>}
                      
                      {totalPages > 4 && (
                        <Button
                          variant={currentPage === totalPages ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10 h-10"
                        >
                          {totalPages}
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-center py-3 text-sm text-muted-foreground border-t border-border">
                      Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} blood banks
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Blood Center Directory Tab */}
            <TabsContent value="directory">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Blood Center Directory</h2>
                <p className="text-muted-foreground">Find blood banks and blood centers near you</p>
              </div>

              {/* Directory Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-lg">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-lg">
                    <SelectValue placeholder="Select Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="rounded-lg h-12" 
                  onClick={fetchFiltered} 
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Blood Centers Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading blood centers...</p>
                </div>
              ) : paginatedData.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">No blood centers found</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedData.map((bank, index) => (
                    <Card key={bank.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">
                                {(currentPage - 1) * itemsPerPage + index + 1}. {bank.name}
                              </h3>
                              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                {bank.category || "General"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {bank.address}, {bank.city}, {bank.state} - {bank.pincode}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-foreground font-medium">{bank.phone}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-primary hover:underline cursor-pointer">{bank.email}</span>
                            </div>

                            {bank.operating_hours && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{bank.operating_hours}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant="outline"
                            className="rounded-full border-green-500 text-green-700 hover:bg-green-50"
                          >
                            Stock
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-full border-red-500 text-red-700 hover:bg-red-50"
                            onClick={() => navigate("/events")}
                          >
                            Camps
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Pagination for Directory */}
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </Button>
                    
                    {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    {totalPages > 4 && <span className="px-2 text-muted-foreground">...</span>}
                    
                    {totalPages > 4 && (
                      <Button
                        variant={currentPage === totalPages ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10"
                      >
                        {totalPages}
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-center py-3 text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} blood centers
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Camp Schedule Tab */}
            <TabsContent value="camps">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Upcoming Blood Donation Camps</h2>
                <p className="text-muted-foreground">Filter and register for camps near you</p>
              </div>

              {/* Camp Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select State</label>
                  <Select value={campState} onValueChange={setCampState}>
                    <SelectTrigger className="w-full h-12 rounded-lg">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select District</label>
                  <Select value={campDistrict} onValueChange={setCampDistrict}>
                    <SelectTrigger className="w-full h-12 rounded-lg">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Start Date</label>
                  <input
                    type="date"
                    value={campStartDate}
                    onChange={(e) => setCampStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">To Date</label>
                  <input
                    type="date"
                    value={campEndDate}
                    onChange={(e) => setCampEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="rounded-lg h-12 w-full"
                    onClick={fetchFilteredCamps}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Selected Filters Display */}
              {(campState !== "All States" || campDistrict !== "All Districts" || campStartDate || campEndDate) && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    <strong>Active Filters:</strong>{" "}
                    {campState !== "All States" && `${campState}`}
                    {campDistrict !== "All Districts" && ` / ${campDistrict}`}
                    {campStartDate && ` / From: ${new Date(campStartDate).toLocaleDateString()}`}
                    {campEndDate && ` / To: ${new Date(campEndDate).toLocaleDateString()}`}
                  </p>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading camps...</p>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">No upcoming camps scheduled</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back later for new donation camps</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow border-border">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">
                            {new Date(event.event_date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">
                            {event.start_time} - {event.end_time}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">
                            {event.venue}, {event.city}, {event.state}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">
                            {event.registered_participants} / {event.max_participants || "∞"} registered
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleRegisterForCamp(event.id)}
                        className="w-full bg-gradient-to-r from-[#C8102E] to-[#a00d25] hover:from-[#a00d25] hover:to-[#800a1f] text-white rounded-full"
                      >
                        Register for Camp
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BloodBanks;
