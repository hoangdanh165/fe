import { useState, useEffect } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


export const useTrainingPlanData = (reloadTrigger: number, selectedValue: string) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        setLoading(true);

        const url = selectedValue
          ? `/api/v1/training-plans/get-by-customers?customer=${selectedValue}`
          : `/api/v1/training-plans/get-by-customers/`;

        const response = await axiosPrivate.get(url, 
          {
            withCredentials: true,
          }
        ); 

        // Nếu backend có pagination thì response.data.results
        const formattedRows = response.data.training_plans.map((tp) => ({
          id: tp.id,
          note: tp.note,
          overview: tp.overview,
          estimated_duration: tp.estimated_duration,
          customer: {
            id: tp.customer.id,
            first_name: tp.customer.first_name,
            last_name: tp.customer.last_name,
            gender: tp.customer.gender,
            birthday: tp.customer.birthday,
            phone: tp.customer.phone,
            height: tp.customer.height,
            weight: tp.customer.weight,
            health_condition: tp.customer.health_condition,
            workout_goal: {
              body_fat: tp.customer.workout_goal.body_fat,
              weight: tp.customer.workout_goal.weight,
              muscle_mass: tp.customer.workout_goal.muscle_mass,
            }
          },
          exercises: tp.exercises,
          
        }));

        
        setRows(formattedRows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlans();

  }, [reloadTrigger]);

  return { rows, loading, error };
};
