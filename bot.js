//discord javascript ibrary 
const Discord = require('discord.js');

//node.js file system module
const fs = require('fs')

const client = new Discord.Client();

const greetings = ['hi','hai', 'hello', 'hey']

readClientToken(function(err, data){
	var parsedData = JSON.parse(data)
	client.login(parsedData.token)
})

client.once('ready', () => {
	console.log('Fin is Ready!');
});

client.on('message', message => {
	//Only parse messages starting with '$'
	if(message.content.charAt(0) === '$'){
		const isAdmin = (message.member.user.id === message.guild.owner.id || message.member.hasPermission("ADMINISTRATOR"))
		const args = message.content.split(" ")
		console.log(args)
	
		var cmd = args[0].slice(1, args[0].length)
	
		// simple greet
		if(greetings.includes(cmd.toLowerCase())){
			message.channel.send('Hi! :D');
		}
		
		//batch nickname changing
		if (cmd === 'allNick' && isAdmin) {
			//Store all members into list
			const glist = client.guilds.get(message.guild.id + ""); 
			
			//Checks if there is a nickname specified
			if(args.length <= 1){
				message.channel.send('no nickname specified :(');
				return
			}
			
			//construct nickname from remaining tokens
			var nick = args.slice(1, args.length).join(' ')
			
			//ensure nickname is within discord's restrictions of 32 characters
			if(nick.length > 32){ 
				message.channel.send('nickname too long :(');
				return
			}
			
			//Iterate through the guild list and extract usernames	
			for (var mems of glist.members.values()) {
				modifyUserNicks(message, mems, nick)
			}
		}
		
		//batch nickname removal
		if(cmd === 'clearNicks' && isAdmin){
			const glist = client.guilds.get(message.guild.id + ""); 
			for (var mems of glist.members.values()) {
				modifyUserNicks(message, mems, '')
			}
		}
	}
});


function modifyUserNicks(message, member, newNick){
		if(member.user.id != message.guild.owner.id && !(member.user.bot) ){
			member.setNickname(newNick)
			.catch(console.error)
			console.log(member.user.username)
		}
}

function readClientToken(callback){
	fs.readFile('auth.json', "utf-8", function(err, data){
		if(err){
			return callback(err)
		}
		callback(null, token)
	})
}






