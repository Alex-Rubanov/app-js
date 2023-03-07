/**
* Funkcja tworząca obiekt reprezentujący znacznik <svg> z umieszczonym w nim wykresem kołowym.
* Jej argumentem jest obiekt posiadający następujące właściwości:
*
*   width, height: wymiary grafiki SVG w pikselach,
*   cx, cy, r: współrzędne środka i promień wykresu,
*   lx, ly: współrzędne lewego górnego rogu legendy,
*   data: obiekt, którego nazwy właściwości będą etykietami, a ich wartości liczbami umieszczonymi przy etykietach.
*
* Funkcja zwraca obiekt reprezentujący znacznik <svg>. Aby wykres pojawił się na stronie,
* kod wywołujący tę funkcję musi wstawić obiekt do dokumentu.
*/
function pieChart(options) {
  let {width, height, cx, cy, r, lx, ly, data} = options;

  // Przestrzeń nazw XML wykorzystywana w elementach SVG.
  let svg = "http://www.w3.org/2000/svg";

  // Utworzenie elementu <svg>, określenie jego wielkości i współrzędnych.
  let chart = document.createElementNS(svg, "svg");
  chart.setAttribute("width", width);
  chart.setAttribute("height", height);
  chart.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Definicje stylów tekstów umieszczanych na wykresie.
  // Można je również zdefiniować za pomocą arkusza CSS.
  chart.setAttribute("font-family", "sans-serif");
  chart.setAttribute("font-size", "18");

  // Utworzenie tablicy zawierającej etykiety i wartości oraz określenie
  // na ich podstawie wielkości wykresu.
  let labels = Object.keys(data);
  let values = Object.values(data);
  let total = values.reduce((x,y) => x+y);

  // Wyliczenie kątów poszczególnych wycinków. Kąt początkowy wycinka
  // i jest równy angles[i], a końcowy angles[i+1]. Kąty są wyrażone w radianach.
  let angles = [0];
  values.forEach((x, i) => angles.push(angles[i] + x/total * 2 * Math.PI));

  // Pętla przetwarzająca wycinki wykresu.
  values.forEach((value, i) => {
    // Wyliczenie współrzędnych punktów przecięcia krawędzi wycinka
    // z okręgiem. Zgodnie z użytą formułą kąt 0 oznacza godzinę 12,
    // a kąty są mierzone zgodnie z ruchem wskazówek zegara.
    let x1 = cx + r * Math.sin(angles[i]);
    let y1 = cy - r * Math.cos(angles[i]);
    let x2 = cx + r * Math.sin(angles[i+1]);
    let y2 = cy - r * Math.cos(angles[i+1]);

    // Flaga oznaczająca, że kąt jest większy niż połowa okręgu.
    // Jest wymagana przez komponent SVG rysujący łuk.
    let big = (angles[i+1] - angles[i] > Math.PI) ? 1 : 0;

    // Ciąg zawierający definicję wycinka wykresu.
    let path = `M${cx},${cy}` +         // Przejście do środka okręgu.
      `L${x1},${y1}` +                  // Narysowanie linii do punktu (x1, y1).
      `A${r},${r} 0 ${big} 1` +         // Narysowanie łuku o promieniu r...
      `${x2},${y2}` +                   // ...i kończącego się w punkcie (x2, y2).
      "Z";                              // Zamknięcie kształtu w punkcie (cx, cy).

    // Wyliczenie kodu koloru wycinka. Formuła generuje tylko 15 kodów,
    // więc wykres nie może się składać z więcej niż 15 wycinków.
    let color = `hsl(${(i*40)%360},${90-3*i}%,${50+2*i}%)`;

    // Wycinek jest zdefiniowany za pomocą elementu <path>, dlatego użyta jest funkcja createElementNS().
    let slice = document.createElementNS(svg, "path");

    // Ustawienie atrybutów elementu <path>.
    slice.setAttribute("d", path);               // Ustawienie kształtu definiującego wycinek.
    slice.setAttribute("fill", color);           // Ustawienie koloru wycinka.
    slice.setAttribute("stroke", "black");       // Ustawienie czarnego koloru konturu.
    slice.setAttribute("stroke-width", "1");     // Grubość równa 1 pikselowi CSS.
    chart.append(slice);                         // Dodanie wycinka do wykresu.

    // Narysowanie małego kwadratu obok etykiety w legendzie.
    let icon = document.createElementNS(svg, "rect");
    icon.setAttribute("x", lx);                  // Współrzędne kwadratu.
    icon.setAttribute("y", ly + 30*i);
    icon.setAttribute("width", 20);              // Wielkość kwadratu.
    icon.setAttribute("height", 20);
    icon.setAttribute("fill", color);            // Kolor wypełnienia taki sam jak wycinka.
    icon.setAttribute("stroke", "black");        // Tak samo kontur.
    icon.setAttribute("stroke-width", "1");
    chart.append(icon);                          // Dodanie kwadratu do wykresu.

    // Umieszczenie etykiety po prawej stronie kwadratu.
    let label = document.createElementNS(svg, "text");
    label.setAttribute("x", lx + 30);            // Współrzędne tekstu.
    label.setAttribute("y", ly + 30*i + 16);
    label.append(`${labels[i]} ${value}`);       // Dodanie tekstu etykiety.
    chart.append(label);                         // Dodanie etykiety do wykresu.
  });
  return chart;
}
