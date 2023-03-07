function readOnlyProxy(o) {
    function readonly() { throw new TypeError("Tylko odczyt"); }
    return new Proxy(o, {
        set: readonly,
        defineProperty: readonly,
        deleteProperty: readonly,
        setPrototypeOf: readonly,
    });
}

let o = { x: 1, y: 2 };    // Zwykły, zapisywalny obiekt.
let p = readOnlyProxy(o);  // Wersja tylko do odczytu.
p.x                        // => 1: właściwości można odczytywać.
p.x = 2;                   // !TypeError: ale nie można ich zmieniać,
delete p.y;                // !TypeError: usuwać,
p.z = 3;                   // !TypeError: ani dodawać nowych,
p.__proto__ = {};          // !TypeError: nie można też zmieniać prototypu.