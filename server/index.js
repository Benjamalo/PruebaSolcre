const express = require("express");
const path = require("path");
const morgan = require("morgan");


const mysql = require("mysql");
const myConnection = require('express-myconnection')

const app = express();

//import routes
const indexRoute = require("./routes/index");

app.set("port", process.env.PORT || 5000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middlewares
app.use(morgan("dev"));
app.use(myConnection(mysql, {
    host: "localhost",
    user: "root",
    password: "benjamin2422002",
    database: "dbsolcre",
  }))
   
//routes
app.use("/", indexRoute);

app.listen(app.get("port"), () => {
  console.log("server started on port 5000");
});
// const { conectar } = require("./db");
// conectar();
