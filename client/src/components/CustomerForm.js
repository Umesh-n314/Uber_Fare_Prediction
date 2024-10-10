import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        passengers_count: '',
        email: '',
        phone: '',
        pickup_location: '',
        drop_location: '',
        vehicle_type: '',
        trip_distance: '',
        trip_duration: '',
        predictedPrice: '' // Add predicted price to formData
    });
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const res = await axios.get('http://localhost:5000/api/customers');
        setCustomers(res.data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Get the price prediction from the Node.js server
        const predictionResponse = await axios.post('http://localhost:5000/predict', {
            passenger_count: formData.passengers_count,
            trip_distance: formData.trip_distance,
            duration_minutes: formData.trip_duration,
        });
        console.log(formData.passengers_count,formData.trip_distance)
        const predictedPrice = parseFloat(predictionResponse.data.predicted_price).toFixed(2);
        console.log("Predicted price:",predictedPrice)


        // Include predicted price in customer data
        const customerData = { ...formData, predictedPrice };

        if (editMode) {
            await axios.put(`http://localhost:5000/api/customers/${currentId}`, customerData);
            setEditMode(false);
            setCurrentId(null);
        } else {
            await axios.post('http://localhost:5000/api/customers', customerData);
        }

        fetchCustomers();
        resetForm();
    };

    const handleEdit = (customer) => {
        setFormData(customer);
        setEditMode(true);
        setCurrentId(customer._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        fetchCustomers();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            gender: '',
            passengers_count: '',
            email: '',
            phone: '',
            pickup_location: '',
            drop_location: '',
            vehicle_type: '',
            trip_distance: '',
            trip_duration: '',
            predictedPrice: ''
        });
    };

    return (
        <div className="form-div">
            <h1>Customer Management</h1>
            <form onSubmit={handleSubmit} className="customerForm">
                <div>
                    <label htmlFor='name'>Customer Name </label>
                    <input name="name" placeholder="Enter Customer Name" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div id="gender-div">
                    <span>Select Gender </span>
                    <label htmlFor='gender'>
                        <input type="radio" name="gender" value="Male" onChange={handleChange} required />
                        Male
                    </label>
                    <label htmlFor='gender'>
                        <input type="radio" name="gender" value="Female" onChange={handleChange} required />
                        Female
                    </label>
                    <label htmlFor='gender'>
                        <input type="radio" name="gender" value="Other" onChange={handleChange} required />
                        Other
                    </label>
                </div>
                
                <input name="passengers_count" placeholder="Passengers Count" type="number" value={formData.passengers_count} onChange={handleChange} required />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <input name="pickup_location" placeholder="Pickup Location" value={formData.pickup_location} onChange={handleChange} required />
                <input name="drop_location" placeholder="Drop Location" value={formData.drop_location} onChange={handleChange} required />
                
                <div id="vehicle-div">
                    <span>Select Vehicle Type</span>
                    <label htmlFor='vehicle_type'>
                        <input type="radio" name="vehicle_type"  value="bike" onChange={handleChange} required />
                        Bike
                    </label>
                    <label htmlFor='vehicle_type'>
                        <input type="radio" name="vehicle_type"  value="auto" onChange={handleChange} required />
                        Auto
                    </label>
                    <label htmlFor='vehicle_type'>
                        <input type="radio" name="vehicle_type"  value="car" onChange={handleChange} required />
                        Car
                    </label>
                
                </div>
                
                <input name="trip_distance" placeholder="Trip Distance in KM" value={formData.trip_distance} onChange={handleChange} required />
                <input name="trip_duration" placeholder="Trip Duration in minutes" value={formData.trip_duration} onChange={handleChange} required />
                <button id="add-btn" type="submit">{editMode ? 'Update Customer' : 'Add Customer'}</button>
            </form>
            <div>
            {customers.predictedPrice ?<b>Predicted Price: {customers.predictedPrice}</b>:<b></b>}
            </div>
            <h2>Customer List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Phone No.</th>
                        <th>Pick Up Location</th>
                        <th>Drop Location</th>
                        <th>Vehicle Type</th>
                        <th>Predicted Price</th> 
                        <th>Edit</th>
                        <th>Delete</th> 
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer._id}>
                            <td>{customer.name}</td>
                            <td>{customer.gender}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.pickup_location}</td>
                            <td>{customer.drop_location}</td>
                            <td>{customer.vehicle_type}</td>
                            <td>{customer.predictedPrice}</td> 
                            <td>
                                <button className='edit' onClick={() => handleEdit(customer)}> Edit </button>
                            </td>
                            <td>
                                <button className='delete' onClick={() => handleDelete(customer._id)}> Delete </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerForm;
