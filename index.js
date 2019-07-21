var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(8080);



var userOnlineList = [];

io.on("connection", function(socket){
    console.log("co 1 ket noi den server, socket id: " + socket.id);
    socket.emit("list_user_online", userOnlineList);
    socket.on("client_request_username", function(data){
        console.log("co nguoi dang ky username: " + data);
        if(userOnlineList.indexOf(data)>=0){
            socket.emit("server_response_dky_thatbai", data);
        }else{
            userOnlineList.push(data);
            socket.Username = data;
            io.sockets.emit("server_response_dky_thanhcong", {username:data, id:socket.id});
            socket.emit("response_hide_dky_form", data);
        }
    });
    
    socket.on("client_send_message", function(data){
        io.sockets.emit("server_response_message", {username:socket.Username, msg:data});
    });
});

app.get("/", function(req, res){
    res.render("trangChu");
});

app.get("/chat", function(req, res){
    res.render("chat");
});
