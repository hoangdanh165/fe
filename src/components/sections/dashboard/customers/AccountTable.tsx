import { useMemo, useEffect, ReactElement, useState } from 'react';
import { useUsersData } from '../../../../data/user-data'
import { stringAvatar } from '../../../../helpers/string-avatar';
import IconifyIcon from '../../../../components/base/IconifyIcon';
import React from 'react';
import CustomPagination from '../../../../components/common/CustomPagination';
import CustomNoResultsOverlay from '../../../../components/common/CustomNoResultsOverlay';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
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

}

const AccountTable = ({ searchText }: { searchText: string }): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = useUsersData(reloadTrigger);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditMode, setEditMode] = useState(!!editingUser);
  const axiosPrivate = useAxiosPrivate()
  console.log(rows)

  const handleEdit = (id: string) => {
    setEditMode(true)
    const user = rows.find(row => row.id === id);
    if (user) {
      setEditingUser(user);
      setEditModalOpen(true);
    }
  };
  
  const handleAdd = () => {
    setEditMode(false)
    setEditModalOpen(true);
  }
  
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
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
      console.log('User data for edit:', response.data);

      console.log('Đã cập nhật người dùng:', editingUser);
      setReloadTrigger(prev => prev + 1);
      handleCloseEditModal();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
    }
  };

  const handleSaveAdd = async () => {
    if (!editingUser) return;
    console.log("BỐ MÀY ĐANG THÊM THẰNG...", editingUser.email_verified)
    try {
      const response = await axiosPrivate.post(
        `/api/v1/users/`, 
        {
          email: editingUser.email,
          status: editingUser.status,
          email_verified: editingUser.email_verified ? true : false
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('User data for edit:', response.data);

      console.log('Đã thêm người dùng:', editingUser);
      setReloadTrigger(prev => prev + 1);
      handleCloseEditModal();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
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
        {true && (
          <>
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
              margin="dense"
              label="Trạng thái"
              fullWidth
              variant="standard"
              value={editingUser? editingUser.status : ''}
              onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
            />
      
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
