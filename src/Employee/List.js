import React, { useState, useEffect } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import { Button, Dialog, InputText, Dropdown } from 'primereact';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import './List.css'; // Import custom styles
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../Redux/dataSlices';
import { fetchDataEmployee } from '../Redux/getAllEmployeeSlice';
import { createEmployee } from '../Redux/createEmployeeSlices';
import { uploadImage } from '../Redux/UplaodImageSlices';

export default function List() {
    const [selection, setSelection] = useState([]);
    const [allemployees, setAllEmployees] = useState([]);
    const [data, setData] = useState([
        {
            expanded: true,
            type: 'person',
            data: {
                image: '',
                name: 'Amy Elsner',
                title: 'CEO'
            },
            children: []
        }
    ]);

    const [showDialog, setShowDialog] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        fullName: '',
        designation: '',
        date_of_birth: '',
        experience_years: 0,
        picture: '',
        reporting: '59b99db4cfa9a34dcd7885b6',
        file: null
    });

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.data);
    const { employees, employeesstatus } = useSelector((state) => state.allemployees);
    const  { AddedEmployee , newEmployeeStatus, newEmployeeerror } = useSelector((state) => state.newEmployees);
    const { image, imageStatus, imageError } = useSelector((state) => state.uploadImage);

    console.log(AddedEmployee);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchData());
            dispatch(fetchDataEmployee());
        }
        if (status === 'succeeded') {
            if(items.data.length > 0){
                setData(items?.data);
            }
        }
        if (employeesstatus === 'succeeded') {
            if(employees.data.length > 0){
                setAllEmployees(employees?.data);
            }
            
        }
    }, [status, employeesstatus, dispatch, newEmployeeStatus]);

    
    useEffect(() => {
        if (imageStatus === 'succeeded' && image?.imageUrl?.filePath) {
            newEmployee.picture = image.imageUrl.filePath;
              setShowDialog(false);
            } else {
                setErrors({ file: 'File is importent.' });
                return;
        }
        
          setTimeout(async () => {
         // Create Employee
        await dispatch(createEmployee(newEmployee)).unwrap();

        // Fetch Updated Data
        await Promise.all([dispatch(fetchData()), dispatch(fetchDataEmployee())]);

        // Reset Form and Close Dialog
      
        setNewEmployee({
            fullName: '',
            designation: '',
            date_of_birth: '',
            experience_years: 0,
            picture: '',
            reporting: '',
            file: null
        });
        setErrors({}); 
      }, 1000);
    }, [imageStatus === 'succeeded'])

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;

    const validate = () => {
        const validationErrors = {};
        if (!newEmployee.fullName.trim()) validationErrors.fullName = 'Full Name is required';
        if (!newEmployee.designation.trim()) validationErrors.designation = 'Designation is required';
        if (!newEmployee.date_of_birth.trim()) validationErrors.date_of_birth = 'Date of Birth is required';
        if (!newEmployee.experience_years || isNaN(newEmployee.experience_years)) validationErrors.experience_years = 'Valid experience years are required';
        if (!newEmployee.reporting.trim()) validationErrors.reporting = 'Reporting ID is required';
        if (!newEmployee.file) {
            validationErrors.file = 'File is required';
        } 
        return validationErrors;
    };


const handleAddEmployee = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
        // Upload Image if there is a file
        if (newEmployee.file) {
            const formData = new FormData();
            formData.append('image', newEmployee.file);
            await dispatch(uploadImage(formData)).unwrap(); // Wait for the image to upload

        
        }

    
    } catch (err) {
        console.error("Error adding employee:", err);
    }
};



    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div className="node-card">
                    <img alt={node.data.name} src={node.data.image? `${process.env.REACT_APP_API_FILEUPLOAD_URL}/`+node.data.image :" https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"} className="node-image" />
                    <div className="node-details">
                        <span className="node-name">{node.data.name}</span>
                        <br />
                        <span className="node-title">{node.data.title}</span>
                    </div>
                </div>
            );
        }

        return <span>{node.label}</span>;
    };

    const reportingOptions = allemployees.map((employee) => ({
        label: `${employee.fullName} - ${employee.designation}`,
        value: employee._id
    }));

    return (
        <div className="card overflow-x-auto organization-chart">
            <Button 
                label="Add Employee" 
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

            <Dialog header="Add New Employee" visible={showDialog} onHide={() => setShowDialog(false)}>
                <div className="p-field">
                    <label htmlFor="fullName">Full Name</label>
                    <InputText
                        id="fullName"
                        value={newEmployee.fullName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                    />
                    {errors.fullName && <small className="p-error">{errors.fullName}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="designation">Designation</label>
                    <InputText
                        id="designation"
                        value={newEmployee.designation}
                        onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                    />
                    {errors.designation && <small className="p-error">{errors.designation}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="date_of_birth">Date of Birth</label>
                    <InputText
                        id="date_of_birth"
                        type="date"
                        value={newEmployee.date_of_birth}
                        onChange={(e) => setNewEmployee({ ...newEmployee, date_of_birth: e.target.value })}
                    />
                    {errors.date_of_birth && <small className="p-error">{errors.date_of_birth}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="experience_years">Experience (Years)</label>
                    <InputText
                        id="experience_years"
                        value={newEmployee.experience_years}
                        onChange={(e) => setNewEmployee({ ...newEmployee, experience_years: e.target.value })}
                        onBlur={(e) => setNewEmployee({ ...newEmployee, experience_years: parseInt(e.target.value) })}
                    />
                    {errors.experience_years && <small className="p-error">{errors.experience_years}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="file">Upload Picture</label>
                    <br />

                    <input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewEmployee({ ...newEmployee, file: e.target.files[0] })}
                    />
                    {errors.file && <small className="p-error">{errors.file}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="reporting">Reporting</label>
                    <br />
                    <Dropdown
                        id="reporting"
                        value={newEmployee.reporting}
                        options={reportingOptions}
                        onChange={(e) => setNewEmployee({ ...newEmployee, reporting: e.value })}
                        placeholder="Select Reporting Employee"
                    />
                    {errors.reporting && <small className="p-error">{errors.reporting}</small>}
                </div>
                <Button label="Add" icon="pi pi-check" onClick={handleAddEmployee} />
            </Dialog>
        </div>
    );
}
