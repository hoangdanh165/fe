import { useMemo, useState } from "react";
import { useCustomerData } from "../../data/customer-data";
import { stringAvatar } from "../../helpers/string-avatar";
import IconifyIcon from "../base/IconifyIcon";
import CustomPagination from "../../components/common/CustomPagination";
import CustomNoResultsOverlay from "../../components/common/CustomNoResultsOverlay";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
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
} from "@mui/material";

import { DataGrid, GridActionsCellItem, useGridApiRef } from "@mui/x-data-grid";

const CustomerTable = ({ searchText }) => {
  const apiRef = useGridApiRef();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = useCustomerData(reloadTrigger);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewInfo = (userId) => {
    const user = rows.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setOpenDialog(true);
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      resizable: false,
      minWidth: 140,
    },
    {
      field: "full_name",
      headerName: "Họ và Tên",
      resizable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1">
          {params.row.first_name} {params.row.last_name}
        </Typography>
      ),
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      resizable: false,
      flex: 1,
      minWidth: 80,
      getActions: (params) => {
        return [
          <Tooltip title="Xem" key={params.id}>
            <GridActionsCellItem
              icon={<IconifyIcon icon="fluent:edit-32-filled" />}
              label="Xem"
              onClick={() => handleViewInfo(params.id)} // Use params.id here
            />
          </Tooltip>,
        ];
      },
    },
  ];

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== "id"),
    [columns]
  );

  return (
    <>
      <DataGrid
        columns={visibleColumns}
        rows={rows}
        loading={loading}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 4 } },
        }}
        slots={{
          loadingOverlay: CircularProgress,
          pagination: CustomPagination,
          noResultsOverlay: CustomNoResultsOverlay,
        }}
      />

      {/* Dialog for Viewing User Info */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>Thông tin tài khoản</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <>
              {/* Full Name */}
              <Typography variant="h6" gutterBottom>
                Họ và Tên: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>
              </Typography>

              {/* Address */}
              <Typography variant="h6" gutterBottom>
                Địa chỉ: <strong>{selectedUser.address}</strong>
              </Typography>

              {/* Gender */}
              <Typography variant="h6" gutterBottom>
                Giới tính: <strong>{selectedUser.gender}</strong>
              </Typography>

              {/* Birthday */}
              <Typography variant="h6" gutterBottom>
                Ngày sinh: <strong>{selectedUser.birthday}</strong>
              </Typography>

              {/* Registered PT Services */}
              <Typography variant="h6" gutterBottom>
                Dịch vụ PT đã đăng ký:{" "}
                <strong>{selectedUser.registered_ptservices.join(", ")}</strong>
              </Typography>

              {/* Registered Non-PT Services */}
              <Typography variant="h6" gutterBottom>
                Dịch vụ không phải PT đã đăng ký:{" "}
                <strong>{selectedUser.registered_nonptservices.join(", ")}</strong>
              </Typography>
            </>
          ) : (
            <Typography variant="body1">Không có dữ liệu.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="error"
            variant="contained"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerTable;
