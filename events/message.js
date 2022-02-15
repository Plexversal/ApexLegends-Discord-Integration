const discord = require('discord.js')
const config = require('../config.json')

module.exports = (client, message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
  
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);
  
    if(!command.startsWith(config.discord.prefix)) return;
  
    let cmd = client.commands.get(command.slice(config.discord.prefix.length).toLowerCase())
    if(cmd) cmd.run(client, message, args)
    console.log(message.content)
}