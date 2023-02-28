import React, { useEffect, useState } from "react";
import Groups3Icon from "@mui/icons-material/Groups3";
import DvrIcon from "@mui/icons-material/Dvr";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { blue, yellow } from "@mui/material/colors";
import { baseUrl } from "../APIs/BaseURL";
import { useSelector } from "react-redux";

const Home = () => {
  const employees = useSelector((state)=>state.employees.employees)
  const departments = useSelector((state)=>state.departments.departments)
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Card
          sx={{
            minWidth: 345,
            alignItems: "center",
            background: yellow[500],
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingX: "3rem",
            }}
          >
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Groups3Icon sx={{ fontSize: "3rem" }} />
              <Typography variant="h5" component="div">
                Employees
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 500 }}>
              {employees.length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 345,
            alignItems: "center",
            background: blue[400],
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingX: "3rem",
            }}
          >
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <DvrIcon sx={{ fontSize: "3rem" }} />
              <Typography variant="h5" component="div">
                Departments
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 500 }}>
              {departments.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Home;
