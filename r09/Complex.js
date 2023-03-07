/**
 * Instancje klasy Complex reprezentują liczby zespolone. Liczba
 * zespolona składa się z części rzeczywistej i urojonej "i" równej
 * pierwiastkowi kwadratowemu z -1.
 */
class Complex {
    // Gdy deklaracja pola klasy zostanie ustandaryzowana, będzie można
    // w następujący sposób deklarować pola zawierające części
    // rzeczywistą i urojoną liczby zespolonej:
    // #r = 0;
    // #i = 0;

    // Konstruktor definiuje pola instancji r oraz i w każdej tworzonej
    // instancji. Pola te zawierają części rzeczywistą i urojoną liczby
    // zespolonej. Reprezentują one stan obiektu.
    constructor(real, imaginary) {
        this.r = real;       // To pole zawiera część rzeczywistą liczby.
        this.i = imaginary;  // To pole zawiera część urojoną liczby.
    }

    // Poniższe metody instancji dodają i mnożą liczby zespolone.
    // Mając instancje c i d tej klasy, można użyć zapisu c.plus(d)
    // lub d.times(c).
    plus(that) {
        return new Complex(this.r + that.r, this.i + that.i);
    }
    times(that) {
        return new Complex(this.r * that.r - this.i * that.i,
                           this.r * that.i + this.i * that.r);
    }

    // Poniżej znajdują się statyczne warianty metod wykonujących
    // działania arytmetyczne na liczbach zespolonych. Wywołuje się
    // je w następujący sposób: Complex.sum(c,d) lub Complex.product(c,d).
    static sum(c, d) { return c.plus(d); }
    static product(c, d) { return c.times(d); }

    // Poniżej znajduje się kilka metod instancji zdefiniowanych
    // jako gettery. Można więc używać ich tak jak pól. Gettery
    // real() i imaginary() mogą być przydatne w przypadku użycia
    // prywatnych pól this.#r oraz this.#i.
    get real() { return this.r; }
    get imaginary() { return this.i; }
    get magnitude() { return Math.hypot(this.r, this.i); }

    // Niemal każda klasa ma metodę toString().
    toString() { return `{${this.r},${this.i}}`; }

    // Zazwyczaj warto zdefiniować metodę sprawdzającą,
    // czy dwie instancje danej klasy reprezentują tę samą wartość.
    equals(that) {
        return that instanceof Complex &&
            this.r === that.r &&
            this.i === that.i;
    }

    // Gdy w ciele klasy będzie można stosować statyczne pola,
    // przydatną stałą Complex.ZERO będzie można zdefiniować
    // w następujący sposób:
    // static ZERO = new Complex(0,0);
}

// Poniżej zdefiniowanych jest kilka pól klasy zawierających
// przydatne, predefiniowane liczby zespolone.
Complex.ZERO = new Complex(0,0);
Complex.ONE = new Complex(1,0);
Complex.I = new Complex(0,1);
