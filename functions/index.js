const express = require("express");
const dotenv = require("dotenv");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const { generateUniqueFileName } = require("./helper/helper.js");
const { NymPostseven } = require("./services/nymPost_7.jsx");
const { createMug } = require("./controllers/mug/mugController.js");
const { createHoodie } = require("./controllers/hoodie/hoodieController.js");
const { createTShirt } = require("./controllers/tshirt/tshirtController.js");
const { createCandle } = require("./controllers/candle/candlecontroller.js");
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp();

const app = express();
const connectDB = require("./config/dbConnection.js");
const cronHelper = require("./helper/cronHelper.js");
const pending = require("./routes/pending_route.js");
const scheduled = require("./routes/scheduling_route.js");
const instaPost = require("./routes/posttoInsta.js");

app.use(express.json());

const RETRY_INTERVAL = 50000;

// Create images and save them
/*const createAndSaveImages = async () => {
  console.log("Starting image creation...");

  try {
    const black4oz = new NymPostseven({
      width: 1080,
      height: 1080,
      nymFontSize: "207px",
      nymLineHeight: "181px",
      definitionFontSize: "27px",
      definitionLineHeight: "29px",
      Nym: "Snackrobatics",
      Definition:
        "The art of balancing multiple snacks in one hand and performing other tasks",
      NymColor: "#000000",
      formatNym: false,
      nymTop: 350,
      definitionTop: 869,
      nymWidth: 1080,
      nymHeight: 333,
      definitionWidth: 787,
      definitionHeight: 65,
      distanceBetweenTexts: 20,
      backgroundImageUrl: "https://i.imgur.com/4pM1pgM.jpeg",
    });

    // Build the image
    const blackImage_1 = await black4oz.build({ format: "png" });
    const blackFileName_1 = generateUniqueFileName();
    const imageDir = path.join(__dirname, "../../public/assets/images");

    // Ensure directory exists
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
      console.log(`Created directory: ${imageDir}`);
    }

    const blackFilePath_1 = path.join(imageDir, blackFileName_1);

    // Save the image
    fs.writeFileSync(blackFilePath_1, blackImage_1);
    console.log("Image created and saved at:", blackFilePath_1);
  } catch (error) {
    console.error("Error during image creation:", error);
  }
};*/

// Retry logic for MongoDB connection
async function connectWithRetry() {
  while (true) {
    try {
      await connectDB();
      console.log("Connected to MongoDB");
      break;
    } catch (error) {
      console.error(
        "Failed to connect to MongoDB. Retrying in 50 seconds...",
        error
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}

// Retry logic for token check
async function tokenCheckWithRetry() {
  while (true) {
    try {
      await cronHelper.checkTokenAndRefresh();
      console.log("Token check and refresh completed successfully");
      break;
    } catch (error) {
      console.error("Token check failed. Retrying in 10 seconds...", error);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}

// Initialization logic
async function initializeApp() {
  await connectWithRetry();
  await tokenCheckWithRetry();

  console.log("Initializing app...");
  //await createAndSaveImages();
  console.log("App initialized successfully.");
  /*await createHoodie(
    (name = "Snackrobaticssss"),
    (type = "1"),
    (definition =
      "The art of balancing multiple snacks in one hand and performing other tasks"),
    (tags = []),
    (product_description = "Hello this is sample product")
  );*/
}

// Routes
app.use("/api", pending);
app.use("/api", scheduled);
app.use("/api", instaPost);

app.get("/", (req, res) => {
  console.log("API is running!");
  res.send("API is running!");
});

// Firebase Function that serves your Express app
/*exports.api = functions.https.onRequest(async (req, res) => {
  console.log("Handling request...");
  await initializeApp();
  app(req, res); // Handles the request
});*/

initializeApp().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 5000");
  });
});
