// importing required libraries and modules
const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db"); // importing the database connection
const path = require("path");
const cookieParser = require("cookie-parser");

// creating express application
const app = express();
const port = 3000;

// middleware to parse incoming requests with urlencoded payloads and JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // using cookie-parser middleware

// serve static files from the assets directory
app.use(express.static(__dirname + "/assets"));

// utility function to execute a query and return a Promise
const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                reject(err); // rejecting the promise if there is an error
            } else {
                resolve(results); // resolving the promise with results
            }
        });
    });
};

// login endpoint
app.post("/login", async (req, res) => {
    try { // extracting login details from the request body
        const { username, password, "user-type": role } = req.body;
        // SQL query to search/fetch user based on username, password and role
        const query = "SELECT * FROM users WHERE username = ? AND password = ? AND role = ?";
        const results = await executeQuery(query, [username, password, role]); // executing the queries 

        console.log("Query results:", results); // statement for debugging

        // redirecting based on role
        if (results.length > 0) {
            const user = results[0];
            console.log("User found:", user); // statement for debugging
            if (role === "admin") {
                res.redirect("/admin/dashboard");
            } else if (role === "teacher") {
                res.redirect("/teacher/dashboard");
            } else if (role === "student") {
                res.cookie("student_id", user.id); // setting student ID in cookie
                res.redirect("/student/dashboard");
            }
        } else { // sending an error message if no user is found
            res.send("Invalid username or password.");
        }
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    }
});

// endpoint to add a new teacher
app.post("/api/teachers/add", async (req, res) => {
    try { // extracting teacher details from request body
        const { name, subject, department } = req.body;

        // checking if any required fields are missing 
        if (!name || !subject || !department) {
            return res.status(400).json({ error: "Name, subject, and department are required" });
        }

        // SQL query to insert a teacher 
        const query = "INSERT INTO teachers (name, subject, department) VALUES (?, ?, ?)";
        const results = await executeQuery(query, [name, subject, department]); // executing the query

        // checking if the insertion was successfull
        if (results.insertId) {
            res.sendStatus(201); // responding with HTTP 201 Created upon successful addition
        } else {
            res.status(500).json({ error: "Failed to add teacher" });
        }
    } catch (err) {
        console.error("Error adding teacher:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to update teacher
app.post("/api/teachers/update", async (req, res) => {
    try { // extracting teachers details from request body
        const { id, name, subject, department } = req.body;

        // checking if the required fileds are empty
        if (!id || !name || !subject || !department) {
            return res.status(400).json({ error: "ID, name, subject, and department are required" });
        }

        // SQL query to update a teacher
        const query = "UPDATE teachers SET name = ?, subject = ?, department = ? WHERE id = ?";
        const results = await executeQuery(query, [name, subject, department, id]); // executing the query

        // checking if the update is successfull
        if (results.affectedRows > 0) {
            res.sendStatus(200); // responding with HTTP 200 Ok upon successfull update
        } else {
            res.status(404).json({ error: "Teacher not found" });
        }
    } catch (err) {
        console.error("Error updating teacher:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to fetch all teachers or search for teachers
app.get("/api/teachers", async (req, res) => {
    try { // extracting the search query from the request query parameters
        const searchQuery = req.query.search;
        // SQL query based on if a search query is provided
        const query = searchQuery ? 
            `SELECT * FROM teachers WHERE name LIKE ? OR subject LIKE ?` : 
            'SELECT * FROM teachers';
        const params = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`] : []; // defining the parameters for the query
        const results = await executeQuery(query, params); // executing the query
        res.json(results); // responding with results
    } catch (err) {
        console.error("Error fetching teachers:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to delete a teacher
app.delete("/api/teachers/:id", async (req, res) => {
    try { // extracting teacher ID from request parameters
        const teacherId = req.params.id;
        // SQL query to delete teacher
        const query = "DELETE FROM teachers WHERE id = ?";
        await executeQuery(query, [teacherId]); // executing query
        res.sendStatus(200); // responding with HTTP 200 Ok upon successful deletion
    } catch (err) {
        console.error("Error deleting teacher:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to fetch all students
app.get("/api/students", async (req, res) => {
    try { // SQL query to fetch students
        const query = "SELECT * FROM students";
        const results = await executeQuery(query); // executing query
        res.json(results); // responding with results
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to approve a student registration
app.post("/api/students/:id/approve", async (req, res) => {
    try { // extracting student ID from request parameters
        const studentId = req.params.id;
        // SQL query to update student status as approved
        const query = 'UPDATE students SET status = "approved" WHERE id = ?';
        await executeQuery(query, [studentId]); // executing the query
        res.sendStatus(200); // responding with HTTP 200 Ok upon successful approval
    } catch (err) {
        console.error("Error approving student:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to reject a student registration
app.post("/api/students/:id/reject", async (req, res) => {
    try { // extracting student ID from request parameters
        const studentId = req.params.id;
        // SQL query to update student status as rejected
        const query = 'UPDATE students SET status = "rejected" WHERE id = ?';
        await executeQuery(query, [studentId]); // executing the query
        res.sendStatus(200);  // responding with HTTP 200 Ok upon successful rejection
    } catch (err) {
        console.error("Error rejecting student:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to fetch all appointments
app.get("/api/appointments", async (req, res) => {
    try { // SQL query to fetch all appointments
        const query = "SELECT * FROM appointments";
        const results = await executeQuery(query); // executing the queries
        res.json(results); // responding with results
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to approve or cancel an appointment
app.post("/api/appointments/:id", async (req, res) => {
    try {
        const { id } = req.params; // extracting appointment ID from request parameters
        const { action } = req.body; // extracting action from request body

        let status;
        if (action === "approve") {
            status = "approved"; // setting the status as approved if action is approve
        } else if (action === "cancel") {
            status = "cancelled"; // setting the status as cancelled if action is cancel
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }

        // SQL query to update the status of appointment
        const query = "UPDATE appointments SET status = ? WHERE id = ?";
        await executeQuery(query, [status, id]); // executing query 
        res.sendStatus(200); // responding with HTTP 200 Ok upon successful update
    } catch (err) {
        console.error("Error updating appointment status:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to fetch all messages
app.get("/api/messages", async (req, res) => {
    try { // SQL query to fetch all messages
        const query = "SELECT * FROM messages";
        const results = await executeQuery(query); // executing the query
        res.json(results); // responding with results
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to schedule a new appointment
app.post("/api/appointments", async (req, res) => {
    try { // extract appointments details from request body
        const { teacher_id, student_id, date, time } = req.body;

        // chekcing if the required fields are empty
        if (!teacher_id || !student_id || !date || !time) {
            return res.status(400).json({ error: "Teacher ID, student ID, date, and time are required" });
        }

        // SQL query to insert/schedule an appointment 
        const query = "INSERT INTO appointments (teacher_id, student_id, date, time, status) VALUES (?, ?, ?, ?, ?)";
        await executeQuery(query, [teacher_id, student_id, date, time, 'pending']);
        res.sendStatus(201);  // responding with HTTP 201 Created upon successful scheduling
    } catch (err) {
        console.error("Error scheduling appointment:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to send a message
app.post("/api/messages", async (req, res) => {
    try { // extracting message details from request body
        const { sender_id, receiver_id, message } = req.body;

        // checking if the required fields are empty
        if (!sender_id || !receiver_id || !message) {
            return res.status(400).json({ error: "Sender ID, receiver ID, and message are required" });
        }

        // SQL query to insert a message
        const query = "INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES (?, ?, ?, NOW())";
        await executeQuery(query, [sender_id, receiver_id, message]);
        res.sendStatus(201);  // responding with HTTP 201 Created upon successful message sending
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// middleware for logging each incoming request's URL for debugging and monitoring
app.use((req, res, next) => {
    console.log(`Received request for: ${req.url}`);
    next();
});

// route to server registration page
app.get('/registration', (req, res) => {
    const filePath = path.join(__dirname, "/assets/registration.html"); // constructing the file path to the registration.html file
    console.log("File path:", filePath); // checking if this path is correct
    res.sendFile(filePath); // sending the registration.html file as a response
});

// route to handle registration form submission
app.post("/registration", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // checking if the required fields are missing
        if (!username || !password || !email) {
            console.error("Missing required fields:", { username, password, email });
            return res.status(400).json({ error: "All fields are required" });
        }

        // SQL query to insert the new user with status as pending
        const query = "INSERT INTO students (username, password, email, status) VALUES (?, ?, ?, ?)";
        await executeQuery(query, [username, password, email, 'pending']);
        // redirecting to index.html upon successful registration
        res.redirect("/index.html");
    } catch (err) {
        console.error("Error processing registration:", err);
        res.status(500).json({ error: "Internal Server Error" }); // returning a 500 Internal Server Error response with an error message
    }
});

// route for the admin dashboard page
app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/assets/admin_dashboard.html"));
});

// route for teacher dashboard page
app.get("/teacher/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/assets/teacher_dashboard.html"));
});

// route for student dashboard page
app.get("/student/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/assets/student_dashboard.html"));
});

// starting the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
