const express = require('express');
const app = express();
const mysql = require("mysql");

const con = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: 'MyPassword',
  database: 'todo'
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected");
})

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
var warning_msg = "";

app.get('/', (req, res) => {
  console.log(warning_msg);
  con.query(
    'SELECT * FROM users', 
    (error, results) => {
      res.render('index.ejs', {items : results,
      msg : warning_msg});
    }
  );
});

app.post("/importance-sort", (req, res) => {
  warning_msg = "";
  con.query(
    "SELECT * FROM users ORDER BY importance DESC",
    (error, results) => {
      res.render('index.ejs', {items : results,
      msg : ""})
    }
  );
});

app.post("/task-sort", (req, res) => {
  warning_msg = "";
  con.query(
    "SELECT * FROM users ORDER BY task DESC",
    (error, results) => {
      res.render('index.ejs', {items : results,
      msg : ""})
    }
  );
});

app.post("/id-sort", (req, res) => {
  res.redirect("/");
});

app.post("/create", (req, res) => {
  if (req.body.Task === "") {
    warning_msg = "タスクを入力してください。";
    res.redirect('/');
  } else { 
    warning_msg = "";
    if (req.body.Importance === "") {
      var importance = 0;
    } else {
      var importance = parseInt(req.body.Importance,10);
      con.query(
        'INSERT INTO users (task, importance) VALUES (?, ?)',
        [req.body.Task, importance],
        (error, results) => {
          res.redirect('/');
        }
      );
    }

  }
});


app.listen(3000);
