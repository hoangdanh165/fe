export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

const navItems: NavItem[] = [
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


export default navItems;
