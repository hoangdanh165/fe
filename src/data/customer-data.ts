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

        const response = await axiosPrivate.get(
          "/api/v1/coach-profiles/details/",
          {
            withCredentials: true,
          }
        );

        const formattedRows = response.data.coach_contracts.map((contract) => ({
          id: contract.id,
          start_date: contract.start_date,
          expire_date: contract.expire_date,
          used_sessions: contract.used_sessions,
          customer_profile: {
            id: contract.customer.id,
            first_name: contract.customer.first_name,
            last_name: contract.customer.last_name,
            avatar: contract.customer.avatar,
            address: contract.customer.address,
            gender: contract.customer.gender,
            birthday: contract.customer.birthday,
            height: contract.customer.height,
            weight: contract.customer.weight,
            phone: contract.customer.phone,
            email: contract.customer.email,
            health_condition: contract.customer.health_condition,
            workout_goal: contract.customer.workout_goal
              ? {
                  weight: contract.customer.workout_goal.weight,
                  body_fat: contract.customer.workout_goal.body_fat,
                  muscle_mass: contract.customer.workout_goal.muscle_mass,
                }
              : null,
          },

          // PT Service
          registered_ptservices: contract.ptservice
            ? [
                {
                  id: contract.ptservice.id,
                  name: contract.ptservice.name,
                  cost_per_session: contract.ptservice.cost_per_session,
                  session_duration: contract.ptservice.session_duration,
                  validity_period: contract.ptservice.validity_period,
                },
              ]
            : [],

          // Non-PT Service (if available)
          registered_nonptservices: contract.nonptservice
            ? [
                {
                  id: contract.nonptservice.id,
                  name: contract.nonptservice.name,
                  discount: contract.nonptservice.discount,
                  cost_per_month: contract.nonptservice.cost_per_month,
                  number_of_month: contract.nonptservice.number_of_month,
                },
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
