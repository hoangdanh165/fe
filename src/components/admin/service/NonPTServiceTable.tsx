import { useMemo, useEffect, ReactElement, useState } from 'react';
import { useNonPTServicesData } from '../../../data/nonptservice-data';
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

interface NonPTService {
  id: string;
  name: string;
  start_date: string;
  expire_date: string;
  discount: string;
  number_of_month: string; 
  cost_per_month: string; 
}

const NonPTServiceTable = ({ searchText }: { searchText: string }): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = useNonPTServicesData(reloadTrigger);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPTService, setEditingPTService] = useState<NonPTService | null>(null);
  const [isEditMode, setEditMode] = useState(!!editingPTService);
  const [emailError, setEmailError] = useState('');
  const axiosPrivate = useAxiosPrivate()
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const handleEdit = (id: string) => {
    setEditMode(true)
    const nonptservice = rows.find(row => row.id === id);
    if (nonptservice) {
      setEditingPTService(nonptservice);
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
      number_of_month: '0', 
      cost_per_month: '0',
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
        `/api/v1/nonpt-services/${editingPTService.id}/`, 
        {
          discount: editingPTService.discount,
          name: editingPTService.name,
          number_of_month: editingPTService.number_of_month,
          cost_per_month: editingPTService.cost_per_month
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
        `/api/v1/nonpt-services/`,
        {
          discount: editingPTService.discount,
          name: editingPTService.name,
          number_of_month: editingPTService.number_of_month,
          cost_per_month: editingPTService.cost_per_month
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
    const idsToDelete = rowSelectionModel.length > 0 ? rowSelectionModel : [id];
    console.log(idsToDelete);

    if (
      idsToDelete.length > 0 &&
      window.confirm("Bạn có muốn xoá (những) gói tập này không?")
    ) {
      try {
        const response = await axiosPrivate.post('/api/v1/nonpt-services/delete-multiple/', {
          ids: idsToDelete,
        });
        alert('Xoá thành công!');
        
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting nonptservices:", error);
        alert(error.response?.data?.error || "An error occurred while deleting nonptservices.");
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
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'discount',
      headerName: 'Khuyến mãi (%)',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'number_of_month',
      headerName: 'Số tháng tập',
      resizable: false,
      flex: 0.5,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'cost_per_month',
      headerName: 'Giá / tháng (VNĐ)',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
      headerAlign: 'center',
      align: 'center',
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
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
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
                      width: '100px'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="Số tháng tập"
                  type="text"
                  variant="standard"
                  value={editingPTService.number_of_month ?? '0'}
                  onChange={(e) => setEditingPTService({ ...editingPTService, number_of_month: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">tháng</InputAdornment>, 
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
                  label="Giá mỗi tháng tập"
                  type="text"
                  variant="standard"
                  value={editingPTService.cost_per_month ?? '0'}
                  onChange={(e) => setEditingPTService({ ...editingPTService, cost_per_month: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                    sx: { 
                      color: 'yellow', 
                    },
                  }}
                  sx={{ width: '70%' }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              

              
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

export default NonPTServiceTable;
