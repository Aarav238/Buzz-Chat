const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const webpush = require("web-push");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");
const User = require("./model/userModel");





const app = express();
const socket  = require("socket.io");
require("dotenv").config();

// Trust reverse proxy (Render, Vercel, etc.) so req.ip returns the real client IP
app.set("trust proxy", 1);

webpush.setVapidDetails(
  "mailto:admin@buzzchat.app",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const allowedOrigins = process.env.ORIGIN
  ? process.env.ORIGIN.split(",").map(o => o.trim())
  : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// API request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const ip = req.ip || req.socket.remoteAddress || "-";
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms — ${ip}`);
  });
  next();
});



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "buzzChat",
}).then(()=> {
    console.log("DB connection successfull");
}).catch((err)=> {
    console.log(err.message);
});
app.use("/api/auth", userRoutes);

app.use("/api/messages", messageRoutes);




app.get("/", (req, res) => {
    res.send("Hello World!");
  });



const server = app.listen(process.env.PORT,()=>{
    console.log(`server started on Port ${process.env.PORT}`);
});  
 

const io = socket(server,{
    cors:{
       origin: allowedOrigins,
       credentials : true,
    }
});

global.onlineUsers = new Map();
io.on("connection",(socket) => {
    global.chatSocket = socket;
    socket.on("add-user",(userId) => {
        onlineUsers.set(userId, socket.id);
    });


    socket.on("send-msg", async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", { from: data.from, message: data.message });
        } else {
            // User is offline — send web push notification
            try {
                const recipient = await User.findById(data.to).select("pushSubscription username");
                if (recipient?.pushSubscription) {
                    const sender = await User.findById(data.from).select("username");
                    await webpush.sendNotification(
                        recipient.pushSubscription,
                        JSON.stringify({
                            title: sender?.username || "Buzz Chat",
                            body: data.message,
                            tag: data.from,
                        })
                    );
                }
            } catch (err) {
                console.error("Push notification failed:", err.message);
            }
        }
    });
});