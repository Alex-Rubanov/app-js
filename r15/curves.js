// Funkcja pomocnicza zamieniająca stopnie na radiany.
function rads(x) { return Math.PI*x/180; }

// Uzyskanie obiektu kontekstu reprezentującego znacznik <canvas>.
let c = document.querySelector("canvas").getContext("2d");

// Zdefiniowanie niektórych atrybutów i narysowanie krzywych.
c.fillStyle = "#aaa";     // Szare wypełnienie.
c.lineWidth = 2;          // Domyślna czarna linia o grubości 2 pikseli.

// Narysowanie okręgu. Nie ma jeszcze bieżącego punktu, więc nie jest
// rysowana prosta linia łącząca bieżący punkt ze środkiem okręgu.
c.beginPath();
c.arc(75,100,50,          // Środek w punkcie (75, 100), promień 50.
      0,rads(360),false); // Łuk zgodny z ruchem wskazówek zegara, od 0 do 360 stopni.
c.fill();                 // Wypełnienie okręgu.
c.stroke();               // Narysowanie konturu.

// Narysowanie elipsy w ten sam sposób.
c.beginPath();            // Zaczynamy nową ścieżkę, która nie jest połączona z okręgiem.
c.ellipse(200, 100, 50, 35, rads(15),  // Środek, półosie i obrót.
          0, rads(360), false);        // Kąty początkowy i końcowy oraz kierunek.

// Narysowanie klina. Kąty są mierzone zgodnie z ruchem wskazówek zegara, zaczynając od dodatniej półosi X.
// Zwróć uwagę, że metoda arc() dodaje linię łączącą bieżący punkt z początkiem łuku.
c.moveTo(325, 100);       // Początek w środku okręgu.
c.arc(325, 100, 50,       // Środek i promień okręgu.
      rads(-60), rads(0), // Kąt początkowy -60 stopni, końcowy 0 stopni.
      true);              // Kierunek przeciwny do ruchu wskazówek zegara.
c.closePath();            // Dodanie odcinka prostego z powrotem do środka okręgu.

// Podobny klin, nieco przesunięty, narysowany w przeciwnym kierunku.
c.moveTo(340, 92);
c.arc(340, 92, 42, rads(-60), rads(0), false);
c.closePath();

// Przykład użycia metody arcTo() do narysowania zaokrąglonych wierzchołków.
// Tu rysujemy kwadrat z lewym górnym wierzchołkiem w punkcie (400,50)
// i o wierzchołkach zaokrąglonych z różnymi promieniami.
c.moveTo(450, 50);           // Początek w środku górnej krawędzi.
c.arcTo(500,50,500,150,30);  // Dodanie części górnego boku i górnego prawego wierzchołka.
c.arcTo(500,150,400,150,20); // Dodanie prawego boku i dolnego prawego wierzchołka.
c.arcTo(400,150,400,50,10);  // Dodanie dolnego boku i dolnego lewego wierzchołka.
c.arcTo(400,50,500,50,0);    // Dodanie lewego boku i górnego lewego wierzchołka.
c.closePath();               // Zamknięcie ścieżki w celu dodania reszty górnego boku.

// Krzywa Béziera drugiego stopnia, jeden punkt kontrolny.
c.moveTo(525, 125);                      // Początek.
c.quadraticCurveTo(550, 75, 625, 125);   // Narysowanie krzywej do punktu (625, 125).
c.fillRect(550-3, 75-3, 6, 6);           // Zaznaczenie punktu kontrolnego (550, 75).

// Krzywa Béziera trzeciego stopnia.
c.moveTo(625, 100);                      // Początek w punkcie (625, 100).
c.bezierCurveTo(645,70,705,130,725,100); // Narysowanie krzywej do punktu (725, 100).
c.fillRect(645-3, 70-3, 6, 6);           // Zaznaczenie punktów kontrolnych.
c.fillRect(705-3, 130-3, 6, 6);

// Na koniec wypełniamy krzywe i rysujemy kontur.
c.fill();
c.stroke();
