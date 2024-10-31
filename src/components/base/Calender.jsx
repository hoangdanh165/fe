import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";
import { useScheduleData } from "../../data/schedule-data";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import "./Calender.css";

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const { rows, loading, error } = useScheduleData(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCustomer, setNewEventCustomer] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  
  // State for exercises
  const [exercises, setExercises] = useState([]); 
  const [newExercise, setNewExercise] = useState(""); 
  const [openAddExerciseDialog, setOpenAddExerciseDialog] = useState(false); 
  
  useEffect(() => {
    if (!loading && !error) {
      const events = rows.map((row) => ({
        id: row.id,
        title: `${row.overview}`,
        start: `${row.date}T${row.start_time}`,
        end: `${row.date}T${row.end_time}`,
        allDay: false,
        classNames: ["fc-event"],
        extendedProps: {
          customerName: row.customer,
          exerciseDetails: row.exerciseDetails || "No details provided",
        },
      }));
      setCurrentEvents(events);
    }
  }, [rows, loading, error]);

  const handleDateClick = (selected) => {
    setSelectedInfo(selected);
    setOpenDialog(true);
  };

  const handleSaveEvent = () => {
    const calendarApi = selectedInfo.view.calendar;
    calendarApi.unselect();

    if (newEventTitle) {
      calendarApi.addEvent({
        id: `${selectedInfo.dateStr}-${newEventTitle}`,
        title: `${newEventTitle} (${newEventCustomer})`,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
        extendedProps: { customerName: newEventCustomer },
      });
    }

    setOpenDialog(false);
    setNewEventTitle("");
    setNewEventCustomer("");
    setSelectedInfo(null);
  };

  const handleEventClick = (selected) => {
    const event = selected.event;
    setSelectedEvent(event);
    setEventTitle(event.title.split(" (")[0]);
    setCustomerName(event.extendedProps.customerName || "");
    setEventStart(new Date(event.start).toISOString().slice(0, 16));
    setEventEnd(new Date(event.end).toISOString().slice(0, 16));
    setOpenEventDialog(true);
  };

  const handleSaveEditEvent = () => {
    selectedEvent.setProp("title", `${eventTitle} (${customerName})`);
    selectedEvent.setExtendedProp("customerName", customerName);
    selectedEvent.setStart(eventStart);
    selectedEvent.setEnd(eventEnd);
    setOpenEventDialog(false);
  };

  const handleDeleteEvent = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sự kiện '${selectedEvent.title}' không?`
      )
    ) {
      selectedEvent.remove();
      setOpenEventDialog(false);
    }
  };

  const handleAddExercise = () => {
    if (newExercise) {
      setExercises([...exercises, newExercise]);
      setNewExercise("");
      setOpenAddExerciseDialog(false);
    }
  };

  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;
    const startTime = eventInfo.event.start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endTime = eventInfo.event.end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return (
      <Tooltip
        title={`${title} - ${
          extendedProps.customerName || "Không có khách hàng"
        }`}
        arrow
      >
        <span className="fc-event">{`${startTime} - ${endTime}`}</span>
      </Tooltip>
    );
  };

  return (
    <Box m="20px">
      <Box flex="1 1 100%" ml="15px">
        <FullCalendar
          locale="vi"
          height="100vh"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable
          selectable
          selectMirror
          dayMaxEvents
          select={handleDateClick}
          eventClick={handleEventClick}
          events={currentEvents}
          eventContent={renderEventContent}
          buttonText={{
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
          }}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thêm sự kiện mới</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng nhập thông tin cho sự kiện mới.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề"
            fullWidth
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Tên khách hàng"
            fullWidth
            value={newEventCustomer}
            onChange={(e) => setNewEventCustomer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveEvent}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
        <DialogTitle sx={{ mb: "10px" }}>
          Chi tiết sự kiện
          <IconButton
            aria-label="close"
            onClick={() => setOpenEventDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Chỉnh sửa chi tiết sự kiện.</DialogContentText>
          <TextField
            label="Nội dung tổng quát"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Khách hàng"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Thời gian bắt đầu"
            type="datetime-local"
            value={eventStart}
            onChange={(e) => setEventStart(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Thời gian kết thúc"
            type="datetime-local"
            value={eventEnd}
            onChange={(e) => setEventEnd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginTop: 2,
                alignSelf: "flex-start",
                color: "white",
                marginBottom: 2,
              }}
            >
              Danh sách bài tập:
            </Typography>
            <IconButton onClick={() => setOpenAddExerciseDialog(true)}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Render the exercises */}
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <Typography key={index} color="white" variant="body2">
                {exercise}
              </Typography>
            ))
          ) : (
            <Typography color="white" variant="body2">
              Không có bài tập nào.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEvent} color="error">
            Xóa
          </Button>
          <Button onClick={handleSaveEditEvent} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding an exercise */}
      <Dialog open={openAddExerciseDialog} onClose={() => setOpenAddExerciseDialog(false)}>
        <DialogTitle>Thêm bài tập mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên bài tập"
            fullWidth
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddExerciseDialog(false)}>Hủy</Button>
          <Button onClick={handleAddExercise}>Thêm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
