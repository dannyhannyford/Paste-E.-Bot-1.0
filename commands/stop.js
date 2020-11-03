module.exports = {
  name: 'stop',
  cooldown: 5,
  async execute(message) {
    if (!message.member.voice.channel) return message.channel.send('you need to be in vc to stop');
    message.member.voice.channel.leave();
  },
};
