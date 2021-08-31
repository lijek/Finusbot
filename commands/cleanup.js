const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
  if(!hasPermission){
    msg.reply(client.config.messages.noPermission)
    return;
  }
  if (isNaN(args[0]) || args[0] > 100) {
    var embed = new Discord.MessageEmbed()
      .setTitle("Błąd.")
      .setColor(0xff0000)
      .setDescription(this.help.usage);
    msg.channel.send(embed);
    return;
  }
  var fetched = await msg.channel.messages.fetch({ limit: args[0] });
  msg.channel.bulkDelete(fetched);
}

exports.help = {
  name: 'cleanup',
  description: 'Usuwa ostatnie wiadomości, maksymalnie 100.',
  usage: 'Maksymalnie można usunąć 100 wiadomości.\n'
    + 'Prawidłowe użycie:\n'
    + "`+cleanup <ilość wiadomości do usunięcia>`\n"
    + "Przykład: `+cleanup 50`"
};