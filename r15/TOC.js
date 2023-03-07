/**
* TOC.js: Utworzenie spisu treści dokumentu.
*
* Ten skrypt jest uruchamiany po zgłoszeniu zdarzenia DOMContentLoaded.
* Automatycznie tworzy spis treści dokumentu. Nie definiuje żadnych
* globalnych symboli, więc nie powinien kolidować z innymi skryptami.
*
* Skrypt najpierw szuka w dokumencie elementu z atrybutem id="TOC". Jeżeli
* go nie znajdzie, tworzy nowy na początku dokumentu. Następnie wyszukuje
* wszystkie znaczniki od <h1> do <h6>, traktuje je jako tytuły sekcji i wykorzystuje
* do utworzenia spisu treści w elemencie TOC. Do każdego tytułu dodaje numer
* sekcji i przekształca w nazwane odnośniki. Nazwy odnośników zaczynają się
* od prefiksu "TOC", którego nie należy stosować w dokumencie.
*
* Utworzonym wpisom w spisie można nadać style CSS. Wszystkie
* wpisy mają atrybut class="TOCEntry". Są im również przypisane
* klasy odpowiadające poziomom sekcji. Dla znacznika <h1> jest
* tworzony wpis z klasą "TOCLevel1", dla znacznika <h2> wpis
* z klasą "TOCLevel2" itd. Każdy numer sekcji ma przypisany atrybut
* class="TOCSectNum".
*
* Arkusz stylów może mieć następującą postać:
*
*   #TOC { border: solid black 1px; margin: 10px; padding: 10px; }
*   .TOCEntry { margin: 5px 0px; }
*   .TOCEntry a { text-decoration: none; }
*   .TOCLevel1 { font-size: 16pt; font-weight: bold; }
*   .TOCLevel2 { font-size: 14pt; margin-left: .25in; }
*   .TOCLevel3 { font-size: 12pt; margin-left: .5in; }
*   .TOCSectNum:after { content: ": "; }
*
* Aby ukryć numery sekcji, należy użyć następującego stylu:
*
*   .TOCSectNum { display: none }
**/
document.addEventListener("DOMContentLoaded", () => {
  // Wyszukanie elementu, w którym zostanie umieszczony spis treści.
  // Jeżeli element nie istnieje, jest tworzony na początku dokumentu.
  let toc = document.querySelector("#TOC");
  if (!toc) {
    toc = document.createElement("div");
    toc.id = "TOC";
    document.body.prepend(toc);
  }

  // Wyszukanie wszystkich nagłówków. Przyjęte jest założenie, że
  // tytuł dokumentu znajduje się w znaczniku <h1>, a tytuły sekcji
  // w znacznikach od <h2> do <h6>.
  let headings = document.querySelectorAll("h2,h3,h4,h5,h6");

  // Zainicjowanie tablicy, w której będą umieszczane numery sekcji.
  let sectionNumbers = [0,0,0,0,0];

  // Przetwarzanie w pętli znalezionych elementów nagłówków.
  for(let heading of headings) {
    // Pominięcie nagłówków umieszczonych w elemencie spisu treści.
    if (heading.parentNode === toc) {
      continue;
    }

    // Sprawdzenie poziomu nagłówka.
    // Odjęcie jedności, ponieważ <h2> oznacza nagłówek na poziomie 1.
    let level = parseInt(heading.tagName.charAt(1)) - 1;

    // Zwiększenie numeru sekcji i ustawienie wszystkich
    // poniższych numerów na 0.
    sectionNumbers[level-1]++;
    for(let i = level; i < sectionNumbers.length; i++) {
      sectionNumbers[i] = 0;
    }

    // Złączenie numerów sekcji ze wszystkich poziomów
    // i utworzenie oznaczenia typu "2.3.1".
    let sectionNumber = sectionNumbers.slice(0, level).join(".");

    // Dołączenie numeru sekcji do treści nagłówka.
    // Umieszczenie numeru w znaczniku <span>, aby można mu było nadać styl.
    let span = document.createElement("span");
    span.className = "TOCSectNum";
    span.textContent = sectionNumber;
    heading.prepend(span);

    // Umieszczenie nagłówka wewnątrz nazwanego odnośnika.
    let anchor = document.createElement("a");
    let fragmentName = `TOC${sectionNumber}`;
    anchor.name = fragmentName;
    heading.before(anchor);        // Umieszczenie odnośnika przed nagłówkiem
    anchor.append(heading);        // i przeniesienie nagłówka do odnośnika.

    // Utworzenie odnośnika do sekcji.
    let link = document.createElement("a");
    link.href = `#${fragmentName}`;         // Miejsce docelowe odnośnika.

    // Skopiowanie tekstu nagłówka do odnośnika. Jest to przykład bezpiecznego
    // użycia właściwości innerHTML. Nie przypisujemy jej nieznanego ciągu znaków.
    link.innerHTML = heading.innerHTML;

    // Umieszczenie odnośnika w znaczniku div, aby można mu było
    // nadać styl odpowiedni do poziomu nagłówka.
    let entry = document.createElement("div");
    entry.classList.add("TOCEntry", `TOCLevel${level}`);
    entry.append(link);

    // Dodanie znacznika div do elementu zawierającego spis treści.
    toc.append(entry);
  }
});
