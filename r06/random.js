// Ten obiekt ma właściwości dostępowe zwracające liczby losowe.
// Na przykład wyrażenie "random.octet" przy każdym użyciu
// ma inną losową wartość z zakresu od 0 do 255.
const random = {
    get octet() { return Math.floor(Math.random()*256); },
    get uint16() { return Math.floor(Math.random()*65536); },
    get int16() { return Math.floor(Math.random()*65536)-32768; }
};
