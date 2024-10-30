require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const PDFDocument = require("pdfkit");
const cookieParser = require("cookie-parser");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const mysqldump = require("mysqldump");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const { getMessaging } = require("firebase-admin/messaging");
const app = express();

var serviceAccount = require("./pmc-cskh-firebase-adminsdk-y7378-5122f6edc7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const credentials = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};


const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: SCOPES,
});
const drive = google.drive({
  version: "v3",
  auth: auth,
});

var corsOptions = {
  origin: [
    "*",
    "http://localhost:6666",
    "http://localhost:4000",
    "http://localhost:3000",
    "https://bds.pmcweb.vn",
  ],

  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("app/public"));

app.get("/", (req, res) => {
  res.json("Hello World BDS PMC!");
});


require("./app/routes/ent_user.route")(app);
require("./app/routes/ent_bds.route")(app);

const PORT = process.env.PORT || 8386;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
