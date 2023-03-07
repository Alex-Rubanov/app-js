let deg = Math.PI/180;  // Formuła przekształcająca stopnie w radiany.

// Funkcja rysująca płatek Kocha n-tego rzędu w kontekście c,
// o długości boku len i w punkcie o współrzędnych (x, y).
function snowflake(c, n, x, y, len) {
  c.save();             // Zapisanie bieżącej transformacji.
  c.translate(x,y);     // Przekształcenie początku układu w punkt początkowy.
  c.moveTo(0,0);        // Utworzenie nowej podścieżki rozpoczynającej się w początku nowego układu.
  leg(n);               // Narysowanie pierwszej odnogi fraktala.
  c.rotate(-120*deg);   // Obrócenie układu o 120 stopni przeciwnie do ruchu wskazówek zegara.
  leg(n);               // Narysowanie drugiej odnogi fraktala.
  c.rotate(-120*deg);   // Ponowny obrót.
  leg(n);               // Narysowanie ostatniej odnogi.
  c.closePath();        // Zamknięcie podścieżki.
  c.restore();          // Odtworzenie oryginalnej transformacji.

  // Funkcja rysująca jedną odnogę fraktala n-tego rzędu. Ustawia bieżący
  // punkt na końcu narysowanej odnogi, a następnie przekształca układ
  // współrzędnych tak, aby bieżący punkt miał współrzędne (0, 0). Oznacza
  // to, że po narysowaniu odnogi można łatwo obrócić układ
  // współrzędnych, wywołując metodę rotate().
  function leg(n) {
    c.save();                   // Zapisanie bieżącej transformacji.
    if (n === 0) {              // Przypadek bez rekurencji.
      c.lineTo(len, 0);         // Narysowanie poziomej linii.
    }
    else {                      // Przypadek rekurencyjny: narysowanie czterech mniejszych odnóg.
      c.scale(1/3,1/3);         // Mniejsza odnoga ma wielkość 1/3 bieżącej odnogi.
      leg(n-1);                 // Rekurencyjne narysowanie pierwszej mniejszej odnogi.
      c.rotate(60*deg);         // Obrót układu współrzędnych o 60 stopni zgodnie z ruchem wskazówek zegara.
      leg(n-1);                 // Druga mniejsza odnoga.
      c.rotate(-120*deg);       // Obrót układu współrzędnych o 120 stopni zgodnie z ruchem wskazówek zegara.
      leg(n-1);                 // Trzecia mniejsza odnoga.
      c.rotate(60*deg);         // Obrót układu współrzędnych do pierwotnej pozycji.
      leg(n-1);                 // Ostatnia mniejsza odnoga.
    }
    c.restore();                // Odtworzenie transformacji.
    c.translate(len, 0);        // Translacja układu, aby koniec odnogi miał współrzędne (0, 0).
  }
}

let c = document.querySelector("canvas").getContext("2d");
snowflake(c, 0, 25, 125, 125);  // Płatek na poziomie 0 jest trójkątem,
snowflake(c, 1, 175, 125, 125); // na poziomie 1 jest sześcioramienną gwiazdą
snowflake(c, 2, 325, 125, 125); // itd.
snowflake(c, 3, 475, 125, 125);
snowflake(c, 4, 625, 125, 125); // Na poziomie 4 jest to prawdziwy płatek śniegu!
c.stroke();                     // Narysowanie bardzo skomplikowanej ścieżki.
