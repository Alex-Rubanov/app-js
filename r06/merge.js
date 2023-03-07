// Funkcja podobna do Object.assign(), która nie nadpisuje istniejących właściwości,
// jak również nie obsługuje tych, których nazwami są symbole.
function merge(target, ...sources) {
    for(let source of sources) {
        for(let key of Object.keys(source)) {
            if (!(key in target)) { // Tu jest różnica w porównaniu z funkcją Object.assign().
                target[key] = source[key];
            }
        }
    }
    return target;
}
Object.assign({x: 1}, {x: 2, y: 2}, {y: 3, z: 4})  // => {x: 2, y: 3, z: 4}
merge({x: 1}, {x: 2, y: 2}, {y: 3, z: 4})          // => {x: 1, y: 2, z: 4}
