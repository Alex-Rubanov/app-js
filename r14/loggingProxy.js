/*
 * Funkcja zwracająca obiekt Proxy opakowujący obiekt o, rejestrujący
 * i kierujący do niego wszystkie operacje. Ciąg znaków umieszczony
 * w argumencie objname identyfikuje obiekt i jest umieszczany w każdym
 * komunikacie. Jeżeli obiekt o ma własne właściwości, których
 * wartościami są inne obiekty lub funkcje, wtedy podczas odczytywania
 * tych właściwości zwracany jest obiekt Proxy. W efekcie rejestrowanie
 * operacji jest "zaraźliwe".
 */
function loggingProxy(o, objname) {
    // Definicje metod obiektu Proxy rejestrującego operacje.
    // Każda metoda wyświetla komunikat i kieruje operację do obiektu docelowego.
    const handlers = {
        // Ta metoda jest specjalna, ponieważ w przypadku właściwości,
        // której wartością jest obiekt lub funkcja, zwraca obiekt Proxy,
        // a nie wartość tej właściwości.
        get(target, property, receiver) {
            // Zarejestrowanie operacji.
            console.log(`Metoda get(${objname},${property.toString()})`);

            // Odczytanie wartości właściwości za pomocą interfejsu API obiektu Reflect.
            let value = Reflect.get(target, property, receiver);

            // Jeżeli jest to własna właściwość obiektu docelowego, a jej
            // wartością jest obiekt lub funkcja, to zwracanym wynikiem
            // jest obiekt Proxy.
            if (Reflect.ownKeys(target).includes(property) &&
                (typeof value === "object" || typeof value === "function")) {
                return loggingProxy(value, `${objname}.${property.toString()}`);
            }

            // W przeciwnym razie zwracana jest wartość właściwości.
            return value;
        },

        // Poniższe trzy metody niczym się nie wyróżniają. Rejestrują
        // operacje i kierują je do obiektu docelowego. Zostały zdefiniowane
        // po to, aby uniknąć nieskończonej rekurencji.
        set(target, prop, value, receiver) {
            console.log(`Metoda set(${objname},${prop.toString()},${value})`);
            return Reflect.set(target, prop, value, receiver);
        },
        apply(target, receiver, args) {
            console.log(`Metoda ${objname}(${args})`);
            return Reflect.apply(target, receiver, args);
        },
        construct(target, args, receiver) {
            console.log(`Metoda ${objname}(${args})`);
            return Reflect.construct(target, args, receiver);
        }
    };

    // Pozostałe metody są generowane automatycznie.
    // Metaprogramowanie rządzi!
    Reflect.ownKeys(Reflect).forEach(handlerName => {
        if (!(handlerName in handlers)) {
            handlers[handlerName] = function(target, ...args) {
                // Zarejestrowane operacji.
                console.log(`Metoda ${handlerName}(${objname},${args})`);
                // Przekierowanie operacji.
                return Reflect[handlerName](target, ...args);
            };
        }
    });

    // Return a proxy for the object using these logging handlers
    return new Proxy(o, handlers);
}
