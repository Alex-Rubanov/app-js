// Funkcja definiująca wielokąt foremny o n bokach, środku w punkcie (x, y) i promieniu r.
// Wierzchołki są rozmieszczone w równych odległościach na obwodzie koła.
// Pierwszy wierzchołek jest umieszczany na samej górze lub jest przesunięty o zadany kąt.
// Kąt jest mierzony zgodnie z ruchem wskazówek zegara, chyba że ostatni atrybut ma wartość true.
function polygon(c, n, x, y, r, angle=0, counterclockwise=false) {
  c.moveTo(x + r*Math.sin(angle),    // Początek podścieżki w pierwszym wierzchołku. Współrzędne
           y - r*Math.cos(angle));   // wierzchołków są wyliczane za pomocą funkcji trygonometrycznych.
  let delta = 2*Math.PI/n;           // Odległość kątowa pomiędzy wierzchołkami.
  for(let i = 1; i < n; i++) {       // Dla każdego kolejnego wierzchołka...
    angle += counterclockwise?-delta:delta;     // ...jest wyliczany kąt...
    c.lineTo(x + r*Math.sin(angle),             // ...i rysowany odcinek.
        y - r*Math.cos(angle));
  }
  c.closePath();                     // Połączenie ostatniego wierzchołka z pierwszym.
}

// Zakładamy, że jest tylko jedna kanwa i uzyskujemy jej kontekst.
let c = document.querySelector("canvas").getContext("2d");

// Utworzenie nowej ścieżki i dodanie do niej podścieżek.
c.beginPath();
polygon(c, 3, 50, 70, 50);                   // Trójkąt.
polygon(c, 4, 150, 60, 50, Math.PI/4);       // Kwadrat.
polygon(c, 5, 255, 55, 50);                  // Pięciokąt.
polygon(c, 6, 365, 53, 50, Math.PI/6);       // Sześciokąt.
polygon(c, 4, 365, 53, 20, Math.PI/4, true); // Mały kwadrat wewnątrz sześciokąta.

// Ustawienie kilku właściwości określających wygląd obrazów.
c.fillStyle = "#ccc";    // Jasnoszare wypełnienie,...
c.strokeStyle = "#008";  // ...i ciemnoniebieski kontur...
c.lineWidth = 5;         // ...o szerokości 5 pikseli.

// Narysowanie wszystkich wielokątów (każdy jest osobną ścieżką).
c.fill();                // Wypełnienie kształtów.
c.stroke();              // Narysowanie krawędzi.
