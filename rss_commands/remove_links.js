module.exports = {
  name: "remove_links",
  description: "Function to remove links.",
  async execute(message, args) {
    const fs = require("fs");
    var links = fs.readFileSync("cursos_txolas.txt", "UTF-8");
    var list = links.split(/\r?\n/);
    list.pop();
    var a = 1;
    var numero = args[0];
    var txolas_n = list.length;
    if (isNaN(numero)) {
      message.channel.send("Insira apenas um numero válido");
      return;
    } else {
      if (numero < list.length && numero >= 0) {
        console.log("Problema");
        list.splice(numero, 1);
        fs.writeFile("cursos_txolas.txt", list[0] + "\n", function (err) {
          if (err) return console.log(err);
        });

        while (a < list.length) {
          fs.writeFile(
            "cursos_txolas.txt",
            list[a] + "\n",
            { encoding: "UTF-8", flag: "a+" },
            function (err) {
              if (err) return console.log(err);
            }
          );
          a++;
        }
        return;
      }
    }

    links = fs.readFileSync("cursos_caloiros.txt", "UTF-8");
    list = links.split(/\r?\n/);
    list.pop();
    a = 0;
    console.log(list.length + txolas_n, numero - txolas_n);
    if (numero < list.length + txolas_n && numero >= txolas_n) {
      console.log(list);
      list.splice(numero - txolas_n, 1);
      console.log(list);
      fs.writeFile("cursos_caloiros.txt", list[0] + "\n", function (err) {
        if (err) return console.log(err);
      });

      while (a < list.length) {
        fs.writeFile(
          "cursos_caloiros.txt",
          list[a] + "\n",
          { encoding: "UTF-8", flag: "a+" },
          function (err) {
            if (err) return console.log(err);
          }
        );
        a++;
      }
      return;
    } else {
      message.channel.send("Insira apenas um numero válido");
    }
  },
};
