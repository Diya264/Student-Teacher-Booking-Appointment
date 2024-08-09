// function to fetch appointments from API
async function fetchAppointments() {
    try {
        // sending a GET request to fetch appointments
        const response = await fetch("/api/appointments");
        if (!response.ok) {
            throw new Error("Failed to fetch appointments"); // thorwing an error if fetching appointments failed
        }
        const appointments = await response.json(); // parse the response as JSON
        displayAppointments(appointments); // calling the function to display appointments
    } catch (error) { // to handle any errors during fetch request
        console.error("Error fetching appointments:", error);
        alert("Failed to fetch appointments. Please try again.");
    }
}

// function to display appointments
function displayAppointments(appointments) {
    const appointmentsList = document.getElementById("appointmentsList"); // getting the element
    if (appointments.length > 0) { // checking if there are any appointments
        // generatig the HTML for the appointments list and looping through the list of appointments and creating elemets
        appointmentsList.innerHTML = '<ul>' +
            appointments.map(appointment => `
                <li>
                    Student ID: ${appointment.student_id}<br>
                    Date: ${appointment.date}<br>
                    Time: ${appointment.time}<br>
                    Status: ${appointment.status}<br>
                    ${appointment.status === 'pending' ?
                        `<button onclick="approveAppointment(${appointment.id})">Approve</button>
                         <button onclick="cancelAppointment(${appointment.id})">Cancel</button>`
                        : ''}
                </li>`
            ).join('') +
            '</ul>';
    } else {
        appointmentsList.innerHTML = "<p>No appointments found.</p>"; // display this message if no appointments were found
    }
}

// function to update appointment status (approve or cancel)
async function updateAppointmentStatus(id, action) {
    try {
        // sending a POST request to update an appointment
        const response = await fetch(`/api/appointments/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // setting the content type to JSON
            },
            body: JSON.stringify({ action }) // sending the action in request body
        });
        if (!response.ok) {
            throw new Error("Failed to update appointment status"); // throw an error if updating status failed
        }
        fetchAppointments(); // refreshing the appointments list after update
    } catch (error) { // handle error if any
        console.error(`Error updating appointment ${id} status:`, error);
        alert(`Failed to ${action} appointment. Please try again.`); 
    }
}

// function to approve an appointment
function approveAppointment(id) {
    updateAppointmentStatus(id, "approve"); // calling the function to update the status to approve
}

// function to cancel an appointment
function cancelAppointment(id) {
    updateAppointmentStatus(id, "cancel"); // calling the function to update the status to cancel
}

// function to fetch messages from API
async function fetchMessages() {
    try { // sending a GET request to featch messages
        const response = await fetch("/api/messages");
        if (!response.ok) {
            throw new Error("Failed to fetch messages"); // throw an error if fetching messages failed
        }
        const messages = await response.json(); // parse the reponse as JSON
        displayMessages(messages);
    } catch (error) { // handle any errors
        console.error("Error fetching messages:", error);
        alert("Failed to fetch messages. Please try again.");
    }
}

// function to display messages
function displayMessages(messages) {
    const messagesList = document.getElementById("messagesList"); // getting the element
    if (messages.length > 0) { // checking if there are any messages
        // generating an HTML for messsage list
        messagesList.innerHTML = '<ul>' +
            messages.map(message => `
                <li>
                    From Student ID: ${message.sender_id}<br>
                    Message: ${message.message}<br>
                    Sent At: ${message.created_at}<br>
                </li>`
            ).join('') +
            '</ul>';
    } else {
        messagesList.innerHTML = "<p>No messages found.</p>"; // dispplaying this message if no messages are found
    }
}

// function to schedule a appointment
async function scheduleAppointment(teacherId, studentId, date, time) {
    try { // sending a POST request to schedule a appointment
        const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // setting the content type to JSON
            },
            body: JSON.stringify({
                teacher_id: teacherId,
                student_id: studentId,
                date: date,
                time: time
            })
        });
        if (!response.ok) {
            throw new Error("Failed to schedule appointment"); // throw error if scheduling appointment failed
        }
        alert("Appointment added successfully!")
        fetchAppointments(); // refreshing appointments list after scheduling
    } catch (error) { // handle errors if any
        console.error("Error scheduling appointment:", error);
        alert("Failed to schedule appointment. Please try again.");
    }
}

// to handle schedule appointment form submission
document.getElementById("scheduleForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // preventing default form submission behaviour
    const teacherId = document.getElementById("teacherIdInput").value; // getting the teacher ID from the input field
    const studentId = document.getElementById("studentIdInput").value; // getting the studet ID from the input field
    const date = document.getElementById("dateInput").value; // getting the date from the input field
    const time = document.getElementById("timeInput").value; // getting the time from the input field
    await scheduleAppointment(teacherId, studentId, date, time); // calling the function to schedule an appointment
});

fetchAppointments(); // fetching appointments when page loads
fetchMessages(); // fetching messages when page loads
