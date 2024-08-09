document.addEventListener("DOMContentLoaded", function() {
    const teachersLink = document.getElementById("teachersLink"); // getting the teachers link element
    const studentsLink = document.getElementById("studentsLink"); // getting the students link element

    // event listner for teachers link
    teachersLink.addEventListener("click", function(event) {
        event.preventDefault(); // prevent default link behaiviour (browser will not navigate to the new URL)
        showSection("teachersSection"); // show the teachers section
    });
    // event listner for students link
    studentsLink.addEventListener("click", function(event) {
        event.preventDefault(); // prevent default link behaviour 
        showSection("studentsSection"); // show students section
        fetchStudents(); // fetch list of students
    });

    // to show specific section and hide others
    function showSection(sectionId) {
        const sections = document.querySelectorAll(".section"); // getting all the sections
        sections.forEach(section => {
            section.classList.remove("active"); // hiding each section
        });

        const selectedSection = document.getElementById(sectionId); // getting the selected section
        selectedSection.classList.add("active"); // showing the selected section

        if (sectionId === "teachersSection") {
            fetchTeachers(); // fetching teachers if teachers section is selected
        }
    }

    // to fetch and display teachers
    function fetchTeachers() {
        fetch("/api/teachers") // making a GET request to fetch teachers
            .then(response => response.json()) // parse the response as JSON
            .then(data => {
                const teacherList = document.getElementById("teacherList"); // getting the teacher list element
                teacherList.innerHTML = ''; // clearing the current list
                data.forEach(teacher => {
                    const li = document.createElement("li"); // creating a list item for each teacher
                    li.innerHTML = `
                        ${teacher.name} - ${teacher.subject} (${teacher.department})
                        <button class="update-btn" data-id="${teacher.id}">Update</button>
                        <button class="delete-btn" data-id="${teacher.id}">Delete</button>
                    `; // adding teacher information and buttons to list item
                    teacherList.appendChild(li); // append/adding the list item to teachers list
                });

                // for update button
                teacherList.querySelectorAll(".update-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        updateTeacher(this.getAttribute("data-id")); // updating the teacher info on button click
                    });
                });

                // for delete buttin
                teacherList.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        deleteTeacher(this.getAttribute("data-id")); // deleting the teacher on button click
                    });
                });
            })
            .catch(error => console.error("Error fetching teachers:", error)); // to handle errors
    }

    // add teacher form
    const addTeacherForm = document.getElementById("addTeacherForm");
    if (addTeacherForm) {
        addTeacherForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // prevent default form submission
            const formData = new FormData(addTeacherForm); // getting form data
            const data = {
                name: formData.get("name"), // getting teachers name
                subject: formData.get("subject"), // getting teachers subject
                department: formData.get("department") // getting teachers department
            };

            try {
                const response = await fetch("/api/teachers/add", {
                    method: "POST", // sending a post request
                    headers: {
                        "Content-Type": "application/json" // setting the content type to JSON
                    },
                    body: JSON.stringify(data) // converting the data to JSON(string)
                });

                if (response.ok) {
                    alert("Teacher added successfully"); // an alert to show the success message
                    fetchTeachers(); // refreshing teachers list after adding teacher
                    
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`); // show error message if any
                }
            } catch (error) {
                console.error("Error adding teacher:", error); //handle error
                alert("Failed to add teacher"); // show error message
            }
        });
    }

    // funtion to update teacher
    function updateTeacher(teacherId) {
        const name = prompt("Enter new name:"); // prompt for new name
        const subject = prompt("Enter new subject:"); // promt for new subject
        const department = prompt("Enter new department:"); // prompt for new department

        const data = {
            id: teacherId,
            name,
            subject,
            department
        };

        fetch("/api/teachers/update", {
            method: "POST", // sending a POST request
            headers: {
                "Content-Type": "application/json" // setting the content type to JSON
            },
            body: JSON.stringify(data) // converting the data to JSON
        })
        .then(response => {
            if (response.ok) {
                alert("Teacher updated successfully"); // alert to show success message
                fetchTeachers(); // to refresh the list of teacher's after updating
            } else {
                throw new Error("Failed to update teacher"); // handle errors
            }
        })
        .catch(error => console.error("Error updating teacher:", error)); // handle errors
    }

    // function to delete teacher
    function deleteTeacher(teacherId) {
        if (confirm("Are you sure you want to delete this teacher?")) {
            fetch(`/api/teachers/${teacherId}`, {
                method: 'DELETE' // sending a delete request
            })
            .then(response => {
                if (response.ok) {
                    fetchTeachers(); // refreshing the list of teachers after deleting
                } else {
                    throw new Error("Failed to delete teacher"); // handle errors
                }
            })
            .catch(error => console.error("Error deleting teacher:", error)); // handle errors
        }
    }

    // function to fetch and display list of students
    function fetchStudents() {
        fetch("/api/students") // making a GET request to fetch students
            .then(response => response.json()) // parse the response as JSON
            .then(data => {
                const studentList = document.getElementById("studentList"); // getting the student list element
                studentList.innerHTML = '';
                data.forEach(student => {
                    const li = document.createElement("li"); // creating a list element for each student
                    li.innerHTML = `
                        ID: ${student.id} - Username: ${student.username} - Email: ${student.email} - Status: ${student.status}
                        <button class="approve-btn" data-id="${student.id}">Approve</button>
                        <button class="reject-btn" data-id="${student.id}">Reject</button>
                    `; // adding student info and buttons to list item
                    studentList.appendChild(li); // append/adding the list item to student list
                });

                // for approve button
                studentList.querySelectorAll(".approve-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        approveStudent(this.getAttribute("data-id")); // approving student on button click 
                    });
                });

                // for reject button
                studentList.querySelectorAll(".reject-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        rejectStudent(this.getAttribute("data-id")); // rejecting student on button click
                    });
                });
            })
            .catch(error => console.error("Error fetching students:", error)); // handle errors
    }

    // function to approve students
    function approveStudent(studentId) {
        fetch(`/api/students/${studentId}/approve`, {
            method: "POST" // sending a POST request
        })
        .then(response => {
            if (response.ok) {
                fetchStudents(); // refreshing the students list
            } else {
                throw new Error("Failed to approve student"); // handle error
            }
        })
        .catch(error => console.error("Error approving student:", error)); // handle error
    }

    // function to reject students
    function rejectStudent(studentId) {
        fetch(`/api/students/${studentId}/reject`, {
            method: "POST" // sending a POST request
        })
        .then(response => {
            if (response.ok) {
                fetchStudents(); // refreshing the students list
            } else {
                throw new Error("Failed to reject student"); // handle errors
            }
        })
        .catch(error => console.error("Error rejecting student:", error)); // handle errors
    }
});
