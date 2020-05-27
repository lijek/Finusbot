exports.process = async function(image){
  await image.grayscale();
}

exports.run = async (client, msg, args, hasPermission) => {
  client.util.image(client, msg, args, this);
}

exports.help = {
  name: "grayscale",
  description: "Komenda szuka ostatniego obrazka w ostatnich dziesięciu"
    + " wiadomościach na danym kanale, robi ten obrazek czarnobiały.",
  usage: "Prawidłowe użycie:\n"
    + "+grayscale `<url - opcjonalnie jak nie ma obrazka wyżej jako linka do obrazka lub w postaci adnotacji>`"
}