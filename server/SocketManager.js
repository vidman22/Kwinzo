const io = require('./index.js').io;

let sessions = [];



module.exports = function(socket) {
	
	socket.on('NEW_ROOM', (room, title) => {
		console.log('room', room);
		let newRoom = {
			connectedUsers: [],
			title,
			room,
			teams : [],
		};

		sessions.push(newRoom);
		socket.join(room);
		console.log('sessions', sessions);
		
	});

	socket.on('JOIN_ROOM', (room, callback) => {
		//console.log('socket join room', socket.id);
		
		let message = '';
		let title = '';
		
		for ( let i = 0; i < sessions.length; i++) {
			if ( sessions[i].room === room) {
				title = sessions[i].title;
				socket.join(room);
				break;
			} else {
				message = 'no game by that code';
			}
		}
		console.log('sessions in join', sessions);
		callback(message, title);
	});

	socket.on('NEW_PLAYER', (room, name, callback) => {
		const index = searchSessions( room );
		console.log('session index', index);
		if (index !==undefined) {
			
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
	} else callback('reload page');
	});


	socket.on('SHUFFLE', (room, users, cb) =>{
		const index = searchSessions( room );

		let arrayOfTeams = createTeams(users);

		arrayOfTeams = arrayOfTeams.map((team, index) => {
			const obj = {
				players: team,
				name: `Team ${index + 1}`
			}
			return obj;
		});
		sessions[index].teams = arrayOfTeams;
		cb(arrayOfTeams);
	});

	socket.on('START_GAME', (room, title, sentences, teamMode) => {
		io.to(room).emit('START_GAME', title, sentences, teamMode);
	});

	socket.on('SUCCESS',  (room, name, length, teamMode)  => {
		const index = searchSessions(room);
		let connectedUsers = sessions[index].connectedUsers;
		const teams = sessions[index].teams;
		if (!teamMode){
			for ( let i = 0; i < connectedUsers.length; i ++) {
				if ( connectedUsers[i].playerName === name ) {
					connectedUsers[i].score++;
					io.to(room).emit('SCORE', connectedUsers);
					if (connectedUsers[i].score == length) {
						io.to(room).emit('WINNER', connectedUsers[i].playerName);
					}
				}
			}
		} else {
			
			let teamFinished = true;
			for (let i = 0; i < teams.length; i++) {
				for (let j =0; j < teams[i].players.length; j ++){
					if(teams[i].players[j].playerName === name ) {
						teams[i].players[j].score++;
						io.to(room).emit('SCORE', teams);
					}
					if(teams[i].players[j].score === length){
						teamFinished = true && teamFinished;
					} else {
						teamFinished = false;
					}
				}
				if (teamFinished){
					io.to(room).emit('WINNER', teams[i].name);
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
	});

	socket.on('disconnect', () => {
		
	  	if (sessions.length != 0) {
		for ( let i = 0; i < sessions.length; i++ ) {
			for ( let j = 0; j < sessions[i].connectedUsers.length; j++){
				if (sessions[i].connectedUsers[j].id === socket.id ) {
					let newSessionArray = [...sessions];
					let newSession = {
						...newSessionArray[i]
					}
					newSession.connectedUsers = sessions[i].connectedUsers.filter((user) => user.id !== socket.id);
					
					io.to(sessions[i].room).emit('USER_DISCONNECTED', sessions[i].connectedUsers[j]);
					
					newSessionArray[i] = newSession;
					
					sessions = newSessionArray;
					// sessions = sessions.filter((session) => session.connectedUsers.length !== 0);
				}	
			}
	    } 
	}
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
	
	const teamNum = Math.ceil(users.length/4); 
	const array = randomizeArray(users);
	
	teams = array.reduce((r, v, i ) => {
		r[i% teamNum] = r[i% teamNum] || [];
		r[i % teamNum].push(v);
		return r;
	}, [])
	return teams;
}

