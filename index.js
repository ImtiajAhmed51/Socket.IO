const express = require('express')
const path = require('path')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port', (process.env.PORT || 3000));
app.use(express.static('public')); 
console.log("outside io");
var usersList=[];
var groupList = [];
io.on('connection', function(socket){
    console.log('Connected');
    socket.on('join', function(user){
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i]['id']==user['id']) {
                io.emit('join',false);
                break;
            }else if(i==usersList.length-1){
                usersList.push(user);
                io.emit('join',true);
                io.emit('AllUsers', usersList);
            }
        }
        if(usersList.length==0){
            usersList.push(user);
            io.emit('join',true);
            io.emit('AllUsers', usersList);
        }
        console.log('new user add=>',user);
    });
    socket.on('updateStatus', function(User){
        console.log("updateStatus"+User)
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i]['id']==User['id']) {
                usersList[i]['isOnline']=User['isOnline'];
                io.emit('AllUsers', usersList);
                console.log('Update Status=>',User);
                break;
            }
        }
    });
    socket.on('AllUsers', function(user){
        io.emit('AllUsers',usersList);
        console.log('AllUsers=>',user);
    });
    socket.on('UpdateProfile', function(User){
        console.log("UpdateProfile"+User)
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i]['id']==User['id']) {
                usersList[i]['image']=User['image'];
                usersList[i]['username']=User['username'];
                io.emit('AllUsers', usersList);
                console.log('UpdateProfile=>',User);
                break;
            }
        }
    });
    socket.on('on typing', function(typing){
        console.log('on typing=>',typing);
        io.emit('on typing', typing);
    });
    socket.on('chat message', function(msg){
        console.log('Message=>',msg);
        io.emit('chat message', msg);
    });
    socket.on('privateMessage',function(data){
        console.log('privateMessage=>',data);
        io.emit(data['id'], data['message']);
    });
    socket.on('delete', function(User){
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i]['id']==User['id']) {
                usersList.slice(i,1);
                io.emit('AllUsers', usersList);
                break
            }
        }
        console.log('delete=>',usersList);
    });
    socket.on('Group', function(Group){
       groupList.push(Group)
       io.emit('Group',Group);
       console.log('new Group add=>',Group);
       io.emit('AllGroup',groupList);
    });
    socket.on('AllGroup', function(Group){
       io.emit('AllGroup',groupList);
    });
     
});
http.listen(app.get('port'), function() {
    console.log('Node JS Server app is running on port', app.get('port'));
});