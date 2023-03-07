/**
* Klasa definiująca niestandardowy element <search-box> złożony z pola
* tekstowego <input> i dwóch ikon lub symboli emoji. Domyślnie po
* lewej stronie pola wyświetla lupę oznaczającą wyszukiwanie, a po
* prawej znak X oznaczający anulowanie operacji. Ukrywa ramkę pola
* tekstowego i wyświetla zewnętrzną ramkę, co sprawia wrażenie, że
* obie ikony znajdują się wewnątrz pola. Jeżeli wewnętrzne pole uzyska
* fokus, wokół całego elementu jest wyświetlana zmieniona ramka.
*
* Domyślne ikony można zmienić, umieszczając wewnątrz znacznika <search-box>
* znaczniki <span> lub <img> posiadające atrybuty slot="left" i slot="right".
*
* Znacznik <search-box> obsługuje zwykłe atrybuty disabled i hidden, jak również
* size i placeholder, funkcjonujące tak samo jak atrybuty znacznika <input>.
*
* Zdarzenia zgłaszane dla wewnętrznego znacznika <input> bąbelkują w górę.
* Właściwość target obiektu zdarzenia wskazuje element <search-box>.
*
* Element zgłasza zdarzenie "search", gdy użytkownik kliknie ikonę po lewej
* stronie (lupę). Właściwość detail obiektu zdarzenia zawiera tekst wprowadzony
* przez użytkownika. Zdarzenie to jest również zgłaszane, gdy wewnętrzne pole
* tekstowe zgłosi zdarzenie "change", tj. gdy użytkownik zmieni tekst, użytkownik
* naciśnie klawisz Enter lub Tab.
*
* Element zgłasza zdarzenie "clear", gdy użytkownik kliknie ikonę po prawej
* stronie pola (znak X). Jeżeli żadna procedura obsługi tego zdarzenia nie wywoła
* metody preventDefault(), wtedy zawartość pola tekstowego jest usuwana.
*
* Zwróć uwagę, że nie są wykorzystywane właściwości onsearch i onclear ani atrybuty.
* Procedury obsługi zdarzeń "search" i "clear" mogą być zarejestrowane wyłącznie
* za pomocą metody addEventListener().
*/
class SearchBox extends HTMLElement {
  constructor() {
    super();     // Na samym początku trzeba wywołać konstruktor klasy nadrzędnej.

    // Utworzenie zacienionego drzewa DOM i przypisanie go do tego
    // elementu. Ustawienie właściwości this.shadowRoot.
    this.attachShadow({mode: "open"});

    // Powielenie szablonu definiującego elementy potomne i arkusz stylów
    // dla niestandardowego elementu. Dołączenie zawartości do zacienionego
    // elementu głównego.
    this.shadowRoot.append(SearchBox.template.content.cloneNode(true));

    // Uzyskanie referencji do ważnych elementów zacienionego modelu DOM.
    this.input = this.shadowRoot.querySelector("#input");
    let leftSlot = this.shadowRoot.querySelector('slot[name="left"]');
    let rightSlot = this.shadowRoot.querySelector('slot[name="right"]');

    // Gdy wewnętrzne pole uzyska lub straci fokus, jest ustawiany lub
    // usuwany atrybut "focused" powodujący wyświetlenie lub usunięcie
    // ramki wokół całego komponentu. Zwróć uwagę, że zdarzenia "blur"
    // i "focus" bąbelkują i sprawiają wrażenie, że zostały zgłoszone dla
    // elementu <search-box>.
    this.input.onfocus = () => { this.setAttribute("focused", ""); };
    this.input.onblur = () => { this.removeAttribute("focused");};

    // Gdy użytkownik kliknie ikonę lupy, zgłaszane jest zdarzenie "search".
    // Jest ono również zgłaszane, gdy pole tekstowe zgłosi zdarzenie "change"
    // (zdarzenie to nie bąbelkuje poza zacieniony model DOM).
    leftSlot.onclick = this.input.onchange = (event) => {
      event.stopPropagation();          // Zablokowanie bąbelkowania zdarzenia kliknięcia.
      if (this.disabled) return;        // Jeżeli element jest zablokowany, nie jest wykonywana żadna operacja.
      this.dispatchEvent(new CustomEvent("search", {
        detail: this.input.value
      }));
    };

    // Gdy użytkownik kliknie ikonę X, zgłaszane jest zdarzenie "clear".
    // Jeżeli procedura obsługi zdarzenia nie wywoła metody preventDefault(),
    // usuwana jest zawartość pola tekstowego.
    rightSlot.onclick = (event) => {
      event.stopPropagation();          // Zablokowanie bąbelkowania zdarzenia kliknięcia.
      if (this.disabled) return;        // Jeżeli element jest zablokowany, nie jest wykonywana żadna operacja.
      let e = new CustomEvent("clear", { cancelable: true });
      this.dispatchEvent(e);
      if (!e.defaultPrevented) {        // Jeżeli zdarzenie nie zostało anulowane,
        this.input.value = "";          // zawartość pola tekstowego jest usuwana.
      }
    };
  }

  // Jeżeli któryś z atrybutów zostanie ustawiony lub zmieniony, trzeba
  // ustawić odpowiednią właściwość wewnętrznego elementu <input>.
  // Wykorzystywana jest do tego celu metoda cyklu życia wraz z poniższą
  // statyczną właściwością observedAttributes.
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      this.input.disabled = newValue !== null;
    } else if (name === "placeholder") {
      this.input.placeholder = newValue;
    } else if (name === "size") {
      this.input.size = newValue;
    } else if (name === "value") {
      this.input.value = newValue;
    }
  }

  // Na końcu są zdefiniowane gettery i settery właściwości odpowiadające
  // obsługiwanym atrybutom HTML. Gettery po prostu zwracają wartości
  // atrybutów lub informacje o ich istnieniu. Settery przypisują wartości
  // atrybutom lub tworzą je. Gdy setter zmieni wartość atrybutu,
  // przeglądarka automatycznie wywołuje zdefiniowaną wyżej metodę
  // attributeChangedCallback().

  get placeholder() { return this.getAttribute("placeholder"); }
  get size() { return this.getAttribute("size"); }
  get value() { return this.getAttribute("value"); }
  get disabled() { return this.hasAttribute("disabled"); }
  get hidden() { return this.hasAttribute("hidden"); }

  set placeholder(value) { this.setAttribute("placeholder", value); }
  set size(value) { this.setAttribute("size", value); }
  set value(text) { this.setAttribute("value", text); }
  set disabled(value) {
    if (value) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
  }
  set hidden(value) {
    if (value) this.setAttribute("hidden", "");
    else this.removeAttribute("hidden");
  }
}

// Poniższe statyczne pole jest wymagane przez metodę attributeChangedCallback().
// Metoda ta jest wywoływana tylko w przypadku zmiany któregoś
// z atrybutów wymienionych w poniższej tablicy.
SearchBox.observedAttributes = ["disabled", "placeholder", "size", "value"];

// Utworzenie elementu <template> zawierającego arkusz stylów i drzewo
// elementów. Dane te są wykorzystywane podczas tworzenia instancji
// elementu <search-box>.
SearchBox.template = document.createElement("template");

// Szablon jest inicjowany za pomocą poniższego ciągu zawierającego kod
// HTML. Zwróć uwagę, że podczas tworzenia instancji elementu <search-box>
// można po prostu powielić węzły zdefiniowane w szablonie bez ponownego
// analizowania kodu HTML.
SearchBox.template.innerHTML = `
<style>
/*
* Selektor :host oznacza element <search-box> w oświetlonym modelu
* DOM. Poniższe style są domyślne i można je zastąpić stylami zdefiniowanymi
* w oświetlonym modelu DOM.
*/
:host {
 display: inline-block;   /* Domyślnie element jest wyświetlany w wierszu. */
 border: solid black 1px; /* Zaokrąglona ramka wokół znaczników <input> i <slots>. */
 border-radius: 5px;
 padding: 4px 6px;        /* Odstępy wewnątrz ramki. */
}
:host([hidden]) {         /* Zwróć uwagę na nawiasy. Jeżeli host jest ukryty... */
 display:none;            /* ...ten atrybut powoduje, że nie jest wyświetlany. */
}
:host([disabled]) {       /* Jeżeli host posiada atrybut disabled... */
 opacity: 0.5;            /* ...jest wyświetlany w szarym kolorze. */

}
:host([focused]) {        /* Jeżeli host posiada atrybut focused... */
 box-shadow: 0 0 2px 2px #6AE;  /* wokół elementu jest wyświetlana ramka. */
}

/* Pozostała część arkusza stylów dotyczy tylko elementów w zacienionym modelu DOM. */
input {
 border-width: 0;         /* Ukrycie ramki wewnętrznego pola tekstowego. */
 outline: none;           /* Ukrycie ramki fokusu. */
 font: inherit;           /* Znacznik <input> domyślnie nie dziedziczy czcionki,... */
 background: inherit;     /* ...ani koloru tła. */
}
slot {
 cursor: default;         /* Kursor w kształcie strzałki nad przyciskami. */
 user-select: none;       /* Uniemożliwienie zaznaczenia tekstu emoji. */
}
</style>
<div>
 <slot name="left">\u{1f50d}</slot>  <!-- Kod U+1F50D symbolu lupy. -->
 <input type="text" id="input" />    <!-- Właściwe pole tekstowe. -->
 <slot name="right">\u{2573}</slot>  <!-- Kod U+2573 ikony X. -->
</div>
`;

// Na koniec wywoływana jest metoda customElement.define() rejestrująca
// element SearchBox jako implementację znacznika <search-box>.
// Nazwa niestandardowego elementu musi zawierać myślnik.
customElements.define("search-box", SearchBox);
