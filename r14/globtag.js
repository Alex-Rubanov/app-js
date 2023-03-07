function glob(strings, ...values) {
    // Połączenie ciągów i wartości w jeden ciąg.
    let s = strings[0];
    for(let i = 0; i < values.length; i++) {
        s += values[i] + strings[i+1];
    }
    // Zwrócenie reprezentacji ciągu.
    return new Glob(s);
}

let root = "/tmp";
let filePattern = glob`${root}/*.html`;  // Alternatywne wyrażenie regularne.
"/tmp/test.html".match(filePattern)[1]   // => "test"
