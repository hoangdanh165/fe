import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatInTimeZone } from 'date-fns-tz'
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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import IconifyIcon from "./IconifyIcon";
import { useScheduleData } from "../../data/schedule-data";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import "./Calender.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventNote, setEventNote] = useState("");
  const [coachId, setCoachId] = useState("");
  const [customerId, setCustomerId] = useState("");

  // State for exercises
  const [exercises, setExercises] = useState([]); // All exercises in system
  const [customers, setCustomers] = useState([]); // All customers of current coach
  const [currentExercises, setCurrentExercises] = useState([]); // Exercise list for each workout schedule
  const [categories, setCategories] = useState([]); // All distinct categories from all exercises
  const [selectedExercise, setSelectedExercise] = useState(""); // Selected exercise for adding to workout schedule
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openAddExerciseDialog, setOpenAddExerciseDialog] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const timeZone = 'Asia/Ho_Chi_Minh';

  useEffect(() => {
    if (!loading && !error) {
      const events = rows.map((row) => ({
        id: row.id,
        title: `${row.overview}`,
        start: `${row.start_time}`,
        end: `${row.end_time}`,
        allDay: false,
        classNames: ["fc-event"],
        backgroundColor: row.customer_color,
        borderColor: row.customer_color,
        extendedProps: {
          customerId: row.customer_id,
          customerName: `${row.customer_name}`,
          exercises: row.exercises,
          note: row.note,
        },
      }));
      setCurrentEvents(events);
      console.log(events);
    }
  }, [rows, loading, error]);

  const fetchAllExercises = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/exercises/", {
        withCredentials: true,
      });

      const formattedRows = response.data.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        duration: exercise.duration,
        repetitions: exercise.repetitions,
        image_url: exercise.image_url,
        rest_period: exercise.rest_period,
        categories: exercise.categories,
      }));

      setExercises(formattedRows);

      const distinctCategories = [
        ...new Map(
          response.data.flatMap((exercise) =>
            exercise.categories.map((category) => [category.id, category])
          )
        ).values(),
      ];
      setCategories(distinctCategories);
    } catch (err) {
      console.log("Error fetching exercises: ", err);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      const response = await axiosPrivate.get(
        "/api/v1/coach-profiles/get-customers/",
        {
          withCredentials: true,
        }
      );

      const formattedRows = response.data.customers.map((customer) => ({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        address: customer.address,
        gender: customer.gender,
        birthday: customer.birthday,
        avatar: customer.avatar,
      }));
      
      setCoachId(response.data.coach_id);
      console.log(response.data.coach_id);
      setCustomers(formattedRows);
    } catch (err) {
      console.log("Error fetching exercises: ", err);
    }
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    if (selectedCategories.length === 0) {
      return true;
    }

    return selectedCategories.every((selectedCategoryId) =>
      exercise.categories.some(
        (exerciseCategory) => exerciseCategory.id === selectedCategoryId
      )
    );
  });

  const handleDateClick = (selected) => {
    setSelectedInfo(selected);
    setOpenDialog(true);
  };

  const handleSaveEvent = () => {
    const calendarApi = selectedInfo.view.calendar;
    calendarApi.unselect();

    if (newEventTitle && newEventCustomer) {
      const customer = customers.find((c) => c.id === newEventCustomer);

      calendarApi.addEvent({
        title: `${newEventTitle}`,
        start: selectedInfo.startStr + "T00:00:00",
        end: selectedInfo.endStr + "T00:00:00",
        
        allDay: false,
        extendedProps: {
          customerId: newEventCustomer,
          customerName: customer.first_name + " " + customer.last_name,
        },
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

    setEventTitle(event.title ? event.title.split(" (")[0] : "");

    setCustomerId(event.extendedProps?.customerId || "");

    const startTime = event.start ? formatInTimeZone(event.start, timeZone, 'yyyy-MM-dd\'T\'HH:mm') : "";
    const endTime = event.end ? formatInTimeZone(event.end, timeZone, 'yyyy-MM-dd\'T\'HH:mm') : "";

    setEventStart(startTime);
    setEventEnd(endTime);

    console.log(startTime, endTime);
    setEventNote(event.extendedProps?.note || "");

    setCurrentExercises(event.extendedProps?.exercises || []);

    fetchAllExercises();
    setOpenEventDialog(true);
  };

  const handleSaveEditEvent = () => {
    selectedEvent.setProp("title", `${eventTitle} (${customerId})`);
    selectedEvent.setExtendedProp("customerId", customerId);
    selectedEvent.setStart(eventStart);
    selectedEvent.setEnd(eventEnd);
    setOpenEventDialog(false);
  };

  const handleSaveAddEvent = async () => {

    if (!eventTitle || !customerId || !eventStart || !eventEnd) {
      alert("Vui lòng điền đầy đủ thông tin buổi tập!");
      return;
    }

    const startTime = new Date(eventStart);
    const endTime = new Date(eventEnd);

    if (startTime >= endTime) {
      alert("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
      return;
    }

    const isOverlapping = (start, end) => {
      return currentEvents.some((event) => {
        const existingStart = new Date(event.start);
        const existingEnd = new Date(event.end);
        return (
          (start >= existingStart && start < existingEnd) ||
          (end > existingStart && end <= existingEnd) ||
          (start <= existingStart && end >= existingEnd)
        );
      });
    };

    if (isOverlapping(startTime, endTime)) {
      alert("Buổi tập trùng giờ với một buổi tập khác. Vui lòng chọn thời gian khác.");
      return;
    }

    try {
      const eventData = {
        overview: eventTitle,
        customer: customerId,
        coach: coachId,
        start_time: eventStart,
        end_time: eventEnd,
        note: eventNote,
        exercises: currentExercises.map(exercise => exercise.id)
      };
      const startTime = new Date(eventStart);
      const endTime = new Date(eventEnd);
      const duration = (endTime - startTime) / (1000 * 60); 

      eventData.duration = duration;
      
      let response;
      if (selectedEvent.id) {
        response = await axiosPrivate.patch(
          `/api/v1/workout-schedules/${selectedEvent.id}/`,
          eventData,
          {
            withCredentials: true,
          }
        );
      } else {
        response = await axiosPrivate.post(
          '/api/v1/workout-schedules/',
          eventData,
          {
            withCredentials: true,
          }
        );
      }

      if (response.data) {
        const updatedEvent = {
          id: response.data.id,
          title: `${eventTitle}`,
          start: `${eventStart}`,
          end: `${eventEnd}`,
          allDay: false,
          extendedProps: {
            customerId: customerId,
            customerName: customers.find(c => c.id === customerId)?.first_name + " " + 
                         customers.find(c => c.id === customerId)?.last_name,
            exercises: currentExercises,
            note: eventNote
          }
        };

        if (selectedEvent.id) {
          selectedEvent.setProp('title', updatedEvent.title);
          selectedEvent.setStart(updatedEvent.start);
          selectedEvent.setEnd(updatedEvent.end);
          selectedEvent.setExtendedProp('customerId', updatedEvent.extendedProps.customerId);
          selectedEvent.setExtendedProp('customerName', updatedEvent.extendedProps.customerName);
          selectedEvent.setExtendedProp('exercises', updatedEvent.extendedProps.exercises);
          selectedEvent.setExtendedProp('note', updatedEvent.extendedProps.note);
        } else {
          const calendarApi = selectedEvent.view.calendar;
          calendarApi.addEvent(updatedEvent);
        }

        setOpenEventDialog(false);
        setEventTitle("");
        setCustomerId("");
        setEventStart("");
        setEventEnd("");
        setEventNote("");
        setCurrentExercises([]);
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error("Error saving workout schedule:", err);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa buổi tập này không?`)) {
      try {
        await axiosPrivate.delete(
          `/api/v1/workout-schedules/${selectedEvent.id}/`, 
          { withCredentials: true }  
        );
        
        selectedEvent.remove();
        setOpenEventDialog(false);
      }
      catch (err) {
        console.error("Error deleting workout schedule:", err);
      }
      alert("Xoá buổi tập thành công!");
    }
  };
  

  const handleAddExercise = () => {
    if (selectedExercise) {
      const exerciseToAdd = exercises.find((ex) => ex.id === selectedExercise);
      
      const isExerciseAlreadyAdded = currentExercises.some(
        (ex) => ex.id === selectedExercise
      );
  
      if (isExerciseAlreadyAdded) {
        alert("Bài tập này đã có trong danh sách.");
      } else {
        setCurrentExercises([...currentExercises, exerciseToAdd]);
        setSelectedExercise("");
        setOpenAddExerciseDialog(false);
        setSelectedCategories([]);
      }
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
        arrow
        title={
          <>
            <Typography variant="body2" color="inherit">
              Tổng quan: {title}
            </Typography>
            <Typography variant="body2">
              Khách hàng: {extendedProps.customerName}
            </Typography>
            <Typography variant="body2">
              Bài tập:{" "}
              {extendedProps.exercises && extendedProps.exercises.length > 0
                ? extendedProps.exercises.map((exercise) => (
                    <div key={exercise.id}> - {exercise.name}</div>
                  ))
                : "Chưa có bài tập nào."}
            </Typography>
          </>
        }
        PopperProps={{
          modifiers: [
            {
              name: "zIndex",
              enabled: true,
              options: {
                zIndex: 1500, 
              },
            },
          ],
        }}
      >
        <span
          className="fc-event"
          style={{
            backgroundColor: eventInfo.event.backgroundColor,
            borderColor: eventInfo.event.borderColor,
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            display: "block",
            margin: "0 5px",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          {`${startTime} - ${endTime}`}
        </span>
      </Tooltip>
    );
  };

  const handleDeleteExercise = (id) => {
    setCurrentExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id)
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
        <DialogTitle sx={{ alignSelf: 'center'}}>THÊM BUỔI TẬP MỚI</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
          <FormControl
              sx={{
                width: "350px",
              }}
              margin="dense"
            >
              <InputLabel sx={{ marginBottom: 2 }}>Khách hàng</InputLabel>
              <Select
                value={newEventCustomer}
                onChange={(e) => setNewEventCustomer(e.target.value)}
                label="Khách hàng"
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              autoFocus
              margin="dense"
              label="Tổng quan buổi tập"
              fullWidth
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveEvent}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
        <DialogTitle sx={{ mb: "10px", alignSelf: 'center' }}>
          CHI TIẾT BUỔI TẬP
          <IconButton
            aria-label="close"
            onClick={() => setOpenEventDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ marginBottom: 2 }}>Khách hàng</InputLabel>
            <Select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              label="Khách hàng"
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Tổng quan buổi tập"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
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
          <TextField
            label="Ghi chú"
            type="text"
            value={eventNote}
            onChange={(e) => setEventNote(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            placeholder={eventNote ? "" : "Thêm ghi chú cho buổi tập này..."}
            multiline
            rows={4}
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                height: "auto",
              },
            }}
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
              Danh sách bài tập: {currentExercises.length} bài
            </Typography>
            <IconButton onClick={() => setOpenAddExerciseDialog(true)}>
              <AddIcon />
            </IconButton>
          </Box>

          {currentExercises.length > 0 ? (
            <Stack
              direction="column"
              spacing={1}
              alignSelf="flex-start"
              width="100%"
            >
              {currentExercises.map((currentExercise) => (
                <Box
                  key={currentExercise.id}
                  sx={{
                    border: "1px solid wheat",
                    borderRadius: 1,
                    padding: 1,
                    width: "100%",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      marginLeft: 2,
                      color: "white",
                      width: "350px",
                    }}
                  >
                    <Tooltip title="Tên bài tập" arrow>
                      <span>{currentExercise.name}</span>
                    </Tooltip>
                  </Typography>

                  <Typography
                    sx={{
                      marginLeft: 2,
                      color: "white",
                      width: "120px",
                      fontSize: "12px",
                    }}
                  >
                    <Tooltip title="Thời lượng bài tập" arrow>
                      <span>{currentExercise.duration} giây</span>
                    </Tooltip>
                  </Typography>

                  <Typography
                    sx={{
                      marginLeft: 4,
                      color: "white",
                      width: "170px",
                      fontSize: "12px",
                    }}
                  >
                    <Tooltip
                      title="Số lần lặp lại (số hiệp tập x số lần mỗi hiệp)"
                      arrow
                    >
                      <span>{currentExercise.repetitions}</span>
                    </Tooltip>
                  </Typography>

                  <Typography
                    sx={{
                      marginLeft: 4,
                      color: "white",
                      width: "100px",
                      fontSize: "12px",
                    }}
                  >
                    <Tooltip title="Thời gian nghỉ" arrow>
                      <span>{currentExercise.rest_period} giây</span>
                    </Tooltip>
                  </Typography>

                  <Typography
                    sx={{
                      marginLeft: 4,
                      color: "white",
                      width: "500px",
                      fontSize: "12px",
                      marginRight: 2,
                    }}
                  >
                    <Tooltip title="Tác động tới" arrow>
                      <span>
                        {currentExercise.categories
                          .map((category) => category.name)
                          .join(", ")}
                      </span>
                    </Tooltip>
                  </Typography>

                  <IconButton
                    onClick={() => handleDeleteExercise(currentExercise.id)}
                  >
                    <IconifyIcon icon="mdi:minus" color="white" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1">Chưa có bài tập.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEvent} color="error">
            Xóa
          </Button>
          <Button 
            onClick={handleSaveAddEvent} 
            color="primary"
            disabled={!eventTitle || !customerId || !eventStart || !eventEnd}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding an exercise */}
      <Dialog
        open={openAddExerciseDialog}
        onClose={() => {
          setOpenAddExerciseDialog(false);
          setSelectedCategories([]);
          setSelectedExercise("");
        }}
      >
        <DialogTitle>Thêm bài tập</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl
              sx={{
                width: "300px",
                alignSelf: "left",
                marginLeft: 3,
                marginRight: 3,
              }}
              margin="dense"
            >
              <InputLabel sx={{ marginBottom: 2 }}>
                Mục tiêu tác động
              </InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={(e) => setSelectedCategories(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="dense"
              sx={{
                width: "300px",
                alignSelf: "left",
                marginLeft: 3,
                marginRight: 3,
              }}
            >
              <InputLabel sx={{ marginBottom: 2 }}>Tên bài tập</InputLabel>
              <Select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                label="Tên bài tập"
                sx={{ marginBottom: 5 }}
              >
                {filteredExercises && filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
                    <MenuItem key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {selectedCategories.length > 0
                      ? "Không có bài tập phù hợp"
                      : "Vui lòng chọn mục tiêu tác động"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
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
