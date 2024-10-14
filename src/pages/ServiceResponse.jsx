import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import { Rating } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MessageIcon from '@mui/icons-material/Message';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ServiceResponse = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchResponses = async (url) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(url);
      setResponses(response.data.results); 
      setNextPageUrl(response.data.next);  
      setPrevPageUrl(response.data.previous); 
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses('/api/v1/service-responses/?page=1'); 
  }, [axiosPrivate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1300, margin: 'auto' }}>
        <Table sx={{ minWidth: 900 }} aria-label="review table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: 'small', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}></TableCell>
              <TableCell align="center" sx={{ fontSize: 'small', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}><strong>KHÁCH HÀNG</strong></TableCell>
              <TableCell align="center" sx={{ fontSize: 'small', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}><strong>LỜI ĐÁNH GIÁ</strong></TableCell>
              <TableCell align="center" sx={{ fontSize: 'small', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}><strong>ĐÁNH GIÁ</strong></TableCell>
              <TableCell align="center" sx={{ fontSize: 'small', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}><strong>TỚI</strong></TableCell>
              <TableCell align="center" sx={{ fontSize: 'small', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}><strong>PHẢN HỒI</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.customer.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  <Avatar src={`/api/v1/customers/${response.customer.id}/avatar`} alt="customer avatar" />
                </TableCell>

                <TableCell align="center" sx={{ fontSize: 'small' }}>
                  {`${response.customer.first_name} ${response.customer.last_name}`}
                </TableCell>

                <TableCell align="center" sx={{ fontSize: 'small' }}>
                  {response.comment}
                </TableCell>

                <TableCell align="center" sx={{ fontSize: 'small' }}>
                  <Rating value={response.score} readOnly />
                </TableCell>

                <TableCell align="center" sx={{ fontSize: 'small' }}>
                  {response.coach ? `${response.coach.first_name} ${response.coach.last_name}` : 'Other Service'}
                </TableCell>

                <TableCell align="center" sx={{ fontSize: 'small' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: 10, height: 40 }}
                  >
                    {response.coach ? <EditIcon fontSize="small" /> : <MessageIcon fontSize="small" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button
          onClick={() => {
            if (prevPageUrl) {
              fetchResponses(prevPageUrl); 
              setCurrentPage((prev) => prev - 1);
            }
          }}
          disabled={!prevPageUrl}
        >
          <ArrowBackIcon />
        </Button>
        <Typography sx={{ margin: '0 20px', alignSelf: 'center' }}>
          Trang {currentPage + 1} / {nextPageUrl ? currentPage + 2 : currentPage + 1}
        </Typography>
        <Button
          onClick={() => {
            if (nextPageUrl) {
              fetchResponses(nextPageUrl); 
              setCurrentPage((prev) => prev + 1);
            }
          }}
          disabled={!nextPageUrl}
        >
         <ArrowForwardIcon/>
        </Button>
      </Box>
    </>
  );
};

export default ServiceResponse;
