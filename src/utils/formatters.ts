
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { JobDescription } from "@/types";

export const formatSalary = (salaryRange: JobDescription["salaryRange"]) => {
  const { min, max, currency } = salaryRange;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  
  return `${formatter.format(min)} - ${formatter.format(max)} per year`;
};

export const formatDate = (dateString: string, formatStr: string = "MMM dd, yyyy") => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, formatStr);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

export const formatTimeFromNow = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid date";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};
