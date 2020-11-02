module.exports = {
  name: 'info',
  description: 'Information about the arguments provided.',
  args: true,
  execute(message, args) {
    return message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};
