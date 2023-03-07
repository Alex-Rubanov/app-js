/**
 * Asynchroniczne iterowalna klasa implementująca kolejkę. Metoda 
 * enqueue() umieszcza elementy w kolejce, a dequeue() usuwa je. 
 * Metoda dequeue() zwraca promesę, co oznacza, że element można 
 * usunąć przed umieszczeniem go w kolejce. Klasa posiada metody 
 * [Symbol.asyncIterator]() i next(), więc można ją stosować w pętli 
 * for/await. Pętla ta działa do chwili wywołania metody close().
 */
class AsyncQueue {
    constructor() {
        // W tej zmiennej są zapisywane elementy umieszczone w kolejce.
        this.values = [];
        // W tej tablicy są umieszczane wartości determinujące promesy, 
        // które zostały usunięte z kolejki przed dodaniem odpowiadających im wartości.
        this.resolvers = [];
        // Po zamknięciu kolejki nie można umieszczać w niej nowych elementów. 
        // Nie są również zwracane niespełnione promesy.
        this.closed = false;
    }

    enqueue(value) {
        if (this.closed) {
            throw new Error("Kolejka AsyncQueue zamknięta");
        }
        if (this.resolvers.length > 0) {
            // Jeżeli wartość została obiecana, determinujemy promesę.
            const resolve = this.resolvers.shift();
            resolve(value);
        }
        else {
            // W przeciwnym razie umieszczamy ją w kolejce.
            this.values.push(value);
        }
    }

    dequeue() {
        if (this.values.length > 0) {
            // Jeżeli w kolejce znajduje się wartość, zwracamy zdeterminowaną promesę.
            const value = this.values.shift();
            return Promise.resolve(value);
        }
        else if (this.closed) {
            // Jeżeli kolejka nie zawiera wartości i jest zamknięta, zwracamy 
            // promesę zdeterminowaną znacznikiem końca strumienia.
            return Promise.resolve(AsyncQueue.EOS);
        }
        else {
            // W przeciwnym razie zwracamy niezdeterminowaną promesę. 
            // Funkcję determinującą umieszczamy w kolejce do późniejszego wykorzystania.
            return new Promise((resolve) => { this.resolvers.push(resolve); });
        }
    }

    close() {
        // Po zamknięciu kolejki nie można w niej umieszczać elementów. 
        // Zaległe promesy determinujemy znacznikami końca strumienia.
        while(this.resolvers.length > 0) {
            this.resolvers.shift()(AsyncQueue.EOS);
        }
        this.closed = true;
    }

    // Definicja metody sprawiającej, że klasa jest asynchronicznie iterowalna.
    [Symbol.asyncIterator]() { return this; }

    // Definicja metody sprawiającej, że klasa jest asynchronicznym 
    // iteratorem. Promesa zwracana przez metodę dequeue() jest 
    // determinowana wartością lub znacznikiem końca strumienia, 
    // jeżeli kolejka jest zamknięta. Dlatego zwracana promesa musi 
    // być determinowana wynikiem iteracji.
    next() {
        return this.dequeue().then(value => (value === AsyncQueue.EOS)
                                   ? { value: undefined, done: true }
                                   : { value: value, done: false });
    }
}

// Wartość kontrolna zwracana przez metodę dequeue(), oznaczająca koniec 
// strumienia, gdy kolejka zostanie zamknięta.
AsyncQueue.EOS = Symbol("end-of-stream");

// Funkcja umieszczająca w obiekcie AsyncQueue serię zdarzeń określonego typu 
// i dotyczących określonego dokumentu. Funkcja zwraca kolejkę będącą strumieniem zdarzeń.
function eventStream(elt, type) {
    const q = new AsyncQueue();                  // Utworzenie kolejki.
    elt.addEventListener(type, e=>q.enqueue(e)); // Umieszczenie zdarzeń w kolejce.
    return q;
}

async function handleKeys() {
    // Pobranie strumienia zdarzeń keypress i przetworzenie ich za pomocą pętli.
    for await (const event of eventStream(document, "keypress")) {
        console.log(event.key);
    }
}
