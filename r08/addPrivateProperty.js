// Poniższa funkcja dodaje do obiektu o metody odczytujące i zapisujące
// wartość właściwości o zadanej nazwie. Metody uzyskują nazwy get<name>
// i set<name>. Jeżeli podana jest funkcja predykatu, setter wykorzystuje ją
// do sprawdzania poprawności argumentu przed przypisaniem go właściwości.
// Jeżeli funkcja predykatu zwróci wartość false, setter zgłosi wyjątek.
//
// Funkcja ma tę wyjątkową cechę, że wartość przetwarzana za pomocą
// gettera i settera nie jest zapisywana w obiekcie o, tylko w lokalnej zmiennej
// funkcji. Obie metody dostępowe są również zdefiniowane lokalnie, więc
// mają dostęp do tej zmiennej. Oznacza to, że jej wartość jest lokalna
// dla obu metod i nie może być przypisana ani zmieniona w inny sposób
// jak tylko za pomocą settera.
function addPrivateProperty(o, name, predicate) {
    let value;  // To jest wartość właściwości.

    // Getter po prostu zwraca wartość właściwości.
    o[`get${name}`] = function() { return value; };

    // Setter zapisuje wartość lub zgłasza wyjątek, jeżeli funkcja predykatu
    // odrzuci wartość.
    o[`set${name}`] = function(v) {
        if (predicate && !predicate(v)) {
            throw new TypeError(`set${name}: invalid value ${v}`);
        } else {
            value = v;
        }
    };
}

// Poniższy kod demonstruje użycie funkcji addPrivateProperty().
let o = {};  // Pusty obiekt.

// Dodanie metod dostępowych getName() i setName().
// Dopuszczalne są tylko ciągi znaków.
addPrivateProperty(o, "Name", x => typeof x === "string");

o.setName("Jan");         // Przypisanie wartości właściwości.
o.getName()               // => "Jan"
o.setName(0);             // !TypeError: setName: niepoprawna wartość - 0.