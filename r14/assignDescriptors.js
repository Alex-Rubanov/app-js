/*
 * Definicja funkcji Object.assignDescriptors() działającej podobnie jak
 * Object.assign() z tą różnicą, że kopiuje z obiektów źródłowych od obiektu
 * docelowego deskryptory właściwości, a nie tylko ich wartości,.
 * Funkcja kopiuje wszystkie własne właściwości obiektu, zarówno wyliczalne
 * jak i niewyliczalne. Ponieważ operuje na deskryptorach, kopiuje gettery z obiektów
 * źródłowych i nadpisuje settery w obiekcie docelowym, zamiast je wywoływać.
 *
 * Funkcja Object.assignDescriptors() eskaluje wyjątek zgłaszany przez funkcję
 * Object.defineProperty(). Taki przypadek ma miejsce wtedy, gdy obiekt docelowy
 * jest zapieczętowany lub zamrożony lub jest modyfikowana jego niekonfigurowalna
 * właściwość.
 *
 * Zwróć uwagę, że do obiektu Object jest dodawana właściwość assignDescriptors,
 * dzięki czemu nowa funkcja staje się niewyliczalną właściwością, podobnie jak
 * Object.assign().
 */
Object.defineProperty(Object, "assignDescriptors", {
    // Ustawienie takich samych atrybutów, jak w funkcji Object.assign().
    writable: true,
    enumerable: false,
    configurable: true,
    // Funkcja będąca wartością właściwości assignDescriptors.
    value: function(target, ...sources) {
        for(let source of sources) {
            for(let name of Object.getOwnPropertyNames(source)) {
                let desc = Object.getOwnPropertyDescriptor(source, name);
                Object.defineProperty(target, name, desc);
            }

            for(let symbol of Object.getOwnPropertySymbols(source)) {
                let desc = Object.getOwnPropertyDescriptor(source, symbol);
                Object.defineProperty(target, symbol, desc);
            }
        }
        return target;
    }
});