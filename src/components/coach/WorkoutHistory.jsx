import React, { useEffect, useState, useMemo } from "react";
import { useScheduleData } from "../../data/schedule-data";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Checkbox,
  TextField,
  MenuItem,
  Select,
  Button,
  IconButton,
  DialogContent,
  DialogActions,
  DialogTitle,
  Dialog,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const WorkoutHistory = () => {
  const { rows, loading, error } = useScheduleData(0);
  const [rowsData, setRowsData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [customers, setCustomers] = useState([]);
  const [filteredData, setFilteredData] = useState(rowsData);
  const [customerFilter, setCustomerFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [completedFilter, setCompletedFilter] = useState(null);
  const [attendanceFilter, setAttendanceFilter] = useState(null);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);

  const fetchAllCustomers = async () => {
    try {
      const response = await axiosPrivate.get(
        "/api/v1/coach-profiles/get-customers/"
      );

      const formattedRows = response.data.customers.map((customer) => ({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        address: customer.address,
        gender: customer.gender,
        birthday: customer.birthday,
        avatar: customer.avatar,
        customer_user_id: customer.customer_user_id,
        used_sessions: customer.used_sessions,
        total_sessions: customer.total_sessions,
        contract_id: customer.contract_id,
      }));

      setCustomers(formattedRows);
    } catch (err) {
      console.log("Error fetching exercises: ", err);
    }
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return "";
    }
  };

  const handleCustomerFilterChange = (event) => {
    setCustomerFilter(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDateFilter(event.target.value);
  };

  const handleCompletedFilterChange = (event) => {
    setCompletedFilter(event.target.checked);
  };

  const handleAttendanceFilterChange = (event) => {
    setAttendanceFilter(event.target.checked);
  };

  const handleEndDateChange = (event) => {
    setEndDateFilter(event.target.value);
  };

  const handleClearFilters = () => {
    setCustomerFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setCompletedFilter(null);
    setAttendanceFilter(null);
    setFilterPopupOpen(false);
  };

  useEffect(() => {
    if (Array.isArray(rows) && rows.length > 0) {
      const formattedRows = rows.map((row) => ({
        id: row?.id || Math.random().toString(),
        customer_name: row?.customer_name || "Không có tên",
        training_plan: row?.training_plan || null,
        start_time: row?.start_time || "",
        end_time: row?.end_time || "",
        completed: row?.completed ?? false,
        attendance: row?.attendance ?? false,
      }));
      setRowsData(formattedRows);
    }
  }, [rows]);

  useEffect(() => {
    let filtered = rowsData;

    if (customerFilter) {
      filtered = filtered.filter((row) =>
        row.customer_name.toLowerCase().includes(customerFilter.toLowerCase())
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter(
        (row) => new Date(row.start_time) >= new Date(startDateFilter)
      );
    }

    if (endDateFilter) {
      filtered = filtered.filter(
        (row) => new Date(row.end_time) <= new Date(endDateFilter)
      );
    }

    if (completedFilter !== null) {
      filtered = filtered.filter(
        (row) => Boolean(row.completed) === Boolean(completedFilter)
      );
    }

    if (attendanceFilter !== null) {
      filtered = filtered.filter(
        (row) => Boolean(row.attendance) === Boolean(attendanceFilter)
      );
    }

    setFilteredData(filtered);
  }, [customerFilter, startDateFilter, endDateFilter, completedFilter, attendanceFilter, rowsData]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      resizable: false,
      flex: 1,
      minWidth: 140,
      headerAlign: "center",
    },
    {
      field: "customer_name",
      headerName: "Khách hàng",
      headerClassName: "super-app-theme--header",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row?.customer_name || "Không có tên"}
        </Typography>
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "training_plan",
      headerName: "Buổi tập",
      width: 300,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row?.training_plan?.overview || "Không có giáo án"}
        </Typography>
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Ngày",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatDate(params.row?.start_time)}
        </Typography>
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "start_time",
      headerName: "Giờ bắt đầu",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatTime(params.row?.start_time)}
        </Typography>
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "end_time",
      headerName: "Giờ kết thúc",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatTime(params.row?.end_time)}
        </Typography>
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "attendance",
      headerName: "Khách hàng có mặt",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.attendance}
          disabled
          color={params.row?.attendance ? "success" : "error"}
        />
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "completed",
      headerName: "Đã hoàn thành",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.completed}
          disabled
          color={params.row?.completed ? "success" : "error"}
        />
      ),
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];

  const visibleColumns = useMemo(
    () => columns.filter((column) => !["id", "attendance"].includes(column.field)),
    [columns]
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">Có lỗi xảy ra khi tải dữ liệu!</Typography>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom mb={4} align="center">
        LỊCH SỬ CÁC BUỔI DẠY
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        sx={{ position: "relative", zIndex: 2 }}
      >
        <Typography variant="h6" mr={2}>
          Lọc dữ liệu
        </Typography>
        <IconButton
          onClick={() => setFilterPopupOpen(true)}
          color="primary"
          aria-label="open filter popup"
        >
          <AddIcon />
        </IconButton>
      </Box>
      {filteredData.length === 0 ? (
        <Typography variant="body1">Không có buổi tập nào đã qua.</Typography>
      ) : (
        <DataGrid
          rows={filteredData}
          columns={visibleColumns}
          pageSize={6}
          rowsPerPageOptions={[6]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          pageSizeOptions={[6, 8, 10]}
          density="comfortable"
          disableSelectionOnClick
        />
      )}
      <Dialog
        open={filterPopupOpen}
        onClose={() => setFilterPopupOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle align="center">BỘ LỌC</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} flexDirection="column">
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              Khách hàng
            </Typography>
            <Select
              value={customerFilter}
              onChange={handleCustomerFilterChange}
              displayEmpty
              fullWidth
              sx={{
                minWidth: 200,

                marginBottom: 3,
              }}
              renderValue={customerFilter ? undefined : () => "Chọn khách hàng"}
            >
              <MenuItem value="">
                <em>Chọn khách hàng</em>
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem
                  key={customer.id}
                  value={`${customer.first_name} ${customer.last_name}`}
                >
                  {customer.first_name} {customer.last_name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle1" fontWeight="bold" color="white">
              Từ ngày
            </Typography>
            <TextField
              label="Từ ngày"
              type="date"
              value={startDateFilter}
              onChange={handleStartDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                height: 40,
                marginBottom: 6,
              }}
            />
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              Đến ngày
            </Typography>
            <TextField
              label="Đến ngày"
              type="date"
              value={endDateFilter}
              onChange={handleEndDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                height: 40,
                marginBottom: 10,
              }}
            />
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              Khác
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={completedFilter}
                onChange={handleCompletedFilterChange}
                color="primary"
                sx={{ color: "white" }}
              />
              <Typography variant="body1" fontWeight="bold" color="white">
                Đã hoàn thành
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={attendanceFilter}
                onChange={handleAttendanceFilterChange}
                color="primary"
                sx={{ color: "white" }}
              />
              <Typography variant="body1" fontWeight="bold" color="white">
                Khách hàng có mặt
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClearFilters()} color="secondary">
            Xóa bộ lọc
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutHistory;
