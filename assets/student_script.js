// retrieving student ID from cookies
const studentId = Cookies.get("student_id"); // retrieving from cookies

// function to send a message
async function sendMessage(receiverId, message) {
  if (!studentId) { // checking if student ID is available
    alert("Student ID not found. Please log in again.");
    return;
  }

  try {
    const response = await fetch("/api/messages", {
      method: "POST", // sending a POST request to send the message
      headers: {
        "Content-Type": "application/json" // setting the content type to JSON
      },
      body: JSON.stringify({
        sender_id: studentId,
        receiver_id: receiverId,
        message: message
      })
    });

    if (!response.ok) { // checking if the request was successful
      throw new Error("Failed to send message");
    }

    alert("Message sent successfully!");
  } catch (error) { // handle error if any
    console.error("Error sending message:", error);
    alert("Failed to send message: " + error.message);
  }
}

// function to book an appointment
async function bookAppointment(teacherId, date, time) {
  if (!studentId) { // checking of the student ID is available
    alert("Student ID not found. Please log in again.");
    return; // exit the function if student ID is not available
  }

  try {
    // sending a POST request to the server to book an appointment
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teacher_id: teacherId,
        student_id: studentId,
        date: date,
        time: time
      })
    });

    if (!response.ok) {
      throw new Error("Failed to book appointment"); // throw an error if an booking an appointment failed
    }

    alert("Appointment booked successfully!"); // showing success message
  } catch (error) { // handle errors
    console.error("Error booking appointment:", error);
    alert("Failed to book appointment: " + error.message);
  }
}

// function to fetch teachers
async function fetchTeachers(query) {
  console.log("Fetching teachers with query:", query); // statement for debugging

  try {
      const response = await fetch(`/api/teachers?search=${encodeURIComponent(query)}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      });

      console.log("Response status:", response.status); // statement for debugging

      if (!response.ok) {
          throw new Error("Failed to fetch teachers");
      }

      const data = await response.json();
      console.log("Fetched teachers:", data); // statement for debugging
      displayTeachers(data); // calling the function to display teachers

  } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to fetch teachers: " + error.message);
  }
}

// function to display teachers 
function displayTeachers(teachers) {
  const teachersList = document.getElementById("teachersList"); // getting the element where teachers will be displayed
  teachersList.innerHTML = ''; // clearing previous results

  // if no teachers were found
  if (teachers.length === 0) {
      teachersList.innerHTML = "<p>No teachers found</p>"; // displaying this message if no teachers were found
      return;
  }

  // looping through the list of teachers and creating elements to diplay each teacher
  teachers.forEach(teacher => {
      const teacherElement = document.createElement("div"); // creating a new div element
      teacherElement.textContent = `${teacher.name} - ${teacher.subject}`; // setting the text content to teachers name and subject
      teachersList.appendChild(teacherElement); // appending/adding new element to teachers list
  });
}

// to handle search form submission
document.getElementById("searchForm").addEventListener("submit", function(event) {
  event.preventDefault(); // preventing the default form submission behaviour
  console.log("Search form submitted");
  const query = document.getElementById("searchInput").value; // getting the search query from the input field
  fetchTeachers(query); // calling the function to fetch teachers based on search qeury
});

// to handle book appointment form submission
document.getElementById("bookAppointmentForm").addEventListener("submit", function(event) {
  event.preventDefault(); // preventing the default form submission behaviour
  const teacherId = document.getElementById("teacherIdInput").value; // getting the teacher ID from input field
  const date = document.getElementById("dateInput").value; // getting the date from input field
  const time = document.getElementById("timeInput").value; // getting the time from input field
  bookAppointment(teacherId, date, time); // calling the function to book an appointment
});

// to handle send message form submission
document.getElementById("sendMessageForm").addEventListener("submit", function(event) {
  event.preventDefault(); // preventing the default form submission behaviour
  const teacherId = document.getElementById("teacherIdMessageInput").value; // getting the teacher ID from input field
  const message = document.getElementById("messageInput").value; // getting the message from text area
  sendMessage(teacherId, message); // calling the function to send message
});
