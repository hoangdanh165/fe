import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import paths from "../routes/paths";
export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}
// NavItems for Admin
const adminNavItems: NavItem[] = [
  {
    id: 1,
    path: "/admin/dashboard",
    title: "Dashboard",
    icon: "mingcute:hoe-1-fill",
    active: true,
  },
  {
    id: 2,
    path: "/admin/manage-accounts",
    title: "Quản lý nhân sự",
    icon: "material-symbols:account-box",
    active: false,
  },
  {
    id: 3,
    path: "/admin/service",
    title: "Quản lý gói tập",
    icon: "mdi:dumbbell",
    active: false,
  },
  {
    id: 4,
    path: "/admin/reports",
    title: "Thống kê",
    icon: "ic:outline-assessment",
    active: false,
  },
  {
    id: 5,
    path: "/admin/settings",
    title: "Cài đặt",
    icon: "mingcute:settings-3-line",
    active: false,
  },
];

// NavItems for Coach
const coachNavItems: NavItem[] = [
  {
    id: 1,
    path: "/coach/customer",
    title: "Dashboard",
    icon: "mingcute:hoe-1-fill",
    active: true,
  },
  {
    id: 2,
    path: "/coach/manage-clients",
    title: "Quản lý khách hàng",
    icon: "mdi:account-group-outline",
    active: false,
  },
  {
    id: 3,
    path: "/coach/workout-schedule",
    title: "Lịch tập luyện",
    icon: "material-symbols:fitness-center",
    active: false,
  },
  {
    id: 4,
    path: "/coach/product",
    title: "Tin nhắn",
    icon: "bi:chat",
    active: false,
  },
  {
    id: 5,
    path: "/coach/profile",
    title: "Cài đặt",
    icon: "mingcute:settings-3-line",
    active: false,
  },
];

// Function to export correct NavItems based on role
const getNavItems = (): NavItem[] => {
  const { auth } = useAuth();
  if (auth?.role === "admin") {
    return adminNavItems;
  } else if (auth?.role === "coach") {
    return coachNavItems;
  }
  return [];
};

export default getNavItems;
