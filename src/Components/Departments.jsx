import * as React from "react";
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
  capitalize,
  Divider,
  Modal,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { baseUrl } from "../APIs/BaseURL";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addDepartment } from "../Redux/departmentSlice";

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

const Departments = () => {
  const departments = useSelector((state)=>state.departments.departments)
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
  });

  //Add department to Database
  const addDept = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const department = {
      name: formData.get("name"),
      description: formData.get("description"),
    };
    try {
      if ((newDept.name && newDept.description) || !(nameErr && descErr)) {
        const {data} = await baseUrl.post("/add-department", department);
        if (data === "Success") {
          toast("Department created successfully", {
            icon: "✅",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setModal(false);
          department.createdAt = Date.now()
          dispatch(addDepartment(department))
          setNewDept({ name: "", description: "" });
        } else {
          toast("Department already exist", {
            icon: "⚠️",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      }
    } catch (err) {
      toast("Something went wrong", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  //Code related to pagination
  // Avoid a layout jump when reaching the last page with empty rows.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - departments.length) : 0;
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
          onClick={() => setModal(true)}
          variant="contained"
          color="primary"
          sx={{ fontWeight: "600" }}
        >
          Add Department
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
                Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? departments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : departments
            ).map((dept) => (
              <TableRow key={dept.createdAt}>
                <TableCell component="th" scope="row">
                  {dept.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {dept.description}
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
              count={departments.length}
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
          onClose={() => setModal(false)}
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
              Add Department
            </Typography>
            <Divider />
            <Box
              component="form"
              onSubmit={addDept}
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
                  value={newDept.name}
                  onChange={(e) => {
                    if(e.target.value.length<3){
                      setNameErr("Enter employee name");
                    } else {
                      setNameErr(null);
                    }
                    setNewDept({ name: capitalize(e.target.value) });
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
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  autoCapitalize=""
                  id="description"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={newDept.description}
                  onChange={(e) => {
                    setNewDept({ description: capitalize(e.target.value) });
                    if (e.target.value === "") {
                      setDescErr("Enter description");
                    }else{
                      setDescErr(null)
                    }
                  }}
                />
                {descErr && <small style={{ color: "red" }}>{descErr}</small>}
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
export default Departments;
