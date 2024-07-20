This project is a Node.js Express server that provides user registration and login functionality. It uses MySQL for the database and bcrypt for password hashing.

#Features
User registration with hashed passwords
User login with JWT token generation
MySQL database integration

#Prerequisites
Node.js and npm
MySQL
XAMPP (optional, for local MySQL server)

#Setup
Clone the repository:
git clone <repository-url>
cd <repository-directory>

#Install dependencies:
npm install

#Configure MySQL:
Create a database named testdb.
Create a users table:
sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) NOT NULL,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(255) NOT NULL
);
#Start the server:
node server.js

#Endpoints
1.POST /register
Registers a new user.
Body: { "firstName": "John", "lastName": "Doe", "mobileNumber": "1234567890", "password": "Password123" }
2.POST /login
Logs in a user and returns a JWT token.
Body: { "mobileNumber": "1234567890", "password": "Password123" }
