import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useScheduleData } from "../../data/schedule-data"; // Import the hook to get schedules
import CloseIcon from '@mui/icons-material/Close';
const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const { rows, loading, error } = useScheduleData(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState(""); 
  const [eventStart, setEventStart] = useState(""); 
  const [eventEnd, setEventEnd] = useState(""); 



  useEffect(() => {
    if (!loading && !error) {
      const events = rows.map((row) => ({
        id: row.id,
        title: row.overview,
        start: `${row.date}T${row.starttime}`,
        end: `${row.date}T${row.endtime}`,
        allDay: false,
      }));

      setCurrentEvents(events);
    }
  }, [rows, loading, error]);

  // Handle Date Click (Open Dialog instead of Prompt)
  const handleDateClick = (selected) => {
    setSelectedInfo(selected);
    setOpenDialog(true); // Open the dialog
  };

  // Handle Save Event after Dialog submission
  const handleSaveEvent = () => {
    const calendarApi = selectedInfo.view.calendar;
    calendarApi.unselect();

    if (newEventTitle) {
      calendarApi.addEvent({
        id: `${selectedInfo.dateStr}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
      });
    }

    // Close the dialog and reset state
    setOpenDialog(false);
    setNewEventTitle("");
    setSelectedInfo(null);
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event); // Save the selected event
    setEventTitle(selected.event.title); // Set initial event title
    setEventStart(new Date(selected.event.start).toISOString().slice(0, 16)); // Format for datetime-local input
    setEventEnd(new Date(selected.event.end).toISOString().slice(0, 16)); // Format for datetime-local input
    setOpenEventDialog(true); // Open the dialog to show event details
  };
  const handleDeleteEvent = () => {
    if (window.confirm(`Are you sure you want to delete the event '${selectedEvent.title}'?`)) {
      selectedEvent.remove(); // Remove the event
      setOpenEventDialog(false); // Close the dialog after deletion
    }
  };
  const handleSaveEditEvent = () => {
    selectedEvent.setProp("title", eventTitle); // Update event title
    selectedEvent.setStart(eventStart); // Update event start time
    selectedEvent.setEnd(eventEnd); // Update event end time
    setOpenEventDialog(false); // Close the dialog after saving
  };

  return (
    <Box m="20px">
      <Box flex="1 1 100%" ml="15px">
        <FullCalendar
          height="125vh"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick} // Open dialog on date click
          eventClick={handleEventClick}
          events={currentEvents}
        />
      </Box>

      {/* Dialog for adding new event */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details for your new event.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEvent}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
        <DialogTitle>
          Event Details
          <IconButton
            aria-label="close"
            onClick={() => setOpenEventDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the event details below:
          </DialogContentText>
          <TextField
            label="Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={eventStart}
            onChange={(e) => setEventStart(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={eventEnd}
            onChange={(e) => setEventEnd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEvent} color="error">
            Delete
          </Button>
          <Button onClick={handleSaveEditEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    
    </Box>
    
  );
};

export default Calendar;
