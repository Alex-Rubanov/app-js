function html(strings, ...values) {
    // Konwersja wartości na ciągi znaków i zamiana znaków specjalnych na znaczniki HTML.
    let escaped = values.map(v => String(v)
                                  .replace("&", "&amp;")
                                  .replace("<", "&lt;")
                                  .replace(">", "&gt;")
                                  .replace('"', "&quot;")
                                  .replace("'", "&#39;"));

    // Zwrócenie połączonych ciągów znaków i znaczników.
    let result = strings[0];
    for(let i = 0; i < escaped.length; i++) {
        result += escaped[i] + strings[i+1];
    }
    return result;
}

let operator = "<";
html`<b>x ${operator} y</b>`             // => "<b>x &lt; y</b>"

let kind = "game", name = "D&D";
html`<div class="${kind}">${name}</div>` // =>'<div class="game">D&amp;D</div>'
