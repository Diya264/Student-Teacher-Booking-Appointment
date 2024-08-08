# Student Teacher Booking Appointment
This project is a Student Teacher Appointment Booking system. It includes functionalities for students to search for teachers, book appointments and send messages. Teachers can manage their appointments and view messages. Admins can manage teachers and approve or reject student registration. This project utilizes a combination of front-end and back-end technologies.
# Featues
## Student Dashboard
* Search for teachers by name or subject
* Book Appointment
* Send a message
* Register
## Teacher Dashboard
* Schedule Appointment
* Approve/Cancel Appointment
* View all Appointments
* View Messages
## Admin Dashboard
* Manage Teachers (Add, Update or Delete a Teacher)
* Approve/Cancel Student Registration
# Technologies Used
### Front-End
* HTML
* CSS
* JavaScript
### Back-End
* Node.js
* Express.js
* MySQL
### Additional Libraries
* js-cookie (for handling cookies)
# Installation
* ### Clone the repository
* ### Install the Dependencies
- npm install
* ### Set Up the MySQL database
* Create a new database named student_teacher
* Create necessary tables in MySQL
```
create database student_teacher;
use student_teacher;

create table teachers (
    id int auto_increment primary key,
    name varchar(100) not null,
    subject varchar(100) not null,
    department varchar(100) not null
);

create table appointments (
    id int auto_increment primary key,
    teacher_id int not null,
    student_id int not null,
    date date not null,
    time time not null,
    status enum('pending', 'approved', 'canceled') default 'pending',
    foreign key (teacher_id) references teachers(id),
    foreign key (student_id) references students(id)
);

create table messages (
    id int auto_increment primary key,
    sender_id int not null,
    receiver_id int not null,
    message text not null,
    created_at timestamp default current_timestamp
);

create table students (
    id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(100) not null
);
```
* ### Configure the database connection
* update the database configuration in db.js with your MySQL credentials.
* ### Start the Server
- node server.js
* ### Open your browser and navigate to localhost
* http://localhost:3000/index.html
# Screenshots
## Admin Dashboard
![image](https://github.com/user-attachments/assets/dd9adc28-0e0a-4b20-bbe8-e1a03f9c999f)
## Teacher Dashboard
![image](https://github.com/user-attachments/assets/77487d98-0d92-45c3-b3bb-d39572903d13)
## Student Dashboard
![image](https://github.com/user-attachments/assets/de5a438a-bc7a-43bd-96c0-1b051f8a8bd1)

