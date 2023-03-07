class TypedMap extends Map {
    constructor(keyType, valueType, entries) {
        // Sprawdzenie typu argumentu entries, jeżeli został podany.
        if (entries) {
            for(let [k, v] of entries) {
                if (typeof k !== keyType || typeof v !== valueType) {
                    throw new TypeError(`Błędny typ danych [${k}, ${v}]`);
                }
            }
        }

        // Zainicjowanie nadklasy za pomocą argumentu entries (po sprawdzeniu typu).
        super(entries);

        // Zainicjowanie podklasy poprzez zapisanie typów.
        this.keyType = keyType;
        this.valueType = valueType;
    }

    // Ponownie zdefiniowana metoda set(), sprawdzająca typy
    // danych dodawanych do mapy.
    set(key, value) {
        // Zgłoszenie wyjątku, jeżeli klucz lub wartość jest niewłaściwego typu.
        if (this.keyType && typeof key !== this.keyType) {
            throw new TypeError(`Klucz ${key} nie jest typu ${this.keyType}`);
        }
        if (this.valueType && typeof value !== this.valueType) {
            throw new TypeError(`Wartość ${value} nie jest typu ${this.valueType}`);
        }

        // Jeżeli typy są poprawne, wywoływana jest metoda set() podklasy
        // w celu dodania danych do mapy. Zwracanym wynikiem jest
        // wartość zwrócona przez metodę nadklasy.
        return super.set(key, value);
    }
}
