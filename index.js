 const { application } = require("express");
const socketIO = require("socket.io");

// this create http server--
const io = socketIO(5000, {
  cors: true,
});

const PORT = process.env.PORT || 5000;
console.log(PORT)

// konsi emailId kis room ke ander hai--
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  // console.log("sovcket Connected", socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", {email, id: socket.id})
    socket.join(room)
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
  socket.on("peer:nego:needed",({to, offer})=>{
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });
  socket.on("peer:nego:done",({to,ans})=>{
    io.to(to).emit("peer:nego:final",{from: socket.id, ans})
  });
  // socket.on("peer:nego:done", ({ to, ans }) => {
  //   console.log("peer:nego:done", ans);
  //   io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  // });
});


