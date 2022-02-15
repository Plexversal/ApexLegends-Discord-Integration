const config = require('../config.json')
const discord = require('discord.js');
const util = require('util')


module.exports.run = async (client, message, args) => {
    if(message.author.id !== config.discord.ownerID) return;
    console.log(message.content)

    if(!args[0]) return message.channel.send(`Invalid code parameter`)
    
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS"))
    return message.channel.send("I do not have global attach file permissions. You will need to provide me with attach file permissions before using this command.");

    var code = args.join(" ")

    let embed = (input, output, error = false) => new discord.MessageEmbed().setColor(error ? `RED` : `GREEN`)
    .addField("Input", input)
    .addField(error ? "Error" : "Output", `\`\`\`js\n${output}\n\`\`\``)

    try {
      let evaled = await eval(code);
      if (evaled instanceof Promise) {

        evaled.then(a => {
          //a instanceof Object ? true : message.channel.send(a)
          return message.channel.send("", { embed: embed(code, a instanceof Object ? `Output fulfilled with Promise: ${util.inspect(a, { depth: 0 })}` : a) });
        }).catch(err => {
          return message.channel.send("", { embed: embed(code, err, true) });
        });
      } else {
        //evaled instanceof Object ? true : message.channel.send(evaled)
        return message.channel.send("", { embed: embed(code, evaled instanceof Object ? `Output fulfilled with Promise: ${util.inspect(evaled, { depth: 0 })}` : evaled) });
      }
    

    } catch (err) {
      message.channel.send("", { embed: embed(code, err, true) });
    }


}

module.exports.help ={
    name: "eval"
}