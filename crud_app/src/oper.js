import React, { useState, useEffect, Fragment } from 'react';
import { Button, Table, Modal, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeCRUD = () => {
    const [employees, setEmployees] = useState([]);
    const [show, setShow] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState({ id: '', name: '', age: '', isActive: false });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5296/api/Employee');
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to fetch employees");
        }
    };

    const handleShow = (employee = { id: '', name: '', age: '', isActive: false }) => {
        setCurrentEmployee(employee);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setCurrentEmployee({ id: '', name: '', age: '', isActive: false });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentEmployee(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            // Log the current employee data
            console.log("Payload being sent:", currentEmployee);
    
            // Validate required fields
            if (!currentEmployee.name || !currentEmployee.age) {
                toast.error("Name and Age are required fields.");
                return;
            }
    
            if (currentEmployee.id) {
                // Update existing employee
                const response = await axios.put(`http://localhost:5296/api/Employee/${currentEmployee.id}`, currentEmployee);
                toast.success("Employee updated successfully");
            } else {
                // Add new employee
                const response = await axios.post('http://localhost:5296/api/Employee', currentEmployee);
                if (response.status === 201) {
                    toast.success("Employee added successfully");
                } else {
                    throw new Error("Failed to add employee");
                }
            }
    
            // Refresh the employee list and close the modal
            fetchEmployees();
            handleClose();
        } catch (error) {
            console.error("Error saving employee:", error);
            if (error.response) {
                // Log the entire error response for debugging
                console.error("Error response data:", error.response.data);
                const errorMessage = error.response.data.message || "Failed to save employee";
                toast.error("Failed to save employee: " + errorMessage);
            } else {
                toast.error("Failed to save employee: " + error.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://localhost:5296/api/Employee/${id}`);
                fetchEmployees();
                toast.success("Employee deleted successfully");
            } catch (error) {
                console.error("Error deleting employee:", error);
                toast.error("Failed to delete employee");
            }
        }
    };

    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <h1>RR Group of Companies!</h1>
                <Row className="mb-3">
                    <Col>
                        <Button variant="success" onClick={() => handleShow()}>Add Employee</Button>
                    </Col>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Is Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.age}</td>
                                <td>{emp.isActive ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleShow(emp)}>Edit</Button>&nbsp;&nbsp;
                                    <Button variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentEmployee.id ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" name="name" placeholder="Name" value={currentEmployee.name} onChange={handleChange} className="form-control" />
                        </Col>
                        <Col>
                            <input type="number" name="age" placeholder="Age" value={currentEmployee.age} onChange={handleChange} className="form-control" />
                        </Col>
                        <Col>
                            <input type="checkbox" name="isActive" checked={currentEmployee.isActive} onChange={handleChange} />
                            <label>Is Active</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default EmployeeCRUD;