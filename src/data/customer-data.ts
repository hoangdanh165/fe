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
        const formattedRows = response.data.coach_profile.coach_contracts.map((contract) => ({
          id: contract.id,
          start_date: contract.start_date,
          expire_date: contract.expire_date,
          used_sessions: contract.used_sessions,
          customer_profile: [
            {
              id: contract.customer.id,
              first_name: contract.customer.first_name,
              last_name: contract.customer.last_name,
              address: contract.customer.address,
              gender: contract.customer.gender,
              birthday: contract.customer.birthday,
              height: contract.customer.height,
              weight: contract.customer.weight,
              workout_goal: contract.customer.workout_goal,
              phone: contract.customer.phone,
            }
          ],
        
          // PT Service
          registered_ptservices: contract.ptservice
            ? [
                {
                  id: contract.ptservice.id,
                  name: contract.ptservice.name,
                  cost_per_session: contract.ptservice.cost_per_session,
                  number_of_session: contract.ptservice.number_of_session,
                  session_duration: contract.ptservice.session_duration,
                  validity_period: contract.ptservice.validity_period,
                }
              ]
            : [],
        
          // Non-PT Service
          registered_nonptservices: contract.nonptservice
            ? [
                {
                  id: contract.nonptservice.id,
                  discount: contract.nonptservice.discount,
                  cost_per_month: contract.nonptservice.cost_per_month,
                  number_of_month: contract.nonptservice.number_of_month,
                 name: contract.nonptservice.name,
                }
              ]
            : [],
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
