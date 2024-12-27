let express = require("express");
let connection = require("../db.js");
const Joi = require("joi");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
let app = express();
require("dotenv").config();
let { v4: uuidv4 } = require("uuid"); //random genartaion number

let signup = (user_id, user_name, user_email, password, user_mobile) => {
  return new Promise((resolve, reject) => {
    let emailChecksql = "select * from users where user_email=?";
    connection.query(emailChecksql, [user_email], (error, data) => {
      if (error) {
        return reject(error);
      } else {
        if (data?.length > 0) {
          return reject({ message: `Email Already Exists ${user_email}` });
        } else {
          let sql =
            "insert into users(user_id,user_name,user_email,password,user_mobile,created_date,last_login) values(?,?,?,?,?,?,?)";
          connection.query(
            sql,
            [
              user_id,
              user_name,
              user_email,
              password,
              user_mobile,
              new Date(),
              new Date(),
            ],
            (error, results) => {
              if (error) {
                return reject(error);
              } else {
                return resolve(results);
              }
            }
          );
        }
      }
    });
  });
};

app.post("/signup", createUsers);
async function createUsers(req, res) {
  try {
    let data = req.body;
    console.log("data", data);
    data.password = hashSync(req.body.password, 10);
    data.user_id = uuidv4();

    let insertData = await signup(
      data.user_id,
      data.name,
      data.email,
      data.password,
      data.mobile
    );
    console.log("insertData", insertData);
    return res.json({
      status: true,
      message: "Create User Successfully",
      insertData: insertData,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Email Already Exists",
    });
  }
}

let login = (email, password) => {
  return new Promise((resolve, reject) => {
    let emailChecksql = "select * from users where user_email=?";
    connection.query(emailChecksql, [email], (error, data) => {
      // console.log("data", data);
      let compare = compareSync(password, data[0].password);
      if (compare) {
        return resolve(data);
      } else {
        return reject("InValid Crenditials");
      }
    });
  });
};
app.post("/login", signin);

async function signin(req, res) {
  try {
    let data = req.body;
    let loginData = await login(data.email, data.password);
    let token = jwt.sign(loginData[0], "tastyfood", { expiresIn: "100d" });
    return res.json({
      status: 200,
      message: "login successfully",
      data: loginData,
      token: token,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Invalid Crenditials",
    });
  }
}

let createOrders = (
  order_id,
  user_id,
  street,
  area,
  city,
  pincode,
  order_items,
  total_amount,
  created_date
) => {
  return new Promise((resolve, reject) => {
    let postOrdersSql =
      "insert into orders(order_id,user_id,street,area,city,pincode,order_items,total_amount,created_date) values(?,?,?,?,?,?,?,?,?)";
    connection.query(
      postOrdersSql,
      [
        order_id,
        user_id,
        street,
        area,
        city,
        pincode,
        JSON.stringify(order_items),
        total_amount,
        created_date,
      ],
      (error, results) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(results);
        }
      }
    );
  });
};

app.post("/createOrders", orders);
async function orders(req, res) {
  try {
    let data = req.body;
    console.log("ordersData", data);
    console.log("req.user_details", req.user_details);
    data.order_id = uuidv4();
    data.created_date = new Date();
    data.user_id = req.user_details?.user_id;
    let orderResponse = await createOrders(
      data.order_id,
      data.user_id,
      data.street,
      data.area,
      data.city,
      data.pincode,
      data.order_items,
      data.total_amount,
      data.created_date
    );
    return res.json({
      status: true,
      message: "Order Is created Successfully",
      orderResponse: orderResponse,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({
      status: false,
      message: "Order Is Not Created",
    });
  }
}

// ------------------ Get List Of Orders --------------------------------//

let orderData = (user_id) => {
  return new Promise((resolve, reject) => {
    let ordersql = "select * from orders where user_id = ?";
    connection.query(ordersql, [user_id], (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
};

app.get("/orderlist", orderlist);

async function orderlist(req, res) {
  try {
    let user_id = req.user_details.user_id;
    let orderResponse = await orderData(user_id);
    return res.json({
      status:true,
      message:"Order Details Getting Success",
      orderResponse:orderResponse
    })
    
  } catch (error) {
    return res.json({
      status: false,
      message: "Order List Is Not Getting",
    });
  }
}

module.exports = app;
