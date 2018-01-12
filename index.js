var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
var engine = require('ejs-locals');
app.engine('ejs', engine);
// create server
var server = require("http").createServer(app);
server.listen(process.env.PORT || 3000, function() {
    console.log("Created Server: port " + server.address().port);
});

// Config socket.IO
var io = require("socket.io")(server);
// on (dc hieu : lang nghe cai j do)
// emit (phat tin hieu)
/*
// demo task1
io.on("connection", function(socket) {
    console.log("Co nguoi connected:" + socket.id);
    socket.on("disconnect", function() {
        console.log(socket.id + ": Da ngat ket noi");
    });

    // Lang nghe client-send-data
    socket.on("client-send-data", function(data) {
        console.log(data);
        // server gửi cho tất cả mọi người (userA: send data for userA,userB,UserC)
        //io.sockets.emit("server-send-data", data + "999");
        // ai phát tín hiệu lên, server chỉ phát lại cho đó (userA: send data for userA)
        //socket.emit("server-send-data", data + "888");
        // A phát tín hiệu lên, và gửi cho những người còn lại (userA: send data for userB, UserC)
        //socket.broadcast.emit("server-send-data", data + "777");
        // chat private
        io.to("H2JB3HL7QQwnFHcDAAAG").emit("server-send-data", data + "777");
    });
});
*/
var arrUser = [];
io.on("connection", function(socket) {
    console.log(socket);
    console.log("Co nguoi connected:" + socket.id);
    // socket.on ai gửi lêm server, server chỉ send data về ng đó 
    socket.on("client-send-username", function(data) {
        // tìm kiếm trong mảng, xem user này đã được đk hay chưa.
        if (arrUser.indexOf(data) >=0) { // user đã tồn tại trong mảng
            // fail
            // server phat tin hieu cho ng dk fail
            socket.emit("server-send-register-fail");
        } else {
            // success
            arrUser.push(data); // add user to arr
            socket.UserName = data;
            //console.log(socket);
            // server phat tin hieu cho ng dk thanh cong
            socket.emit("server-send-register-success", data);
            io.sockets.emit("server-send-list-users", arrUser);
        }
    })
    socket.on("client-send-logout", function() {
        arrUser.splice(arrUser.indexOf(socket.UserName), 1);
        socket.broadcast.emit("server-send-list-users", arrUser);
    });
    // server lang nghe client send mes
    socket.on("user-send-messeage", function(data) {
        var content = {
            userName: socket.UserName,
            messeage: data
        }
        io.sockets.emit("server-send-messeage", content);
    });

    socket.on("user-inputing", function() {
        //console.log(socket.UserName + ' inputing...')
        socket.broadcast.emit("server-send-input", socket.UserName);
    });
    socket.on("user-stop-input", function() {
        //console.log(socket.UserName + ' stop input...')
        socket.broadcast.emit("server-stop-input", socket.UserName);
    });
});

app.get("/", function(req, res) {
    res.render('pages/home', { 
        title: 'Home page',
        description : "A Blog Theme by Start Bootstrap"
    });
})

app.get("/about", function(req, res) {
    res.render('pages/about', { 
        title: 'About page',
        description : "This is About page"
    });
})

app.get("/contact", function(req, res) {
    res.render('pages/contact', { 
        title: 'Contact page',
        description : "This is Contact page"
    });
})

app.get("/chat", function(req, res) {
    res.render('pages/chat', { 
        title: 'Chat page',
        description : "This is Chat page"
    });
})