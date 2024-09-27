// Import dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB Atlas connection URI (replace <username>, <password>, <dbname> with your actual details)
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Define a schema for storing text inputs
const textSchema = new mongoose.Schema({
    inputText: { type: String, required: true }
});

// Create a model based on the schema
const TextInput = mongoose.model('TextInput', textSchema);

// Endpoint to accept POST requests with text input
app.get('/status', (req, res) => {
    res.status(200).send("Server is running!");
});
app.post('/submit', async (req, res) => {
    const { inputText } = req.body;

    // Create a new document with the input text
    const newText = new TextInput({ inputText });

    try {
        // Save to MongoDB
        await newText.save();
        res.status(201).send("Text input saved successfully!");
    } catch (err) {
        res.status(500).send("Error saving text input to database.");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
