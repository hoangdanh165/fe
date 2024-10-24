import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import Calender from "../../components/base/Calender";
import { Box } from "@mui/material";

const CoachSchedule = () => {
  return (
    <Box m="20px">
      <Calender />
    </Box>
  );
};

export default CoachSchedule;
