# backend_add_to_cart
#TABLE STRUCTURE AND DESIGN
#CREATE TABLE users (
    user_id VARCHAR(100) NOT NULL PRIMARY KEY,
    user_name VARCHAR(30),
    user_email VARCHAR(50),
    password VARCHAR(100),
    user_mobile VARCHAR(21),
    created_date DATE,
    last_login DATE
);
#CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    street VARCHAR(500),
    area VARCHAR(20),
    city VARCHAR(20),
    pincode INT,
    order_items JSON,
    total_amount FLOAT,
    created_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

# How to Run the Backend Code:
step:1 create one folder name as Server or Backend
step:2 Enter Command ->npm init
step:3 npm install --- install the dependecies
step:4 node server.js
step:5 check server is running on which port number and db is connected or not if not check the  db crenditials.
step:6 create user throught postman
step:7 test all the apis is working or not.

