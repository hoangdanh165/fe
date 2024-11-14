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
    path: paths.sale_home,
    title: "Trang chủ",
    icon: "ep:home-filled",
    active: true,
  },
  {
    id: 2,
    path: paths.sale_contracts,
    title: "Quản lý hợp đồng",
    icon: "material-symbols:contract-outline",
    active: false,
  },
  {
    id: 3,
    path: paths.service_response_for_sale,
    title: "Phản hồi dịch vụ",
    icon: "bi:chat",
    active: false,
  },
];


export default navItems;
