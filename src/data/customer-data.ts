import { useState, useEffect } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useCustomerData = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        //  {** CALL API HERE !! **}
        const response = await axiosPrivate.get(
          "http://127.0.0.1:8000/api/v1/coach-profiles/details/",
          {
            withCredentials: true,
          }
        );
        console.log(response.data);

        const formattedRows = response.data.customers.map((profile) => ({
            id: profile.id, 
          first_name: profile.first_name,
          last_name: profile.last_name,
          address: profile.address,
          gender: profile.gender,
          birthday: profile.birthday,
          registered_ptservices: profile.registered_ptservices.map(service => (
            {
              id: service.id,
              name: service.name,
              cost_per_session: service.cost_per_session,
              start_date: service.start_date,
              number_of_session: service.number_of_session,
              session_duration: service.session_duration,
              expire_date: service.expire_date,
              validity_period: service.validity_period,
            }
          )), 
          
          registered_nonptservices: profile.registered_nonptservices.map(service => (
            {
              id: service.id,
              name: service.name,
              cost_per_month: service.cost_per_month,
              start_date: service.start_date,
              number_of_month: service.number_of_month,
              expire_date: service.expire_date,
            }
          )),  
        }));

        setRows(formattedRows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [reloadTrigger]);

  return { rows, loading, error };
};
