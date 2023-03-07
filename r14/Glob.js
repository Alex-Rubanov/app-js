class Glob {
    constructor(glob) {
        this.glob = glob;

        // Wewnętrznie globy implementujemy za pomocą wyrażeń regularnych.
        // Symbol ? odpowiada dowolnemu znakowi z wyjątkiem ukośnika,
        // a * odpowiada zeru lub dowolnej liczbie znaków. Wyrażenia
        // umieszczamy w grupach przechwytujących.
        let regexpText = glob.replace("?", "([^/])").replace("*", "([^/]*)");

        // Stosujemy flagę u, aby w dopasowaniach były uwzględniane znaki
        // Unicode. Glob powinien być dopasowany do całego ciągu, więc
        // umieszczamy zakotwiczenia ^ i $. Nie implementujemy metod search()
        // i matchAll(), ponieważ nie są one odpowiednie dla tego rodzaju wzorców.
        this.regexp = new RegExp(`^${regexpText}$`, "u");
    }

    toString() { return this.glob; }

    [Symbol.search](s) { return s.search(this.regexp); }
    [Symbol.match](s)  { return s.match(this.regexp); }
    [Symbol.replace](s, replacement) {
        return s.replace(this.regexp, replacement);
    }
}

let pattern = new Glob("docs/*.txt");
"docs/js.txt".search(pattern)   // => 0: dopasowanie zaczynające się od znaku na pozycji 0.
"docs/js.htm".search(pattern)   // => -1: brak dopasowania.
let match = "docs/js.txt".match(pattern);
match[0]     // => "docs/js.txt"
match[1]     // => "js"
match.index  // => 0
"docs/js.txt".replace(pattern, "web/$1.htm")  // => "web/js.htm"
