const API_URL = "http://127.0.0.1:8000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth endpoints
  async donorRegister(data: any) {
    const response = await fetch(`${API_URL}/api/auth/donor/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async organizerRegister(data: any) {
    const response = await fetch(`${API_URL}/api/auth/organizer/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async donorLogin(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/donor/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async organizerLogin(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/organizer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async googleAuthDonor(idToken: string) {
    const response = await fetch(`${API_URL}/api/auth/google/donor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
    return response.json();
  },

  async googleAuthOrganizer(idToken: string) {
    const response = await fetch(`${API_URL}/api/auth/google/organizer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
    return response.json();
  },

  async googleAuthAdmin(idToken: string) {
    const response = await fetch(`${API_URL}/api/auth/google/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
    return response.json();
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get current user");
    return response.json();
  },

  // Donor endpoints
  async getDonorProfile() {
    const response = await fetch(`${API_URL}/api/donors/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get donor profile");
    return response.json();
  },

  async updateDonorProfile(data: any) {
    const response = await fetch(`${API_URL}/api/donors/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  },

  // Organizer endpoints
  async getOrganizerProfile() {
    const response = await fetch(`${API_URL}/api/organizers/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get organizer profile");
    return response.json();
  },

  async updateOrganizerProfile(data: any) {
    const response = await fetch(`${API_URL}/api/organizers/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update organizer profile");
    return response.json();
  },

  // Blood banks
  async getBloodBanks(params?: {
    state?: string;
    city?: string;
    category?: string;
    blood_type?: string;
    skip?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.state) query.set("state", params.state);
    if (params?.city) query.set("city", params.city);
    if (params?.category) query.set("category", params.category);
    if (params?.blood_type) query.set("blood_type", params.blood_type);
    if (typeof params?.skip === "number") query.set("skip", String(params.skip));
    if (typeof params?.limit === "number") query.set("limit", String(params.limit));
    const qs = query.toString();
    const url = `${API_URL}/api/blood-banks/${qs ? `?${qs}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get blood banks");
    return response.json();
  },

  async getBloodBankStates() {
    const response = await fetch(`${API_URL}/api/blood-banks/states/list`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get states");
    return response.json();
  },

  // Donations
  async getDonorDonations(donorId: number) {
    const response = await fetch(`${API_URL}/api/donations/donor/${donorId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get donations");
    return response.json();
  },

  async createDonation(data: any) {
    const response = await fetch(`${API_URL}/api/donations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create donation");
    return response.json();
  },

  // Events
  async getEvents(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    city?: string;
    state?: string;
    from_date?: string;
    to_date?: string;
  }) {
    const query = new URLSearchParams();
    if (typeof params?.skip === "number") query.set("skip", String(params.skip));
    if (typeof params?.limit === "number") query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.city) query.set("city", params.city);
    if (params?.state) query.set("state", params.state);
    if (params?.from_date) query.set("from_date", params.from_date);
    if (params?.to_date) query.set("to_date", params.to_date);

    const qs = query.toString();
    const url = `${API_URL}/api/events/${qs ? `?${qs}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get events");
    return response.json();
  },

  async getDistricts(state?: string) {
    const query = state ? `?state=${encodeURIComponent(state)}` : "";
    const response = await fetch(`${API_URL}/api/blood-banks/districts/list${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get districts");
    return response.json();
  },

  async createBloodRequest(formData: FormData) {
    const response = await fetch(`${API_URL}/api/blood-requests/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create blood request");
    return response.json();
  },

  async getBloodRequestById(id: number) {
    const response = await fetch(`${API_URL}/api/blood-requests/${id}`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Failed to get blood request");
    return response.json();
  },

  async getMyEvents() {
    const response = await fetch(`${API_URL}/api/events/my-events`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get your events");
    return response.json();
  },

  async getBlogs() {
    const response = await fetch(`${API_URL}/api/blogs/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to get blogs");
    return response.json();
  },

  async getBlogBySlug(slug: string) {
    const response = await fetch(`${API_URL}/api/blogs/${encodeURIComponent(slug)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to get blog");
    return response.json();
  },

  async chat(message: string) {
    const response = await fetch(`${API_URL}/api/chatbot/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error("Failed to get chatbot response");
    return response.json();
  },

  async getEvent(eventId: number) {
    const response = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get event");
    return response.json();
  },

  async createEvent(data: any) {
    const response = await fetch(`${API_URL}/api/events/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  },

  async updateEvent(eventId: number, data: any) {
    const response = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
  },

  async deleteEvent(eventId: number) {
    const response = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete event");
    return response.json();
  },

  async registerForEvent(eventId: number) {
    const response = await fetch(`${API_URL}/api/events/${eventId}/register`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to register for event");
    return response.json();
  },
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_email");
};
