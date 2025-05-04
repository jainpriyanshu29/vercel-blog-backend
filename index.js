const express = require("express");
const app = express();
const connectDB = require("./dbconfig");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const ContactModel = require("./schemas/Contact");
const SignupModel = require("./schemas/Signup");
const ArticleModel = require("./schemas/Article");
const multer = require("multer");
const authenticateUser = require("./auth");
require("dotenv").config();

const port = 8800;

// cors setup
app.use(cors());
app.use(cors({
  origin: "https://vercel-frontend-eight-swart.vercel.app", // your actual Vercel domain
  credentials: true
}));


connectDB();
app.use(bodyParser.json());

// contact api
let contacts = [];
app.post("/contact", async (req, res) => {
  const data = req.body;
  if (
    !data.name ||
    !data.email ||
    !data.phone_number ||
    !data.topic ||
    !data.message
  ) {
    res.send({ success: false, message: "Please Fill The Column" });
  }
  else {
    const userData =
    {
      name: data.name,
      email: data.email.toLowerCase(),
      phone_number: data.phone_number,
      topic: data.topic,
      message: data.message,
    };
    const newUser = await ContactModel.create(userData);
    res.send({
      success: true, message: "Your Given Data Successfully Submit", data: newUser,
    });
  }
  console.log(data);
});
//////////////////////////////////////////////////////////////////////////
// signup api
// upload image

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
//   normal file uplaod
//   var upload = multer({ storage: storage })

// using filter

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//   yadi limit lgani ho to
let upload = multer({
  storage: storage,
  limits: {
    // only 5mb size file
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

let users = [];
app.post("/signup", upload.single("myfile"), async (req, res) => {
  const data = req.body;
  if (data.email) {
    const user = await SignupModel.findOne({ email: data.email.toLowerCase() });
    if (user) {
      res.send({ success: false, message: "user already exit" });
    } else {
      const signupData = {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        phone_number: data.phone_number,
        topic: data.topic,
        image: req.file.path,
      };

      const newSignup = await SignupModel.create(signupData);
      res.send({
        success: true,
        message: "Your Given Data Successfully Submit",
        data: newSignup,
      });
    }
  } else {
    res.send({ success: false, message: "no data found" });
  }
  console.log(data);
});

///////////////////////////////////////////////////////////////////////////////
// add task api
const storages = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./post");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// const upload = multer({storage : storages})
app.post("/add", multer({ storage: storages }).single("mypost"), authenticateUser, async (req, res) => {
  const data = req.body;

  const taskData = {
    email: req.email,
    author: data.author,
    title: data.title,
    article: data.article,
    articleimage: req.file.path,
  };

    if (taskData.author && taskData.title && taskData.article) {
      const newTask = await ArticleModel.create(taskData);
      res.send({
        success: true,
        message: "Your Given Data Successfully Submit",
        data: newTask,
      });
    }
    else
    {
      res.send({ success: false, message: "No data Submit" });
    }
  } 

);

//////////////////////////////////////////////////////////////////////////////

// login api

app.post("/login", async (req, res) => {
  const data = req.body;
  if (data.email && data.password) {
    const user = await SignupModel.findOne({ email: data.email.toLowerCase() });
    if (user) {
      if (user.password === data.password) {
        const token = jwt.sign({ email: user.email }, process.env.SECERET_KEY);
        console.log(token);

        res.send({
          success: true,
          message: "Login Successfully",
          token: token,
        });
      } else {
        res.send({ success: false, message: "Password is incorrect" });
      }
    } else {
      res.send({ success: false, message: "User Not Found" });
    }
  } else {
    res.send({ success: false, message: "No data Found" });
  }
});

////////////////////////////////////////////////////////////////////////////////

//get task

app.get("/getdata", authenticateUser, async (req, res) => {
  const resp = await ArticleModel.find({ email: req.email });
  if (resp) {
    res.send({ success: true, data: resp });
  } else {
    res.send({ success: false, data: "no data found" });
  }
});

////////////////////////////////////////////////////////////////////////////////
// single post

app.get("/blog/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (id) {
      const Blog = await ArticleModel.findById(id);
      res.status(200).send({ success: true, data: Blog })
    }
  } catch (error) { }
});

///////////////////////////////////////////////////////////////////////////////


app.delete("/delete-task/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const result = await ArticleModel.deleteOne(
    { _id: taskId }
  )
  res.send({ success: true, message: " task Deleated successfully" })
})

/////////////////////////////////////////////////////////////////////////////


app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});


// /////////////////////////////////////////////////////////////////////////
// check for vercel running or not
app.get("/" , (req,res)=>{
  res.send("Welcome to backend code...")
})
