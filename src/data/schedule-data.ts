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
        const response = await axiosPrivate.get('/api/v1/workout-schedules/', 
          {
            withCredentials: true,
          }
        ); 

        const formattedRows = response.data.map((schedule) => ({
          id: schedule.id,
          date: schedule.date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
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
