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
        //  MOCK DATA FOR TESTING
        const mockData = [
          {
            id: 1, // Add unique id
            customer: {
                first_name: "Nguyen",
                last_name: "Thi Mai",
                address: "123 Pham Ngoc Thach, HCMC",
                gender: "Nữ",
                birthday: "1990-05-15",
                registered_ptservices: ["Personal Training", "Yoga"],
                registered_nonptservices: ["Nutritional Coaching", "Massage Therapy"],
            },
          },
          {
            id: 2, // Add unique id
            customer: {
                first_name: "Nguyen",
                last_name: "Thi Mai",
                address: "123 Pham Ngoc Thach, HCMC",
                gender: "Nữ",
                birthday: "1990-05-15",
                registered_ptservices: ["Personal Training", "Yoga"],
                registered_nonptservices: ["Nutritional Coaching", "Massage Therapy"],
            },
          },
          {
            id: 3, // Add unique id
            customer: {
                first_name: "Nguyen",
                last_name: "Thi Mai",
                address: "123 Pham Ngoc Thach, HCMC",
                gender: "Nữ",
                birthday: "1990-05-15",
                registered_ptservices: ["Personal Training", "Yoga"],
                registered_nonptservices: ["Nutritional Coaching", "Massage Therapy"],
            },
          },
        ];
        // Instead of fetching data from the API, use mockData
        const response = { data: mockData }; 

        //  {** CALL API HERE !! **}
        //   console.log(response.data);
        // const response = await axiosPrivate.get(
        //   "http://127.0.0.1:8000/api/v1/coach-profiles/details/",
        //   {
        //     withCredentials: true,
        //   }
        // );
        console.log(response.data);
        const formattedRows = response.data.map((profile) => ({
            id: profile.id, 
          first_name: profile.customer.first_name,
          last_name: profile.customer.last_name,
          address: profile.customer.address,
          gender: profile.customer.gender,
          registered_ptservices: profile.customer.registered_ptservices,
          registered_nonptservices: profile.customer.registered_nonptservices,
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
