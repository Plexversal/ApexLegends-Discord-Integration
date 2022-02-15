module.exports = (client, ready) => {
    console.log(`ID: ${client.user.id}\n` +
    `User: ${client.user.tag}\n` +
    `Guilds: ${client.guilds.cache.size}\n` +
    `Users: ${client.users.cache.size}\n` +
    `Channels: ${client.channels.cache.size}\n` +
    `Successfully Ready At: ${client.readyAt}\n`)

}