import React from 'react';
import { Box } from '@mui/material';

import Accounts from '../components/sections/dashboard/customers/Accounts';

const Dashboard = () => {
  return (
    <>
        <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
          <Accounts />
        </Box>
    </>
  );
};

export default Dashboard;
