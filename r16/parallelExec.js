const child_process = require("child_process");
const util = require("util");
const execP = util.promisify(child_process.exec);

function parallelExec(commands) {
  // Na podstawie tablicy poleceń jest tworzona tablica obiektów Promise.
  let promises = commands.map(command => execP(command, {encoding: "utf8"}));
  // Zwracanym wynikiem jest promesa tworząca tablicę obiektów utworzonych
  // przez poszczególne promesy (zamiast obiektów zawierających właściwości
  // stdout i stderr zwracana jest po prostu wartość właściwości stdout).
  return Promise.all(promises)
    .then(outputs => outputs.map(out => out.stdout));
}

module.exports = parallelExec;
