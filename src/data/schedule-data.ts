import { useState, useEffect } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useScheduleData = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const mockData = [
          {
            id: 1,
            date: "2024-10-14",
            starttime: "09:00",
            endtime: "10:00",
            duration: 60, 
            overview: "Team meeting",
          },
          {
            id: 2,
            date: "2024-10-15",
            starttime: "11:00",
            endtime: "12:00",
            duration: 60,
            overview: "Project review",
          },
          {
            id: 3,
            date: "2024-10-16",
            starttime: "14:00",
            endtime: "15:30",
            duration: 90,
            overview: "Client presentation",
          },
          {
            id: 4,
            date: "2024-10-17",
            starttime: "16:00",
            endtime: "17:00",
            duration: 60,
            overview: "Sales call",
          },
          {
            id: 5,
            date: "2024-10-18",
            starttime: "09:00",
            endtime: "09:45",
            duration: 45,
            overview: "Daily stand-up",
          },
          {
            id: 6,
            date: "2024-10-19",
            starttime: "10:00",
            endtime: "11:30",
            duration: 90,
            overview: "Code review session",
          },
          {
            id: 7,
            date: "2024-10-20",
            starttime: "13:00",
            endtime: "14:00",
            duration: 60,
            overview: "Marketing strategy meeting",
          },
          {
            id: 8,
            date: "2024-10-21",
            starttime: "15:00",
            endtime: "16:00",
            duration: 60,
            overview: "Training session",
          },
          {
            id: 9,
            date: "2024-10-22",
            starttime: "12:00",
            endtime: "13:00",
            duration: 60,
            overview: "HR policies update",
          },
          {
            id: 10,
            date: "2024-10-23",
            starttime: "14:00",
            endtime: "15:00",
            duration: 60,
            overview: "Budget planning",
          },
        ];

        // Simulate API response
        const response = { data: mockData };

        const formattedRows = response.data.map((schedule) => ({
          id: schedule.id,
          date: schedule.date,
          starttime: schedule.starttime,
          endtime: schedule.endtime,
          duration: schedule.duration, 
          overview: schedule.overview,
        }));

        setRows(formattedRows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [reloadTrigger]);

  return { rows, loading, error };
};
