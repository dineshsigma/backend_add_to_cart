# backend_add_to_cart






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
