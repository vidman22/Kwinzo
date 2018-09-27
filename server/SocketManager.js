const io = require('./index.js').io;

let sessions = [];

class SessionObject {
	constructor() {
		this.connectedUsers = [];
		this.room = '';
		this.expiration = '';
	}	
}


module.exports = function(socket) {

	socket.on('NEW_ROOM', room => {
		const now = new Date();
		const time = now.getTime();
		const expiration = time + 1000*3600;
		let newRoom = new SessionObject();
		newRoom.room = room;
		newRoom.expiration = expiration;
		sessions.push(newRoom);
		socket.join(newRoom.room);
		io.to(newRoom.room).emit('JOINED');
		
	});

	socket.on('JOIN_ROOM', (room, callback) => {
		socket.join(room);
		
		let temp_room = '';
		let message = '';
		
		for ( let i = 0; i < sessions.length; i++) {
			if ( sessions[i].room === room) {
				temp_room = room;
			}
		}
		if ( temp_room ) {
			message ='';
		} else {
			message = 'no game by that code';
		}
		callback(message);

		io.to(room).emit('JOINED');
	});

	socket.on('NEW_PLAYER', (room, name, callback) => {
		const index = searchSessions( room );
		const users = sessions[index].connectedUsers;
		let message = '';
		const user = {
			playerName: name,
			id: socket.id,
			score: 0
		};
		
		if ( name.length <= 9 ) {
			if ( users.length !== 0 ) {
				for ( let i = 0; i < users.length; i++) {
					if (users[i].playerName === name ) {
						message = 'try a different name';
					} else {
						users.push(user);
						io.to(room).emit('UPDATED_PLAYERS', (room, users ));	
					} 
				break;
				}
			} else if (name.length == 0) {
				message = 'add a name';
			} else {
				users.push(user);
				io.to(room).emit('UPDATED_PLAYERS', (room, users ));
				message = '';
			}
		} else {
			message = 'try a shorter name';
		}
		callback(message);
	});


	socket.on('SHUFFLE', (room, users, cb) =>{
		const index = searchSessions( room );

		const arrayOfTeams = createTeams(users);

		sessions[index].teams = arrayOfTeams;

		cb(arrayOfTeams);
	});

	socket.on('START_GAME', (room, title, sentences) => {
		io.to(room).emit('START_GAME', title, sentences);
	});

	socket.on('SUCCESS',  (room, name, length)  => {
		const index = searchSessions(room);
		let connectedUsers = sessions[index].connectedUsers;
	
		for ( let i = 0; i < connectedUsers.length; i ++) {
			if ( connectedUsers[i].playerName === name ) {
				connectedUsers[i].score++;
				io.to(room).emit('SCORE', connectedUsers);
				if (connectedUsers[i].score == length ) {
					io.to(room).emit('WINNER', connectedUsers[i].playerName);
				}
			}
		}
	});

	socket.on('PLAY_AGAIN', (room, sentences) => {
		const index = searchSessions(room);
		let connectedUsers = sessions[index].connectedUsers;
		for (let i = 0; i < connectedUsers.length; i++) {
			connectedUsers[i].score = 0;
		}
		io.to(room).emit('PLAY_AGAIN', connectedUsers, sentences);
	})

	socket.on('disconnect', () => {
		var d = new Date();
	  	if (sessions.length != 0) {
		for ( let i = 0; i < sessions.length; i++ ) {
			for ( let j = 0; j < sessions[i].connectedUsers.length; j++){
				if (sessions[i].connectedUsers[j].id === socket.id ) {
					const id = sessions[i].connectedUsers[j].id;
					let newSessionArray = [...sessions];
					let newSession = {
						...newSessionArray[i]
					}
					newSession.connectedUsers = sessions[i].connectedUsers.filter((user) => user.id !== id);

					io.to(sessions[i].room).emit('USER_DISCONNECTED', sessions[i].connectedUsers[j]);

					newSessionArray[i] = newSession;
					sessions = newSessionArray;			
				}	
			}
	    } 
	}
		let newSessionArray = [...sessions];

			newSessionArray = sessions.filter((session) => {
				if (session.expiration < d.getTime()){
					return session.connectedUsers.length !== 0;
				} else return true;
			});
	  	sessions = newSessionArray;				
		
	});
}

searchSessions = (room) => {

	for ( let i = 0; i < sessions.length; i++ ) {
		if (sessions[i].room === room) {
			return i;
		}
	}
}

randomizeArray = (users) => {

	let array = users;
	let currentIndex = array.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;

		} return array;

}

createTeams = ( users ) => {
	
	const numberOfTeams = Math.ceil(users.length/4); 
	const array = randomizeArray(users);
	
	const firstSegment = Math.floor(array.length/numberOfTeams);
	let firstBreak = 0;
	let newBreak = Math.floor(array.length/numberOfTeams);

	let teams = [];
	
	for ( let i = 0; i < numberOfTeams; i++) {
		const team = array.slice(firstBreak, newBreak);
		newBreak = newBreak + firstSegment;
		firstBreak = firstBreak + firstSegment;
		teams.push(team);
	}
	return teams;
}

