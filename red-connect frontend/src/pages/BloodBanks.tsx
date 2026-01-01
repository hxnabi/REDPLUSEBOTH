import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

const BLOOD_TYPES = ["All Types", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodBanks = () => {
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [states, setStates] = useState<string[]>(["All States"]);
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedBloodType, setSelectedBloodType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [banksRes, statesRes] = await Promise.all([
          api.getBloodBanks(),
          api.getBloodBankStates().catch(() => ({ states: [] })),
        ]);
        setBanks(banksRes || []);
        const uniqueStates = Array.isArray(statesRes?.states) ? statesRes.states : [];
        setStates(["All States", ...uniqueStates]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="bg-primary rounded-2xl p-6 mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
              Blood Banks
            </h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-lg">
                <SelectValue placeholder="Enter Your State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
              <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-lg">
                <SelectValue placeholder="Enter your Blood Type" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="hero" size="lg" className="rounded-lg h-12" onClick={fetchFiltered} disabled={loading}>
              Search
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Sr. No.</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Address</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">City</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">State</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Available Blood Types</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((bank, index) => (
                    <tr key={bank.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 text-sm text-foreground">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-4 text-sm text-foreground font-medium">{bank.name}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground max-w-[200px]">{bank.address}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{bank.phone}</td>
                      <td className="px-4 py-4 text-sm text-primary hover:underline cursor-pointer">{bank.email}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{bank.category}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{bank.city}</td>
                      <td className="px-4 py-4 text-sm font-medium text-primary">{bank.state}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{bank.available_blood_types}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

            {/* Results Count */}
            <div className="text-center py-3 text-sm text-muted-foreground border-t border-border">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} blood banks
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BloodBanks;
