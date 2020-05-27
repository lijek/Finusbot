const Discord = require('discord.js');

exports.run = async function(client, msg, args, hasPermission){
    if(!args[0]){
        var out = "";
        client.commands.forEach(komenda => {
            out += "- " + komenda.help.name + "\n";
        });
        const embed = new Discord.MessageEmbed()
            .setTitle("Pomoc")
            .setColor(0x00ff00)
            .setDescription("Wszystkie dostępne komendy: \n"+out);
        msg.channel.send(embed);
    }
    else if(client.commands.has(args[0])){
        const komenda = client.commands.get(args[0]).help;
        const embed = new Discord.MessageEmbed()
            .setTitle("Pomoc, komenda: " + komenda.name)
            .setColor(0x00ff00)
            .setDescription("Opis komendy: " + komenda.description +"\n" + komenda.usage);
        msg.channel.send(embed);
    }else{
        const embed = new Discord.MessageEmbed()
        .setTitle('Błędne użycie komendy.')
        .setColor(0xff0000)
        .setDescription(this.help.usage);
        msg.channel.send(embed);
    }
}

exports.help = {
    name: 'pomoc',
    description: 'Komenda pomoc.',
    usage: "Być może wpisano komendę, której nie ma.\n"
        + "Poprawne użycia: \n"
        + "`+pomoc` wyświetla wszystkie dostępne komendy"
        + "`+pomoc <nazwa komendy>` wyświetla poprawne użycie danej komendy"
};