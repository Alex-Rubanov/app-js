(function updateClock() { // Funkcja modyfikująca kod SVG zegara tak, aby pokazywał bieżący czas.
  let now = new Date();                         // Bieżący czas.
  let sec = now.getSeconds();                   // Sekundy.
  let min = now.getMinutes() + sec/60;          // Ułamek minuty.
  let hour = (now.getHours() % 12) + min/60;    // Ułamek godziny.
  let minangle = min * 6;                       // 6 stopni na każdą minutę.
  let hourangle = hour * 30;                    // 30 stopni na każdą godzinę.

  // Wyszukanie elementów SVG reprezentujących wskazówki.
  let minhand = document.querySelector("#clock .minutehand");
  let hourhand = document.querySelector("#clock .hourhand");

  // Ustawienie atrybutu SVG w celu obrócenia wskazówek wokół środka tarczy.
  minhand.setAttribute("transform", `rotate(${minangle},50,50)`);
  hourhand.setAttribute("transform", `rotate(${hourangle},50,50)`);

  // Ponownie wywołanie funkcji po upływie 60 sekund.
  setTimeout(updateClock, 60000 );
}()); // Natychmiastowe wywołanie funkcji.
