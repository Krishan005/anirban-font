import React, { useState, useEffect } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { Button, Dialog, InputText, Dropdown } from "primereact";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "./List.css"; // Import custom styles
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../Redux/dataSlices";
import { fetchDataEmployee } from "../../Redux/getAllEmployeeSlice";
import { scrollToErrorElement } from "../../utils";
import { fileUpload } from "../../helpers/XmlClientHttp";
import {
  createEmployee,
  editEmployee,
} from "../../Redux/EmployeeAddAndEditSlices";
import { uploadImage } from "../../Redux/UplaodImageSlices";

const createErrors = {
  fullName: "",
  designation: "",
  reporting: "",
  file: "",
};

export default function List() {
  const [selection, setSelection] = useState([]);
  const [allemployees, setAllEmployees] = useState([]);
  const [data, setData] = useState([
    {
      expanded: true,
      type: "person",
      data: {
        image: "",
        name: "Amy Elsner",
        title: "CEO",
      },
      children: [],
    },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    fullName: "",
    designation: "",
    date_of_birth: "",
    experience_years: 0,
    picture: "",
    reporting: "", // 59b99db4cfa9a34dcd7885b6
    file: null,
  });
  const [uploadedImg, setuploadedImg] = useState("");
  const [errors, setErrors] = useState({});
  const [errorsInData, seterrorsInData] = useState(createErrors);
  const [actionType, setactionType] = useState("add");

  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.data);
  const { employees, employeesstatus } = useSelector(
    (state) => state.allemployees
  );
  const { AddedEmployee, newEmployeeStatus, newEmployeeerror } = useSelector(
    (state) => state.addAndEditEmployees
  );
  const { image, imageStatus, imageError } = useSelector(
    (state) => state.uploadImage
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchData());
      dispatch(fetchDataEmployee());
    }
    if (status === "succeeded") {
      if (items.data.length > 0) {
        setData(items?.data);
      }
    }
    if (employeesstatus === "succeeded") {
      if (employees.data.length > 0) {
        setAllEmployees(employees?.data);
      }
    }
  }, [status, employeesstatus, dispatch, newEmployeeStatus]);

  useEffect(() => {
    if (imageStatus === "succeeded" && image?.imageUrl?.filePath) {
      newEmployee.picture = image.imageUrl.filePath;
      setShowDialog(false);
    } else {
      // setErrors({ file: 'File is importent.' });
      return;
    }

    setTimeout(async () => {
      if (actionType === "add") {
        // Create Employee
        await dispatch(createEmployee(newEmployee)).unwrap();
      }
      // else {
      //     if (newEmployee.designation.toUpperCase() === "CEO" || newEmployee.designation.toLowerCase() === "chief executive officer") {
      //         delete newEmployee.reporting
      //     }
      //     // Update Employee
      //     await dispatch(editEmployee({ id: newEmployee?._id, data: newEmployee })).unwrap();
      // }

      // Fetch Updated Data
      await Promise.all([dispatch(fetchData()), dispatch(fetchDataEmployee())]);

      // Reset Form and Close Dialog
      setactionType("add");
      setNewEmployee({
        fullName: "",
        designation: "",
        date_of_birth: "",
        experience_years: 0,
        picture: "",
        reporting: "",
        file: null,
      });
      setuploadedImg("");
      // setErrors({});
      seterrorsInData(createErrors);
    }, 1000);
  }, [imageStatus === "succeeded"]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleValidation = () => {
    const { fullName, designation, reporting, file } = newEmployee;

    if (fullName === "") {
      seterrorsInData({ ...createErrors, fullName: "Full name is required." });
      scrollToErrorElement("fullName");
      return false;
    }
    if (fullName.length < 3) {
      seterrorsInData({
        ...createErrors,
        fullName: "Full name must be atleast 3 characters.",
      });
      scrollToErrorElement("fullName");
      return false;
    }
    if (designation === "") {
      seterrorsInData({
        ...createErrors,
        designation: "Designation is required.",
      });
      return false;
    }
    if (designation.length < 3) {
      seterrorsInData({
        ...createErrors,
        designation: "Designation must be atleast 3 characters.",
      });
      return false;
    }
    if (actionType === "add" && file === null) {
      seterrorsInData({ ...createErrors, file: "File is required" });
      return false;
    }
    if (designation.toUpperCase() !== "CEO") {
      // console.log("CEO", reporting);
      if (reporting === "") {
        seterrorsInData({
          ...createErrors,
          reporting: "Reporting ID is required.",
        });
        return false;
      }
    }

    return true;
  };

  const handleAddEmployee = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      try {
        // Upload Image if there is a file
        if (newEmployee.file) {
          const formData = new FormData();
          formData.append("image", newEmployee.file);
          await dispatch(uploadImage(formData)).unwrap();
        }
      } catch (err) {
        console.error("Error adding employee:", err);
      }
    }
  };

  const fileUploadToServer = async (data) => {
    if (data) {
      const formData = new FormData();
      formData.append("image", data);
      return fileUpload("/upload-image", formData);
    }
  };

  const handleEditEmployee = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      try {
        let bodyData = { ...newEmployee };
        // Upload Image if there is a file
        if (newEmployee.file) {
          let imgUpRes = await fileUploadToServer(newEmployee.file);
          if (imgUpRes && imgUpRes.status) {
            bodyData.picture = imgUpRes.imageUrl.filePath;
          }
        }

        if (
          bodyData.designation.toUpperCase() === "CEO" ||
          bodyData.designation.toLowerCase() === "chief executive officer"
        ) {
          delete bodyData.reporting;
        }
        // Update Employee
        await dispatch(
          editEmployee({ id: bodyData?._id, data: bodyData })
        ).unwrap();

        // Fetch Updated Data
        await Promise.all([
          dispatch(fetchData()),
          dispatch(fetchDataEmployee()),
        ]);

        // Reset Form and Close Dialog
        setShowDialog(false);
        setactionType("add");
        setNewEmployee({
          fullName: "",
          designation: "",
          date_of_birth: "",
          experience_years: 0,
          picture: "",
          reporting: "",
          file: null,
        });
        setuploadedImg("");
        // setErrors({});
        seterrorsInData(createErrors);
      } catch (err) {
        console.error("Error adding employee:", err);
      }
    }
  };

  const nodeTemplate = (node) => {
    if (node.type === "person") {
      return (
        <div
          className="node-card"
          onClick={() => {
            setNewEmployee((prev) => {
              let update = JSON.parse(JSON.stringify(prev));
              return { ...update, ...node };
            });
            setuploadedImg(`${process.env.REACT_APP_BASE_URL}` + node.picture);
            setShowDialog(true);
            setactionType("edit");
          }}
        >
          <img
            alt={node.fullName}
            src={
              node.picture
                ? `${process.env.REACT_APP_BASE_URL}` + node.picture
                : " https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
            }
            className="node-image"
          />
          <div className="node-details">
            <span className="node-name">{node.fullName}</span>
            <br />
            <span className="node-title">{node.designation}</span>
          </div>
        </div>
      );
    }

    return <span>{node.label}</span>;
  };

  const reportingOptions = allemployees.map((employee) => ({
    label: `${employee.fullName} - ${employee.designation}`,
    value: employee._id,
  }));

  return (
    <div className="card overflow-x-auto organization-chart">
      <Button
        label="Add Member"
        icon="pi pi-plus"
        className="add-employee-button"
        onClick={() => setShowDialog(true)}
      />

      <OrganizationChart
        value={data}
        selectionMode="multiple"
        selection={selection}
        onSelectionChange={(e) => setSelection(e.data)}
        nodeTemplate={nodeTemplate}
      />

      <Dialog
        header={actionType === "add" ? "Add New Member" : "Edit Member"}
        visible={showDialog}
        onHide={() => {
          setShowDialog(false);
          setactionType("add");
          setNewEmployee({
            fullName: "",
            designation: "",
            date_of_birth: "",
            experience_years: 0,
            picture: "",
            reporting: "",
            file: null,
          });
          setErrors({});
          setuploadedImg("");
        }}
      >
        <div className="p-field">
          <label htmlFor="fullName">Full Name</label>
          <InputText
            id="fullName"
            value={newEmployee.fullName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, fullName: e.target.value })
            }
          />
          <small className="p-error">{errorsInData.fullName}</small>
        </div>
        <div className="p-field">
          <label htmlFor="designation">Designation</label>
          <InputText
            id="designation"
            value={newEmployee.designation}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, designation: e.target.value })
            }
          />
          <small className="p-error">{errorsInData.designation}</small>
        </div>
        <div className="p-field">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <InputText
            id="date_of_birth"
            type="date"
            value={newEmployee.date_of_birth}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, date_of_birth: e.target.value })
            }
          />
          {errors.date_of_birth && (
            <small className="p-error">{errors.date_of_birth}</small>
          )}
        </div>
        <div className="p-field">
          <label htmlFor="experience_years">Experience (Years)</label>
          <InputText
            id="experience_years"
            value={newEmployee.experience_years}
            onChange={(e) =>
              setNewEmployee({
                ...newEmployee,
                experience_years: e.target.value,
              })
            }
            onBlur={(e) =>
              setNewEmployee({
                ...newEmployee,
                experience_years: parseInt(e.target.value),
              })
            }
          />
          <small className="p-error">{errors.experience_years}</small>
        </div>
        <div className="p-field">
          <label htmlFor="file">Upload Picture</label>
          <br />

          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setuploadedImg(URL.createObjectURL(e.target.files[0]));
              setNewEmployee({ ...newEmployee, file: e.target.files[0] });
            }}
          />
          <small className="p-error">{errorsInData.file}</small>
        </div>
        {uploadedImg !== "" && (
          <div>
            <img src={uploadedImg} height="100" width="100" />
          </div>
        )}
        {actionType === "edit" &&
        (newEmployee?.designation?.toUpperCase() === "CEO" ||
          newEmployee?.designation?.toLowerCase() ===
            "chief executive officer") ? (
          ""
        ) : (
          <div className="p-field">
            <label htmlFor="reporting">Reporting</label>
            <br />
            <Dropdown
              id="reporting"
              value={newEmployee.reporting}
              options={reportingOptions}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, reporting: e.value })
              }
              placeholder="Select Reporting Employee"
            />
            <small className="p-error">{errorsInData.reporting}</small>
          </div>
        )}
        <Button
          label={actionType === "add" ? "Add" : "Edit"}
          icon="pi pi-check"
          onClick={(e) => {
            if (actionType === "add") {
              handleAddEmployee(e);
            } else {
              handleEditEmployee(e);
            }
          }}
        />
      </Dialog>
    </div>
  );
}
