// Za pomocą klasy Proxy tworzymy obiekt pozornie posiadający
// dowolne właściwości, których wartości są takie same, jak ich nazwy.
let identity = new Proxy({}, {
    // Każda właściwość ma swoją nazwę i wartość.
    get(o, name, target) { return name; },
    // Każda nazwa właściwości jest zdefiniowana.
    has(o, name) { return true; },
    // Właściwości jest zbyt dużo, aby je wyliczyć, więc zgłaszamy wyjątek.
    ownKeys(o) { throw new RangeError("Infinite number of properties"); },
    // Żadna z właściwości nie jest zapisywalna, konfigurowalna ani wyliczalna.
    getOwnPropertyDescriptor(o, name) {
        return {
            value: name,
            enumerable: false,
            writable: false,
            configurable: false
        };
    },
    // Wszystkie właściwości są przeznaczone tylko do odczytu, więc nie można im przypisywać wartości.
    set(o, name, value, target) { return false; },
    // Wszystkie właściwości są niekonfigurowalne, więc nie można ich usuwać.
    deleteProperty(o, name) { return false; },
    // Obiekt ma wszystkie możliwe właściwości, więc nie można definiować nowych.
    defineProperty(o, name, desc) { return false; },
    // Oznacza to, że obiekt jest nierozszerzalny.
    isExtensible(o) { return false; },
    // Obiekt ma wszystkie możliwe właściwości, więc nie może
    // dziedziczyć nowych, nawet jeżeli ma swój prototyp.
    getPrototypeOf(o) { return null; },
    // Obiekt jest nierozszerzalny, więc nie można zmieniać jego prototypu.
    setPrototypeOf(o, proto) { return false; },
});

identity.x                // => "x"
identity.toString         // => "toString"
identity[0]               // => "0"
identity.x = 1;           // Przypisanie wartości właściwości nie daje żadnego efektu.
identity.x                // => "x"
delete identity.x         // => false: nie można usunąć właściwości.
identity.x                // => "x"
Object.keys(identity);    // !RangeError: nie można uzyskać listy wszystkich kluczy.
for(let p of identity) ;  // !RangeError
