const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  cooldown: 5,
  args: true,
  usage: '<youtube link>',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('you have to be in a voice channel');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send('needs connect permission');
    if (!permissions.has('SPEAK')) return message.channel.send('needs speak permission');

    try {
      var connection = await voiceChannel.join();
    } catch (error) {
      console.log(`error connecting to voice channel: ${error}`);
      return message.channel.send(`error connecting to voice channel ${error}`);
    }

    const dispatcher = connection.play(ytdl(args[0]))
      .on('finish', () => {
        voiceChannel.leave();
      })
      .on('error', (error) => {
        console.log(error);
      });
    dispatcher.setVolumeLogarithmic(5 / 5);
  },
};
