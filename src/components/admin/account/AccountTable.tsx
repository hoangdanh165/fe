import { useMemo, useEffect, ReactElement, useState } from 'react';
import { useUsersData } from '../../../data/user-data';
import { stringAvatar } from '../../../helpers/string-avatar';
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
  TextField,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
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

interface User {
  id: string;
  email: string;
  status: string;
  email_verified: boolean;
  password: string,

}

const AccountTable = ({ searchText }: { searchText: string }): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = useUsersData(reloadTrigger);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditMode, setEditMode] = useState(!!editingUser);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const axiosPrivate = useAxiosPrivate()

  const handleEdit = (id: string) => {
    setEditMode(true)
    const user = rows.find(row => row.id === id);
    if (user) {
      setEditingUser(user);
      setEditModalOpen(true);
    }
  };
  
  const handleAdd = () => {
    setEditMode(false);
    setEditingUser({
      id: '',           
      email: '',        
      status: 'Active', 
      email_verified: false,  
      password: '12345678',    
  });
    setEditModalOpen(true);
  }
  
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    setEmailError('');
    setPasswordError('');
  };

  const handleSave = async () => {
    setEmailError(''); 
    setPasswordError('');

    if (!editingUser) return;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(editingUser.email)) {
      setEmailError('Email phải có dạng: email_name@provider_name.domain');
      return;
    }

    if (editingUser.password && editingUser.password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 kí tự!');
      return;
    }

    if (isEditMode) {
      await handleSaveEdit();
    } else {
      await handleSaveAdd();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    console.log(editingUser)
    try {
      const response = await axiosPrivate.put(
        `/api/v1/users/${editingUser.id}/`, 
        {
          email: editingUser.email,
          status: editingUser.status,
          email_verified: editingUser.email_verified
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setReloadTrigger(prev => prev + 1);
      handleCloseEditModal();
    } catch (error) {
      if (error) {
        setEmailError('Tài khoản với email này đã tồn tại!');
        return;
      }
    }
  };

  const handleSaveAdd = async () => {
    if (!editingUser) return;

    try {
      const response = await axiosPrivate.post(
        `/api/v1/users/`,
        {
          email: editingUser.email,
          status: editingUser.status,
          email_verified: editingUser.email_verified,
          password: editingUser.password
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Đã thêm người dùng:', editingUser);
      setReloadTrigger(prev => prev + 1);
      handleCloseEditModal();
    } catch (error) {
      if (error) {
        setEmailError('Tài khoản với email này đã tồn tại!');
        return;
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosPrivate.delete(`/api/v1/users/${id}/`); 
        console.log(`User with ID ${id} deleted.`);
        setReloadTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'email',
      headerName: 'Email',
      valueGetter: (params: any) => {
        return params;
      },
      renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
        return (
          <Stack direction="row" gap={1} alignItems="center">
            <Tooltip title={params.row.email} placement="top" arrow>
              <Avatar {...stringAvatar(params.row.email)} />
            </Tooltip>
            <Typography variant="body2">{params.row.email}</Typography>
          </Stack>
        );
      },
      resizable: false,
      flex: 1,
      minWidth: 155,
    },
    {
      field: 'status',
      headerName: 'Status',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      resizable: false,
      flex: 1,
      minWidth: 80,
      getActions: (params) => {
        return [
          <Tooltip title="Edit">
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  icon="fluent:edit-32-filled"
                  color="text.secondary"
                  sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                />
              }
              label="Edit"
              size="small"
              onClick={() => handleEdit(params.id)}
            />
          </Tooltip>,
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  icon="mingcute:delete-3-fill"
                  color="error.main"
                  sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                />
              }
              label="Delete"
              size="small"
              onClick={() => handleDelete(params.id)}
            />
          </Tooltip>,
        ];
      },
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
        <Button 
          onClick={handleAdd}
          sx={{ 
            width: '40px', 
            height: '40px', 
            fontSize: '20px', 
            padding: '0px 0px', 
          }}>+</Button>
      </div>
    <Dialog 
      open={editModalOpen} 
      onClose={handleCloseEditModal} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 10, 
          padding: '30px', 
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>        
        {isEditMode ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}
      </DialogTitle>
      <DialogContent>
        {editingUser && (
          <>
            {emailError && <Alert severity="error">{emailError}</Alert>}
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={editingUser? editingUser.email : ''}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
  
            <TextField
              autoFocus
              margin="dense"
              label="Password"
              type="text"
              fullWidth
              variant="standard"
              disabled={isEditMode}
              value={editingUser.password ?? '*********'}
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="role-label">Trạng thái tài khoản</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                value={editingUser?.status ?? 'Active'}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}>

                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='Blocked'>Blocked</MenuItem>
                <MenuItem value='Invited'>Invited</MenuItem>
                
              </Select>
            </FormControl>
      
            <FormControl fullWidth margin="dense">
              <InputLabel id="role-label">Trạng thái Email</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                value={editingUser?.email_verified ?? false}
                onChange={(e) => setEditingUser({ ...editingUser, email_verified: e.target.value })}>

                <MenuItem value={false}>Chưa xác nhận</MenuItem>
                <MenuItem value={true}>Đã xác nhận</MenuItem>
                
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditModal} 
          color='error' 
          variant='contained'
          sx={{ 
            width: '100px',
            height: '50px', 
            fontSize: '16px', 
            padding: '10px 20px', 
          }}>Hủy</Button>
        
        <Button onClick={handleSave}
          sx={{ 
            width: '150px', 
            height: '50px', 
            fontSize: '16px', 
            padding: '10px 20px', 
          }}>        
          {isEditMode ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>

    </>
  );
};

export default AccountTable;
