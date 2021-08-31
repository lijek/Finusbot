exports.processCommand = async function (message, client) {
  const rl = client.rl;
  rl.prompt();
  const args = message.split(' ');
  const command = args.shift();
  switch (command) {
    case 'exit':
      client.watchers.forEach(watcher => {
        watcher.close();
      });
      client.destroy();
      client.fs.writeFileSync('./data.json', JSON.stringify(client.data));
      rl.close();
      break;
    case 'save':
    case 'zapisz':
      client.fs.writeFileSync('./data.json', JSON.stringify(client.data));
      client.log('Zapis danych pomyślnych!');
      break;
    case 'serwery':
      client.log('Lista dostępnych serwerów:');
      var i = 0;
      client.guilds.cache.array().forEach(guild => {
        i++;
        client.log(`${i}) ${guild.name} @ ID: ${guild.id}, właściciel: ${guild.owner.user.username}`);
      });
      break;
    case 'kanały':
      if (isNaN(args[0])) {
        client.log('W argumentach masz podać ID serwera tłuku!');
        break;
      }
      client.guilds.fetch(args[0]).then(guild => {
        client.log(guild.name);
        if (guild == undefined || guild == null) {
          client.log('Serwer z takim ID nie istnieje, lub coś zostało źle wpisane :c');
          return;
        }
        client.log(`Lista kanałów na serwerze z ID ${args[0]}, czyli ${guild.name}:`);
        var i = 0;
        guild.channels.cache.forEach(channel => {
          i++;
          client.log(`${i}) ${channel.name} @ ID: ${channel.id}`);
        });
      });
      break;
    case 'kanał':
      if (isNaN(args[0])) {
        client.log('W argumentach masz podać ID kanału tłuku!');
        break;
      }
      await client.channels.fetch(args[0]).then(function(channel){
        client.channel = channel;
      });
      client.log(`Pomyślnie wybrano kanał z ID ${args[0]} o nazwie "${client.channel.name}"`);
      break;
    case 'wyślij':
      if(client.channel == null || client.channel == undefined){
        client.log('Nie wybrano kanału, wybierz go za pomocą komendy \'kanał <id kanału>\'');
        break;
      }
      if(args.join(' ') == ''){
        client.log('Podaj terść wiadomości downie!');
        break;
      }
      client.channel.send(args.join(' '));
      break;
    case 'config':
      /* client.log('Wyświetlam plik konfiguracyjny: ');
      client.log1(client.config); */
      client.log('Wyświetlam plik konfiguracyjny:');
      client.log1(client.config);
      break;
    case 'obrazek':
      client.log('OBRAZEK KEKW');
      client.log1(await client.terminalImage.file('./kekw.png'));
      break;
    case 'obrazek1':
        client.log('OBRAZEK KEKW');
        if(args[0])
          client.log1(await client.terminalImage.file('./' + args[0]));
        break;
    case 'client':
      console.log(client);
      client.repairOutput()
      break;
    case '?':
    case 'pomoc':
    case 'help':
      client.log('Komendy:\n'
      + '1) exit - wyjście z bota\n'
      + '2) serwery - wyświetla listę serwerów na których jest bot\n'
      + '3) kanały <id serwera> - wyświetla listę dostępnych kanałów na serwerze\n'
      + '4) kanał <id kanału> - wybiera kanał, z którego wiadomości będą wyświetlały się w konsoli i będzie można też z niej wysłać wiadomości\n'
      + '5) wyślij <wiadomość> - wysyła wiadomość do uprzednio wybranego kanału\n'
      + '6) ? lub pomoc lub help - wyświetla tą listę\n')
      break;
    default:
      client.log(`Nie ma takiej komendy: ${command}, spróbuj użyć komendy "?" aby zobaczyć listę dostępnych komend`);
      break;
  }
}