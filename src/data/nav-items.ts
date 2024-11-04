import paths from "../routes/paths";
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
    path: paths.customer,
    title: "Quản lý khách hàng",
    icon: "mdi:account-group-outline",
    active: false,
  },
  {
    id: 2,
    path: paths.schedule,
    title: "Lịch tập luyện",
    icon: "material-symbols:fitness-center",
    active: false,
  },
  {
    id: 3,
    path: "/coach/product",
    title: "Tin nhắn",
    icon: "bi:chat",
    active: false,
  },
  {
    id: 4,
    path: paths.training_plans,
    title: "Giáo án tập luyện",
    icon: "bi:book",
    active: false,
  },
  {
    id: 5,
    path: paths.profile,
    title: "Cài đặt",
    icon: "mingcute:settings-3-line",
    active: false,
  },
];


export default navItems;
