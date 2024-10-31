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
        const response = await axiosPrivate.get("/api/v1/workout-schedules/", {
          withCredentials: true,
        });
        const userIds = response.data.map((schedule) => schedule.customer);
        console.log(userIds);
        
        const allUserInfos: any[] = [];
        let nextPageUrl = "http://127.0.0.1:8000/api/v1/customer-profiles/";
        
        while (nextPageUrl) {
          const userresponse = await axiosPrivate.get(nextPageUrl,{
            withCredentials: true,
          });
          console.log(userresponse.data);
          const { results, next } = userresponse.data;
          allUserInfos.push(...results);
          nextPageUrl = next;
        }
        
        const filteredUserInfos = allUserInfos.filter((userInfo) => userIds.includes(userInfo.customer));
        console.log(filteredUserInfos);
        const formattedRows = response.data.map((schedule) => {
          const userInfo = filteredUserInfos.find((userInfo) => userInfo.customer === schedule.customer);
          return {
            id: schedule.id,
            customer: `${userInfo.first_name} ${userInfo.last_name}`,
            date: schedule.date,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            duration: schedule.duration,
            overview: schedule.overview,
          };
        });

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
