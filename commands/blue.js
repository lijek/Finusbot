var value = 255;

exports.process = async function(image){
  await image.color([{apply:'blue', params: [value]}, {apply:'red', params: [0]}, {apply:'green', params: [0]}]);
}

exports.run = async (client, msg, args, hasPermission) => {
  if(typeof args[0] !== "undefined" && !isNaN(args[0])){
    value = args.shift();
  }
  else if(typeof args[1] !== "undefined" && !isNaN(args[1]))
    value = args[1];
  client.util.image(client, msg, args, this);
}

exports.help = {
  name: "blue",
  description: "Komenda szuka ostatniego obrazka w ostatnich dziesięciu"
    + " wiadomościach na danym kanale, robi ten obrazek **n i e b i e s k i**.",
  usage: "Prawidłowe użycie:\n"
    + "+blue `<url - opcjonalnie jak nie ma obrazka wyżej jako linka do obrazka lub w postaci adnotacji>`"
}