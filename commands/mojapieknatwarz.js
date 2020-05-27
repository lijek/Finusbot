const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
  const file = new Discord.MessageAttachment('./SUNIF.png');
    var embed = new Discord.MessageEmbed()
      .setTitle("Moja piękna twarz UwU")
      .setColor(0x00ff00)
      .setDescription("Cudowna, no nie?.")
      .setImage('attachment://SUNIF.png');
      msg.channel.send({embed: embed, files: [file]});

}

exports.help = {
  name: "mojapieknatwarz",
  description: "MOJA TWARZ JEST IDEALNA.",
  usage: "Prawidłowe użycie:\n"
    + "+mojapieknatwarz"
}