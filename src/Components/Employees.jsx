import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Rating,
  Select,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../APIs/BaseURL";
import { toast } from "react-hot-toast";
import { addEmployee } from "../Redux/employeeSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Employees = () => {
  const employees = useSelector((state) => state.employees.employees);
  const departments = useSelector((state) => state.departments.departments);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [salaryErr, setSalaryErr] = useState("");
  const [ratingErr, setRatingErr] = useState("");
  const [deptErr, setDeptErr] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [rating, setRating] = useState("");

  //Add new employee
  const addNewEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employee = {
      name: formData.get("name"),
      department: formData.get("department"),
      salary: formData.get("salary"),
      rating: formData.get("rating"),
    };
    if (rating === "") {
      setRatingErr("Rate employee");
    } else if (department === "") {
      setDeptErr(true);
    } else {
      setDeptErr(false);
      setRatingErr(null);
      try {
        const { data } = await baseUrl.post("/add-employee", employee);
        if (data.message === "Success") {
          toast("Data created successfully", {
            icon: "✅",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setModal(false);
          setName("");
          setSalary("");
          setDepartment("");
          setRating("");
          const { name, salary, rating } = employee;
          const updatedEmployee = {
            name: name,
            salary: salary,
            rating: rating,
            department: data.dept,
          };
          dispatch(addEmployee(updatedEmployee));
        }
      } catch (err) {
        console.log(err);
        toast("Something went wrong", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ mb: "1rem" }}>
        <Button
          onClick={() => {
            if (!departments) {
              toast(
                "You need to add a department first",
                {
                  icon: "⚠️",
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                }
              );
            } else {
              setModal(true);
            }
          }}
          variant="contained"
          color="primary"
          sx={{ fontWeight: "600" }}
        >
          Add Employee
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "600", fontSize: 16 }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: 16 }} align="right">
                Department
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: 16 }} align="right">
                Salary
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: 16 }} align="right">
                Rating
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? employees.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : employees
            ).map((data, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {data?.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {data?.department.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {data?.salary}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {data?.rating}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter sx={{ marginRight: 0 }}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={employees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Modal */}
      <div>
        <Modal
          open={modal}
          onClose={() => {
            setModal(false);
          }}
          aria-labelledby=""
          aria-describedby=""
        >
          <Box sx={modalStyle}>
            <Typography
              sx={{ textAlign: "center", mb: "0.5rem" }}
              id=""
              variant="h5"
              component="h2"
            >
              Add Employee
            </Typography>
            <Divider />
            <Box
              component="form"
              onSubmit={addNewEmployee}
              sx={{
                margin: "0.5rem",
              }}
            >
              <Box
                sx={{
                  mt: "1rem",
                  mb: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  id="name"
                  autoFocus
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={name}
                  onChange={(e) => {
                    if (e.target.value.length < 3) {
                      setNameErr("Enter employee name");
                    } else {
                      setNameErr(null);
                    }
                    setName(e.target.value);
                  }}
                />
                {nameErr && <small style={{ color: "red" }}>{nameErr}</small>}
              </Box>
              <Box
                sx={{
                  mb: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="department"
                    name="department"
                    value={department}
                    label="Department"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departments.map((dept) => {
                      return (
                        <MenuItem key={dept.createdAt} value={dept._id}>
                          {dept.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {deptErr && (
                  <small style={{ color: "red" }}>Select a department</small>
                )}
              </Box>
              <Box
                sx={{
                  mb: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  required
                  fullWidth
                  name="salary"
                  label="Salary"
                  id="salary"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={salary}
                  onChange={(e) => {
                    setSalary(e.target.value);
                    if (e.target.value.length < 5) {
                      setSalaryErr("Enter actual salary");
                    } else if (e.target.value === "") {
                      setSalaryErr("Enter salary");
                    } else {
                      setSalaryErr(null);
                    }
                  }}
                />
                {salaryErr && (
                  <small style={{ color: "red" }}>{salaryErr}</small>
                )}
              </Box>
              <Box
                sx={{
                  mb: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <Rating
                  name="rating"
                  id="rating"
                  value={rating}
                  onChange={(e) => {
                    setRating(e.target.value);
                  }}
                  precision={0.5}
                />
                {ratingErr && (
                  <small style={{ color: "red" }}>{ratingErr}</small>
                )}
              </Box>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="success"
                  sx={{ fontWeight: "600" }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default Employees;
