const Discord = require('discord.js');
const fs = require('fs');
const axios = require('axios');
const {
  prefix, BOT_KEY, upVote, downVote, meme_channel
} = require('./masterKey.js');

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

client.once('ready', () => {
  console.log('active');
});

client.on('messageReactionAdd', async (reaction) => {
  const discordID = Number(reaction.message.author.id);
  const discordUsername = reaction.message.author.username;
  if (reaction.users.cache.size === 1) {
    return;
  }
  if (reaction._emoji.id === upVote) {
    axios.post(`http://127.0.0.1:3000/api/users/up/${discordID}`, { username: discordUsername, karma: 1 })
      .catch((err) => console.log(err));
  }

  if (reaction._emoji.id === downVote) {
    axios.post(`http://127.0.0.1:3000/api/users/down/${discordID}`, { username: discordUsername, karma: 1 })
      .catch((err) => console.log(err));
  }
});

client.on('messageReactionRemove', async (reaction) => {
  const discordID = reaction.message.author.id;
  const discordUsername = reaction.message.author.username;
  if (reaction._emoji.id === downVote) {
    axios.post(`http://127.0.0.1:3000/api/users/up/${discordID}`, { username: discordUsername, karma: 1 })
      .catch((err) => console.log(err));
  }
  if (reaction._emoji.id === upVote) {
    axios.post(`http://127.0.0.1:3000/api/users/down/${discordID}`, { username: discordUsername, karma: 1 })
      .catch((err) => console.log(err));
  }
});

client.on('message', async (message) => {
  // handling memes
  if (message.channel.id === meme_channel) {
    message.react(message.guild.emojis.cache.get(upVote))
      .catch((err) => console.log(err));
    message.react(message.guild.emojis.cache.get(downVote))
      .catch((err) => console.log(err));
  }

  // handling commands
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

  console.log(message.content);
});

client.login(BOT_KEY);

module.exports = client;
