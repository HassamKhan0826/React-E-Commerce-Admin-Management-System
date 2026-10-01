export const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"];

export const initialOrders = [
  { id: "RS-1048", customer: "Sarah Ahmed", products: "3 items", total: 248, status: "Completed", date: "2026-09-29" },
  { id: "RS-1047", customer: "Ali Raza", products: "2 items", total: 129.5, status: "Processing", date: "2026-09-29" },
  { id: "RS-1046", customer: "Maya Khan", products: "1 item", total: 84, status: "Completed", date: "2026-09-28" },
  { id: "RS-1045", customer: "Omar Shah", products: "4 items", total: 319.2, status: "Pending", date: "2026-09-28" },
  { id: "RS-1044", customer: "Ayesha Noor", products: "2 items", total: 178, status: "Cancelled", date: "2026-09-27" },
  { id: "RS-1043", customer: "Bilal Hussain", products: "5 items", total: 412.75, status: "Processing", date: "2026-09-26" },
  { id: "RS-1042", customer: "Hina Malik", products: "1 item", total: 59.99, status: "Pending", date: "2026-09-26" },
];

export const initialUsers = [
  { id: 1, name: "Sarah Ahmed", email: "sarah@example.com", role: "Customer", status: "Active" },
  { id: 2, name: "Ali Raza", email: "ali@example.com", role: "Customer", status: "Active" },
  { id: 3, name: "Maya Khan", email: "maya@example.com", role: "Manager", status: "Active" },
  { id: 4, name: "Omar Shah", email: "omar@example.com", role: "Customer", status: "Inactive" },
  { id: 5, name: "Ayesha Noor", email: "ayesha@example.com", role: "Customer", status: "Active" },
  { id: 6, name: "Bilal Hussain", email: "bilal@example.com", role: "Support", status: "Active" },
];