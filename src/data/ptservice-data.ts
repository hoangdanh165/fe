import { useState, useEffect } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


export const usePTServicesData = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchPTServices = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/api/v1/pt-services/', 
          {
            withCredentials: true,
          }
        ); 

        // Nếu backend có pagination thì response.data.results
        const formattedRows = response.data.map((ptservice) => ({
          id: ptservice.id,
          start_date: ptservice.start_date,
          expire_date: ptservice.expire_date,
          discount: ptservice.discount,
          session_duration: ptservice.session_duration, 
          cost_per_session: ptservice.cost_per_session, 
          validity_period: ptservice.validity_period, 
          name: ptservice.name, 
        }));

        
        setRows(formattedRows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPTServices();

  }, [reloadTrigger]);

  return { rows, loading, error };
};
