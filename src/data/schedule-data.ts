import { useState, useEffect } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useScheduleData = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/api/v1/workout-schedules/", {
          withCredentials: true,
        });

        const formattedRows = response.data.map((ws) => ({
          id: ws.id,
          
          customer_id: ws.customer.id,
          customer_name: `${ws.customer.first_name} ${ws.customer.last_name}`,
          customer_address: ws.customer.address,
          customer_gender: ws.customer.gender,
          customer_birthday: ws.customer.birthday,
          customer_avatar: ws.customer.avatar,
          customer_color: getRandomColor(),

          coach_id: ws.coach.id,
          coach_name: `${ws.coach.first_name} ${ws.coach.last_name}`,
          coach_avatar: ws.coach.avatar,
          coach_address: ws.coach.address,
          coach_gender: ws.coach.gender,
          coach_birthday: ws.coach.birthday,
          coach_height: ws.coach.height,
          coach_weight: ws.coach.weight,
          coach_start_date: ws.coach.start_date,
        
          start_time: ws.start_time,
          end_time: ws.end_time,
          duration: ws.duration,
          overview: ws.overview,
          note: ws.note,
          
          exercises: ws.exercises.map((e) => ({
            id: e.id,
            name: e.name,
            duration: e.duration,
            repetitions: e.repetitions,
            image_url: e.image_url,
            rest_period: e.rest_period,
            categories: e.categories
          })),
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
