const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://prince:prince123@cluster0.qissjum.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Define a user schema
const userSchema = new mongoose.Schema({
  name: String,
  status: String,
});

// Create a user model
const User = mongoose.model("User", userSchema);

// Update user status when app is opened
app.post("/api/users/open", async (req, res) => {
  try {
    const { name } = req.body;
    let user = await User.findOne({ name });

    if (!user) {
      // Create a new user if not found
      user = new User({ name, status: "online" });
    } else {
      // Update the existing user's status
      user.status = "online";
    }

    await user.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Working fine</h1>");
});

app.route("/users").get((req, res, next) => {
  res.status(200).json({
    user: [],
    success: false,
  });
});

// Update user status when app is closed or uninstalled
app.post("/api/users/close", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ name });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.status = "offline";
    await user.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
