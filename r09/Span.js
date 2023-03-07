// Konstruktor podklasy.
function Span(start, span) {
    if (span >= 0) {
        this.from = start;
        this.to = start + span;
    } else {
        this.to = start;
        this.from = start + span;
    }
}

// Prototyp klasy Span musi dziedziczyć cechy prototypu klasy Range.
Span.prototype = Object.create(Range.prototype);

// Konstruktor Range.prototype.constructor ma nie być dziedziczony,
// dlatego definiujemy własną właściwość constructor.
Span.prototype.constructor = Span;

// Własna metoda toString() klasy Span nadpisuje metodę toString() klasy Range.
// Gdyby jej nie było, odziedziczona byłaby metoda klasy Range.
Span.prototype.toString = function() {
    return `(${this.from}... +${this.to - this.from})`;
};
