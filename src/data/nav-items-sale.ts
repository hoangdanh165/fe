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
    path: "/sale",
    title: "Trang chủ",
    icon: "ep:home-filled",
    active: true,
  },
  {
    id: 2,
    path: "/sale/contracts",
    title: "Quản lý hợp đồng",
    icon: "material-symbols:contract-outline",
    active: false,
  }
];


export default navItems;
