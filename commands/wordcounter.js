const Discord = require("discord.js");


exports.isCommand = false;
/**
 * @param {Discord.Client} client client
 * @param {Discord.Message} msg message
 * @param {Array} args parameters array
 * @param {boolean} hasPermission check if author has permission
 */
exports.run = async (client, msg, args, hasPermission) => {
  if(!args[0]){
    var embed = new Discord.MessageEmbed()
      .setTitle("Błąd.")
      .setColor(0xff0000)
      .setDescription("Nie podano słowa :c.");
      msg.channel.send(embed);
      return;
  }

  const words = client.config.wordsToCount;
  const content = msg.content.trim();

  var person = msg.mentions.users.first();

  if(!person)
    person = msg.author.toString();

  for (var i in words) {
    const word = words[i];
    var key;
    var filter;
    if (word.type === "regex") {
      filter = new RegExp(word.filter, word.flags);
      if (!content.match(filter)) {
        continue;
      }
    } else if (word.type === "exact") {
      filter = word.filter
      if (!content.includes(filter)) {
        continue;
      }
    }

    key = `${msg.author.id}.wordCounter.${word.filter}`;
    const count = client.util.getOrSetData(key, client.data, 0);

    var reply = word.type === "exact" ? "słowo " + word.filter : "słowa które wpisują się w regułę RegEx /" + word.filter + "/" + word.flags + " ";
    reply += count + " ";
    reply += count == 0 ? "raz" : "razy";
    
    var embed = new Discord.MessageEmbed()
      .setTitle("Task failed successfully!")
      .setColor(0x555555)
      .setDescription(`Użytkownik ${person} wysłał ${reply}!`);
      msg.channel.send(embed);
      return;
  }
}