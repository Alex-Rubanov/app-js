// Funkcja rozmywająca piksele w prawą stronę w celu wywołania
// wrażenia ruchu kształtów w kierunku od strony prawej do lewej.
// Argument n musi mieć wartość 2 lub większą. Im większa wartość,
// tym większe rozmycie. Współrzędne prostokąta określa się
// w domyślnym układzie.
function smear(c, n, x, y, w, h) {
  // Uzyskanie obiektu ImageData reprezentującego prostokąt, wewnątrz którego mają być rozmyte piksele.
  let pixels = c.getImageData(x, y, w, h);

  // Kolory są rozmywane na kanwie, więc potrzebny jest tylko źródłowy
  // obiekt ImageData. Niektóre algorytmy przetwarzania obrazów
  // wymagają dodatkowego obiektu ImageData do przechowywania
  // danych przetworzonych pikseli. Gdyby był potrzebny bufor
  // wyjściowy, można utworzyć nowy obiekt w następujący sposób:
  //  let output_pixels = c.createImageData(pixels);

  // Uzyskanie wymiarów matrycy pikseli w obiekcie ImageData.
  let width = pixels.width, height = pixels.height;

  // Macierz bajtowa zawierająca surowe dane pikseli, wypełniona
  // w kierunku od lewej do prawej i od góry do dołu. Każdy piksel
  // zajmuje 4 bajty w kolejności R, G, B, A.
  let data = pixels.data;

  // Każdy piksel oprócz pierwszego jest rozmywany poprzez zastąpienie
  // jego oryginalnego koloru sumą 1/n-tej aktualnej wartości i m/n-tej
  // wartości poprzedniego piksela.
  let m = n-1;
  for(let row = 0; row < height; row++) {    // Pętla odliczająca wiersze.
    let i = row*width*4 + 4;      // Pozycja drugiego piksela w wierszu.
    for(let col = 1; col < width; col++, i += 4) {     // Pętla odliczająca kolumny.
      data[i] =   (data[i] + data[i-4]*m)/n;           // Czerwony komponent piksela,
      data[i+1] = (data[i+1] + data[i-3]*m)/n;         // zielony,
      data[i+2] = (data[i+2] + data[i-2]*m)/n;         // niebieski,
      data[i+3] = (data[i+3] + data[i-1]*m)/n;         // przezroczystość.
    }
  }

  // Skopiowanie rozmytego obrazu w to samo miejsce na kanwie.
  c.putImageData(pixels, x, y);
}
