const config = require('./config.json')
const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm')
const discord = require('discord.js');
const client = new discord.Client({ 
  fetchAllMembers: false, 
  disableEveryone: true,
  partials: [
  "USER", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE"
] });
const fs = require("fs");
const startTime = new Date().getTime()
require('dotenv').config()


client.commands = new discord.Collection();
const r = new snoowrap({
    userAgent: `${process.env.USER_AGENT}`,
    clientId: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.CLIENT_SECRET}`,
    username: `${process.env.REDDIT_USERNAME}`,
    password: `${process.env.REDDIT_PASSWORD}`
});

// command handler
fs.readdir('./commands/', (err, files) => {
            if (err) console.log(err);
            let jsfile = files.filter(f => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.log("Unable to find 'commands' file.")
                return;
            }

            jsfile.forEach((f, i) => {
                        let props = require(`./commands/${f}`);
                        console.log(` <FILE> :  ${fs.statSync(`./commands/${f}`).size}`+`   ${f} loaded.`)
    client.commands.set(props.help.name, props);
  });
  console.log(`\n---All commands loaded!---\n`)
});

// event handler
fs.readdir('./events/', (err, files) => {
  files.forEach(f => {
    if(!f.endsWith(`.js`)) return;
    const event = require(`./events/${f}`)
    const eventName = f.split(`.`)[0];
    console.log(` <FILE> :  ${fs.statSync(`./events/${f}`).size}`+`   ${f} loaded.`);
    client.on(eventName, event.bind(null, client))
  });
  console.log(`\n---All events loaded!---\n`);
});

client.login(process.env.DISCORD_TOKEN);

// REDDIT //

async function CommentStream(){
  const comments = new snoostorm.CommentStream(r, { subreddit: "apexlegends+plextestsub", limit: 50, pollTime: 3000 })
  comments.on('item', async comment => {
    if((comment.created_utc * 1000) < startTime) return;

    if(comment.subreddit.display_name.toLowerCase() == `apexlegends`) return ApexLegendsComments()

    async function ApexLegendsComments(){
      if(comment.author_flair_template_id == `d435dcee-2f4c-11e9-b7d6-0ea850af66b8`){
          client.channels.fetch(config['discord']['channelID']['testGeneral']).then(c => c.send(`**${comment.author.name}** (Respawn) made a new comment: https://reddit.com${comment.permalink}`))
          client.channels.fetch(config['discord']['channelID']['apexReddit']).then(c => c.send(`**${comment.author.name}** (Respawn) made a new comment: https://reddit.com${comment.permalink}`))
          .catch(e => console.log(`Error: ${e} Time: ${new Date(Date.now())}`))
          return;
        }
      }
  })
}

async function SubmissionStream(){

  const submissions = new snoostorm.SubmissionStream(r, { subreddit: "apexlegends+plextestsub", limit: 8, pollTime: 5000 })
  submissions.on('item', async submission => {
      if((submission.created_utc * 1000) < startTime) return;

      if(submission.subreddit.display_name.toLowerCase() == `apexlegends`) return ApexLegendsSubmissions()
      if(submission.subreddit.display_name.toLowerCase() == `plextestsub`) return PlexTestSubmissions()


      async function ApexLegendsSubmissions() {
          if(submission.author_flair_template_id == `d435dcee-2f4c-11e9-b7d6-0ea850af66b8`){
              client.channels.fetch(config['discord']['channelID']['testGeneral']).then(c => c.send(`**${submission.author.name}** (Respawn) made a new post: https://reddit.com${submission.permalink}`))
              client.channels.fetch(config['discord']['channelID']['apexReddit']).then(c => c.send(`**${submission.author.name}** (Respawn) made a new post: https://reddit.com${submission.permalink}`))
              .catch(e => console.log(`Error: ${e} Time: ${new Date(Date.now())}`))
              return;
              } 

          }

      async function PlexTestSubmissions() {
        console.log(submission.author.name)
        console.log(`https://reddit.com${submission.permalink}`)
      }

    })
}

// run
 
SubmissionStream()
CommentStream()