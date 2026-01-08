import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time to 12-hour AM/PM format
export function formatTimeTo12Hour(time24: string): string {
  if (!time24) return "";
  
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format date and time together
export function formatDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return "";
  
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  if (timeStr) {
    return `${dateFormatted} at ${formatTimeTo12Hour(timeStr)}`;
  }
  
  return dateFormatted;
}
