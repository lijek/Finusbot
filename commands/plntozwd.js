const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
  if(typeof args[0] !== "undefined" && !isNaN(args[0]))
    msg.reply(args[0] + " złotych to " + (args[0]*client.config.plninzwd) + " dolarów Zimbabwe.");
  else{
    var embed = new Discord.MessageEmbed()
      .setTitle("Błąd.")
      .setColor(0xff0000)
      .setDescription("Nie podano ilości złotówek.");
      msg.channel.send(embed)
  }
}

exports.help = {
  name: "plntozwd",
  description: "Komenda konwertuje złotówki na dolary Zimabwe.",
  usage: "Prawidłowe użycie:\n"
    + "+plntozwd `<ilość złotych>`"
}