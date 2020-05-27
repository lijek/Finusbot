exports.process = async function(image){
  await image.invert();
}

exports.run = async (client, msg, args, hasPermission) => {
  client.util.image(client, msg, args, this);
}

exports.help = {
  name: "invert",
  description: "Komenda szuka ostatniego obrazka w ostatnich dziesięciu"
    + " wiadomościach na danym kanale, odwraca kolory obrazka.",
  usage: "Prawidłowe użycie:\n"
    + "+invert `<url - opcjonalnie jak nie ma obrazka wyżej jako linka do obrazka lub w postaci adnotacji>`"
}