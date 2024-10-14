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
    path: paths.accounts,
    title: 'Quản lý Tài khoản',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 2,
    path: paths.statistics,
    title: 'Thống kê',
    icon: 'material-symbols-light:leaderboard-outline',
    active: false,
  },
  {
    id: 3,
    path: paths.services,
    title: 'Quản lý Dịch vụ',
    icon: 'lets-icons:bag-alt-light',
    active: false,
  },
  {
    id: 4,
    path: paths.service_response,
    title: 'Phản hồi Dịch vụ',
    icon: 'bi:chat',
    active: false,
  },
  {
    id: 5,
    path: '#!',
    title: '',
    icon: 'ic:round-history',
    active: false,
  },

  {
    id: 6,
    path: '/home/settings',
    title: 'Settings',
    icon: 'mingcute:settings-3-line',
    active: false,
  },
  
];

export default navItems;
