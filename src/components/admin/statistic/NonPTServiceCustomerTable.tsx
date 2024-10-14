import { useMemo, useEffect, ReactElement, useState } from 'react';
import { useNonPTServiceCustomerData } from '../../../data/nonptservice-customer-data';
import IconifyIcon from '../../base/IconifyIcon';
import React from 'react';
import CustomPagination from '../../common/CustomPagination';
import CustomNoResultsOverlay from '../../common/CustomNoResultsOverlay';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { 
  Stack, 
  Avatar, 
  Tooltip, 
  Typography, 
  CircularProgress,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Select,

  TextField,
  FormControl, 
  InputLabel, 
  MenuItem,
  Grid,
  Alert,
  InputAdornment,
} from '@mui/material';

import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
  GridActionsCellItem,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';

interface NonPTService {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  gender: string;
  birthday: string;
}

const NonPTServiceCustomerTable = ({ searchText }: { searchText: string }): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();
  const [dropdownData, setDropdownData] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState('');

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = useNonPTServiceCustomerData(reloadTrigger, selectedValue);
  const axiosPrivate = useAxiosPrivate();

  


  useEffect(() => {
    const fetchDropdownData = async () => {
      const response = await axiosPrivate.get('/api/v1/nonpt-services/all/',
        {
          withCredentials: true,
        }
      );
      setDropdownData(response.data);
    };
    fetchDropdownData();
  }, [axiosPrivate]);
  

  const handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedValue(event.target.value as string);
    setReloadTrigger(prev => prev + 1); 
  };


  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'first_name',
      headerName: 'Họ',
      resizable: false,
      flex: 0.5,
      minWidth: 300,
    },
    {
      field: 'last_name',
      headerName: 'Tên',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      resizable: false,
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: 'gender',
      headerName: 'Giới tính',
      resizable: false,
      flex: 0.5,
      minWidth: 160,
    },
    {
      field: 'birthday',
      headerName: 'Ngày sinh',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
  ];

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== 'id'),
    [columns],
  );

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word: string) => word !== ''),
    );
  }, [searchText]);

  useEffect(() => {
    const handleResize = () => {
      if (apiRef.current) {
        apiRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [apiRef]);

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={visibleColumns}
        autoHeight={false}
        rowHeight={56}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        rows={rows}
        loading={loading}
        onResize={() => {
          apiRef.current.autosizeColumns({
            includeOutliers: true,
            expand: true,
          });
        }}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 4 } },
        }}
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: CustomPagination as GridSlots['pagination'],
          noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
        }}
        slotProps={{
          pagination: { labelRowsPerPage: rows.length },
        }}
        sx={{
          height: 1,
          width: 1,
          tableLayout: 'fixed',
          scrollbarWidth: 'thin',
        }}
        
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Select
          value={selectedValue}
          onChange={handleDropdownChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select data' }}
          sx={{ width: '400px', height: '40px' }}
        >
          <MenuItem value="">
            <p>Chọn giá trị</p>
          </MenuItem>
          {dropdownData.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </div>
    </>
  );
};

export default NonPTServiceCustomerTable;
