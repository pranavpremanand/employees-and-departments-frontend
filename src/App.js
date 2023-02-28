import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Departments from "./Components/Departments";
import Employees from "./Components/Employees";
import Sidebar from "./Components/Sidebar";
import SidebarOptions from "./Components/SidebarContext";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

function App() {
  const [sidebarOptions, setSidebarOptions] = useState({
    home: true,
    employees: false,
    departments: false,
  });

  const toggleOptions = (str) => {
    str === "HOME" &&
      setSidebarOptions({ home: true, employees: false, departments: false });
    str === "EMPLOYEES" &&
      setSidebarOptions({ home: false, employees: true, departments: false });
    str === "DEPARTMENTS" &&
      setSidebarOptions({ home: false, employees: false, departments: true });
  };
  return (
    <SidebarOptions.Provider
      value={{ options: sidebarOptions, toggleOptions: toggleOptions }}
    >
      <Provider store={store}>
        <Toaster position="top-center" reverseOrder={true} />
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Sidebar />}>
                <Route path="/" element={<Home />} />
                <Route path="employees" element={<Employees />} />
                <Route path="departments" element={<Departments />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </Provider>
    </SidebarOptions.Provider>
  );
}

export default App;
