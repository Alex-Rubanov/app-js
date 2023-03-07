// Prosta podklasa klasy Array, rozbudowana o gettery zwracające pierwszy i ostatni element.
class EZArray extends Array {
    get first() { return this[0]; }
    get last() { return this[this.length-1]; }
}

let a = new EZArray();
a instanceof EZArray  // => true: a jest instancją podklasy.
a instanceof Array    // => true: a jest również instancją nadklasy.
a.push(1,2,3,4);      // a.length == 4; można stosować odziedziczone metody.
a.pop()               // => 4: inna odziedziczona metoda.
a.first               // => 1: pierwszy getter zdefiniowany w podklasie.
a.last                // => 3: drugi getter zdefiniowany w podklasie.
a[1]                  // => 2: zwykła składnia odwołania do instancji podklasy działa normalnie.
Array.isArray(a)      // => true: instancja podklasy jest w rzeczywistości tablicą.
EZArray.isArray(a)    // => true: podklasa dziedziczy również metody statyczne.

// EZArray dziedziczy metody instancji, ponieważ prototyp
// EZArray.prototype dziedziczy cechy Array.prototype.
Array.prototype.isPrototypeOf(EZArray.prototype) // => true

// Ponadto EZArray dziedziczy metody statyczne i właściwości,
// ponieważ pochodzi od Array. Jest to specjalna cecha słowa
// kluczowego extends, niedostępnego w wersjach języka starszych niż ES6.
Array.isPrototypeOf(EZArray) // => true










