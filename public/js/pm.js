const chatForm = document.getElementById('chat-form');
const pmForm = document.getElementById('pm-form');
const pmMessages = document.getElementById('pm-messages');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const sender = '';

// Get username and room from URL
const {receiver, username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });


// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Private messages
// Message submit
pmForm.addEventListener('submit', (e) => {  
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('pmMessage', {msg, username, receiver});

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Message submit
pm-form.addEventListener('submit', (e) => {  
  e.preventDefault();
  console.log('hi there');

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

io.on("private_message", function (data) {
    outputMessage(data.message)
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('a');
//     li.target = '_blank';
//     li.href = 'pm.html';
//     li.innerText = user.username;
//     userList.appendChild(li);
//     userList.appendChild(document.createElement('br'));
//   });
// }

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
