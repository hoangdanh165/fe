import { useMemo, useEffect, ReactElement, useState } from 'react';
import { usePTServicesData } from '../../../data/ptservice-data';
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

interface CustomerStatistic {
  id: string;
  name: string;
  start_date: string;
  expire_date: string;
  discount: string;
  number_of_session: string; 
  session_duration: string; 
  cost_per_session: string;
  validity_period: string;
}

const PTServiceTable = ({ searchText }: { searchText: string }): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = usePTServicesData(reloadTrigger);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPTService, setEditingPTService] = useState<CustomerStatistic | null>(null);
  const [isEditMode, setEditMode] = useState(!!editingPTService);
  const [emailError, setEmailError] = useState('');
  const axiosPrivate = useAxiosPrivate()

  const handleEdit = (id: string) => {
    setEditMode(true)
    const ptservice = rows.find(row => row.id === id);
    if (ptservice) {
      setEditingPTService(ptservice);
      setEditModalOpen(true);
    }
  };
  
  const handleAdd = () => {
    setEditMode(false);
    setEditingPTService({
      id: '',         
      name: '',  
      start_date: '',
      expire_date: '',
      discount: '0',
      number_of_session: '0', 
      session_duration: '0', 
      cost_per_session: '0',
      validity_period: '0',
  });
    setEditModalOpen(true);
  }
  
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingPTService(null);
    setEmailError('');
  };

  const handleSave = async () => {
    setEmailError(''); 

    if (!editingPTService) return;

    if (isEditMode) {
      await handleSaveEdit();
    } else {
      await handleSaveAdd();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPTService) return;
    console.log(editingPTService)
    try {
      const response = await axiosPrivate.put(
        `/api/v1/pt-services/${editingPTService.id}/`, 
        {
          discount: editingPTService.discount,
          name: editingPTService.name,
          number_of_session: editingPTService.number_of_session,
          session_duration: editingPTService.session_duration,
          cost_per_session: editingPTService.cost_per_session,
          validity_period: editingPTService.validity_period,
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
        setEmailError('Gói tập với tên này đã tồn tại!');
        return;
      }
    }
  };

  const handleSaveAdd = async () => {
    if (!editingPTService) return;

    try {
      const response = await axiosPrivate.post(
        `/api/v1/pt-services/`,
        {
          discount: editingPTService.discount,
          name: editingPTService.name,
          number_of_session: editingPTService.number_of_session,
          session_duration: editingPTService.session_duration,
          cost_per_session: editingPTService.cost_per_session,
          validity_period: editingPTService.validity_period,
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Đã thêm gói tập:', editingPTService);
      setReloadTrigger(prev => prev + 1);
      handleCloseEditModal();
    } catch (error) {
      if (error) {
        setEmailError('Gói tập với tên này đã tồn tại!');
        return;
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Xác nhận xoá gói tập này?')) {
      try {
        await axiosPrivate.delete(`/api/v1/pt-services/${id}/`); 
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
      field: 'name',
      headerName: 'Tên gói tập',
      resizable: false,
      flex: 0.5,
      minWidth: 300,
    },
    {
      field: 'discount',
      headerName: 'Khuyến mãi',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'number_of_session',
      headerName: 'Số buổi tập',
      resizable: false,
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: 'session_duration',
      headerName: 'Thời gian tập / buổi',
      resizable: false,
      flex: 0.5,
      minWidth: 160,
    },
    {
      field: 'cost_per_session',
      headerName: 'Giá / buổi',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'validity_period',
      headerName: 'Hạn sử dụng',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
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
              label="Sửa"
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
              label="Xoá"
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
        {isEditMode ? 'CẬP NHẬT GÓI TẬP' : 'THÊM GÓI TẬP'}
      </DialogTitle>
      <DialogContent>
        {editingPTService && (
          <>
            {emailError && <Alert severity="error">{emailError}</Alert>}

            <TextField
              autoFocus
              margin="dense"
              label="Tên gói tập"
              type="text"
              fullWidth
              variant="standard"
              value={editingPTService ? editingPTService.name : ''}
              onChange={(e) => setEditingPTService({ ...editingPTService, name: e.target.value })}
              InputProps={{
                sx: { 
                  color: 'yellow', 
                },
              }}
            />

            <Grid container spacing={2} marginTop={2}>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="Khuyến mãi"
                  type="text"
                  variant="standard"
                  value={editingPTService.discount ?? '0'}
                  onChange={(e) => setEditingPTService({ ...editingPTService, discount: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>, 
                    sx: { 
                      color: 'yellow', 
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="Số buổi tập"
                  type="text"
                  variant="standard"
                  value={editingPTService.number_of_session ?? '0'}
                  onChange={(e) => setEditingPTService({ ...editingPTService, number_of_session: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">buổi</InputAdornment>, 
                    sx: { 
                      color: 'yellow', 
                    },
                  }}
                  sx={{ width: '50%' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="Thời lượng mỗi buổi tập"
                  type="text"
                  variant="standard"
                  value={editingPTService.session_duration ?? '0'}
                  onChange={(e) => setEditingPTService({ ...editingPTService, session_duration: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">phút</InputAdornment>, 
                    sx: { 
                      color: 'yellow', 
                    },
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Giá mỗi buổi tập"
                  type="text"
                  variant="standard"
                  value={editingPTService.cost_per_session ?? '0'}
                  onChange={(e) => setEditingPTService({ ...editingPTService, cost_per_session: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                    sx: { 
                      color: 'yellow', 
                    },
                  }}
                  sx={{ width: '70%' }}
                />
              </Grid>
              <Grid item xs={6}>

              <TextField
              margin="dense"
              label="Thời gian sử dụng"
              type="text"
              variant="standard"
              value={editingPTService.validity_period ?? '0'}
              onChange={(e) => setEditingPTService({ ...editingPTService, validity_period: e.target.value })}
              InputProps={{
                endAdornment: <InputAdornment position="end">ngày</InputAdornment>,
                sx: { 
                  color: 'yellow', 
                },
              }}
              sx={{ width: '100%' }}
            />
            </Grid>
            </Grid>

            
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
            color: 'white',
            backgroundColor: '#4caf50',
            '&:hover': {
                  backgroundColor: '#388e3c',
                },
          }}>        
          {isEditMode ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>

    </>
  );
};

export default PTServiceTable;
