const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Instead of bodyParser.json()

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Customer_details', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Prediction route
app.post('/predict', (req, res) => {
    const { passenger_count, trip_distance, duration_minutes } = req.body;

    const pythonProcess = spawn('python', ['model_script.py', passenger_count, trip_distance, duration_minutes]);

    pythonProcess.stdout.on('data', (data) => {
        res.json({ predicted_price: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(data.toString());
        res.status(500).json({ error: 'An error occurred while predicting the price' });
    });
});

// Routes
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
