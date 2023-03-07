// Definicje kilku atrybutów graficznych.
c.font = "bold 60pt sans-serif";    // Duża czcionka.
c.lineWidth = 2;                    // Cienkie linie...
c.strokeStyle = "#000";             // ...w czarnym kolorze.

// Narysowanie konturu prostokąta i tekstu.
c.strokeRect(175, 25, 50, 325);     // Pionowy pasek.
c.strokeText("<canvas>", 15, 330);  // Metoda strokeText() zamiast fillText().

// Zdefiniowanie skomplikowanej ścieżki. 
polygon(c,3,200,225,200);           // Duży trójkąt.
polygon(c,3,200,225,100,0,true);    // Mniejszy wewnętrzny trójkąt.

// Zamiana ścieżki w obszar przycinania.
c.clip();

// Narysowanie ścieżki o grubości 5 pikseli, położonej wewnątrz obszaru przycinania.
c.lineWidth = 10;       // Połowa linii o grubości 10 pikseli będzie przycięta.
c.stroke();

// Wypełnienie części prostokąta i tekstu znajdujących się wewnątrz obszaru przycinania.
c.fillStyle = "#aaa";             // Jasnoszary kolor.
c.fillRect(175, 25, 50, 325);     // Wypełnienie pionowego paska.
c.fillStyle = "#888";             // Ciemnoszary kolor.
c.fillText("<canvas>", 15, 330);  // Wypełnienie tekstu.
