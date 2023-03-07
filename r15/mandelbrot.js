/*
* Klasa reprezentująca prostokątny fragment kanwy lub obrazu. Jest
* wykorzystywana do dzielenia kanwy na regiony, które są przetwarzane
* niezależnie od siebie za pomocą wątków.
*/
class Tile {
  constructor(x, y, width, height) {
    this.x = x;                         // Właściwości obiektu Tile
    this.y = y;                         // reprezentujące położenie
    this.width = width;                 // i wielkość fragmentu
    this.height = height;               // większego prostokąta.
  }

  // Statyczna metoda generatora dzieląca prostokąt o zadanej szerokości
  // i wysokości na zadaną liczbę wierszy i kolumn, tworząca numRows*numCols
  // obiektów Tile pokrywających ten prostokąt.
  static *tiles(width, height, numRows, numCols) {
    let columnWidth = Math.ceil(width / numCols);
    let rowHeight = Math.ceil(height / numRows);

    for(let row = 0; row < numRows; row++) {
      let tileHeight = (row < numRows-1)
        ? rowHeight                                  // Wysokość większości wierszy.
        : height - rowHeight * (numRows-1);          // Wysokość ostatniego wiersza.
      for(let col = 0; col < numCols; col++) {
        let tileWidth = (col < numCols-1)
          ? columnWidth                              // Szerokość większości kolumn.
          : width - columnWidth * (numCols-1);       // Szerokość ostatniej kolumny.

        yield new Tile(col * columnWidth, row * rowHeight,
                       tileWidth, tileHeight);
      }
    }
  }
}

/*
* Klasa reprezentująca pulę wątków roboczych, z których każdy ma taki
* sam kod. Wątek odpowiada na odbierane komunikaty, wykonując zadane
* obliczenia i odsyłając komunikat zawierający uzyskane wyniki.
*
* Mając obiekt WorkerPool i komunikat opisujący zadanie do wykonania,
* wątek po prostu wywołuje metodę addWork() z komunikatem w argumencie.
* Jeżeli jest dostępny bezczynny obiekt Worker, jest mu natychmiast
* przekazywany komunikat. Jeżeli nie ma wolnych obiektów Worker,
* komunikat jest umieszczany w kolejce, a następnie przekazywany
* wolnemu obiektowi, gdy tylko się pojawi.
*
* Metoda addWork() zwraca promesę determinowaną za pomocą komunikatu odebranego
* z wątku. Promesa jest odrzucana, jeżeli wątek zgłosi nieobsłużony wyjątek.
*/
class WorkerPool {
  constructor(numWorkers, workerSource) {
    this.idleWorkers = [];           // Bezczynne obiekty Worker.
    this.workQueue = [];             // Kolejka obiektów Worker.
    this.workerMap = new Map();      // Mapa wątków i funkcji spełniających lub odrzucających promesę.

    // Utworzenie zadanej liczby wątków roboczych wraz z procedurami obsługi
    // zdarzeń "error" i "message", a następnie zapisanie ich w tablicy idleWorkers.
    for(let i = 0; i < numWorkers; i++) {
      let worker = new Worker(workerSource);
      worker.onmessage = message => {
        this._workerDone(worker, null, message.data);
      };
      worker.onerror = error => {
        this._workerDone(worker, error, null);
      };
      this.idleWorkers[i] = worker;
    }
  }

  // Wewnętrzna metoda wywoływana w chwili, gdy wątek roboczy zakończy działanie
  // poprzez wysłanie komunikatu lub zgłoszenie wyjątku.
  _workerDone(worker, error, response) {
    // Wyszukane funkcji resolve() i reject() węzła wątku, a następnie
    // usunięcie wpisu wątku z mapy.
    let [resolver, rejector] = this.workerMap.get(worker);
    this.workerMap.delete(worker);

    // Jeżeli nie ma zadań w kolejce, umieszczamy wątek z powrotem
    // w tablicy bezczynnych wątków. W przeciwnym razie pobieramy
    // zadanie z kolejki i wysyłamy je do wątku.
    if (this.workQueue.length === 0) {
      this.idleWorkers.push(worker);
    } else {
      let [work, resolver, rejector] = this.workQueue.shift();
      this.workerMap.set(worker, [resolver, rejector]);
      worker.postMessage(work);
    }

    // Na koniec spełniamy lub odrzucamy promesę skojarzoną z wątkiem.
    error === null ? resolver(response) : rejector(error);
  }

  // Metoda tworząca zadanie i zwracająca promesę determinowaną przez
  // odpowiedź, którą wątek wyśle po wykonaniu zadania. Argument work
  // jest umieszczany w komunikacie wysyłanym do widoku za pomocą
  // metody postMessage(). Jeżeli dostępny jest bezczynny wątek, komunikat
  // jest wysyłany natychmiast. W przeciwnym razie jest umieszczany
  // w kolejce, gdzie czeka na wolny wątek.
  addWork(work) {
    return new Promise((resolve, reject) => {
      if (this.idleWorkers.length > 0) {
        let worker = this.idleWorkers.pop();
        this.workerMap.set(worker, [resolve, reject]);
        worker.postMessage(work);
      } else {
        this.workQueue.push([work, resolve, reject]);
      }
    });
  }
}

/*
* Klasa przechowująca informacje o stanie, niezbędne do narysowania zbioru
* Mandelbrota. Właściwości cx i cy określają punkt na płaszczyźnie zespolonej
* będący środkiem obrazu. Właściwość perPixel określa liczbę zmian części
* rzeczywistej i urojonej liczby reprezentującej piksel. Właściwość maxIterations
* określa nakład pracy wymaganej do utworzenia zbioru. Im większa wartość,
* tym bardziej wyrazisty obraz. Zwróć uwagę, że stan nie uwzględnia wielkości
* kanwy. Dla danych wartości cx, cy i perPixel po prostu wyświetlany jest
* fragment zbioru Mandelbrota mieszczący się w kanwie o aktualnej wielkości.
*
* Instancje tej klasy są wykorzystywane z metodą history.pushState() do
* odczytywania stanu z udostępnionego lub zapisanego w zakładce adresu URL.
*/
class PageState {
  // Metoda fabryczna zwracająca początkowy stan niezbędny do
  // wyświetlenia całego zbioru.
  static initialState() {
    let s = new PageState();
    s.cx = -0.5;
    s.cy = 0;
    s.perPixel = 3/window.innerHeight;
    s.maxIterations = 500;
    return s;
  }

  // Metoda fabryczna odczytująca stan z adresu URL, zwracająca
  // wartość null, jeżeli adres nie zawiera poprawnego stanu.
  static fromURL(url) {
    let s = new PageState();
    let u = new URL(url);     // Zainicjowanie stanu za pomocą parametrów zapisanych w adresie URL.
    s.cx = parseFloat(u.searchParams.get("cx"));
    s.cy = parseFloat(u.searchParams.get("cy"));
    s.perPixel = parseFloat(u.searchParams.get("pp"));
    s.maxIterations = parseInt(u.searchParams.get("it"));
    // Zwrócenie obiektu PageState, jeżeli wartości są poprawne, lub null w przeciwnym razie.
    return (isNaN(s.cx) || isNaN(s.cy) || isNaN(s.perPixel)
            || isNaN(s.maxIterations))
            ? null
            : s;
  }

  // Metoda instancji kodująca bieżący stan w parametrach adresu URL.
  toURL() {
    let u = new URL(window.location);
    u.searchParams.set("cx", this.cx);
    u.searchParams.set("cy", this.cy);
    u.searchParams.set("pp", this.perPixel);
    u.searchParams.set("it", this.maxIterations);
    return u.href;
  }
}

// Stałe sterujące zrównolegleniem obliczeń. Można je zmienić w celu uzyskania
// optymalnej wydajności dla używanego komputera.
const ROWS = 3, COLS = 4, NUMWORKERS = navigator.hardwareConcurrency || 2;

// Główna klasa programu. Aby wyświetlić zbiór Mandelbrota, należy po prostu
// wywołać konstruktor z elementem <canvas> w argumencie. Przyjęte jest
// założenie, że element ma zdefiniowany styl i wielkość taką samą jak okno przeglądarki.
class MandelbrotCanvas {
  constructor(canvas) {
    // Zapisanie kanwy, uzyskanie obiektu kontekstu i zainicjowanie tablicy WorkerPool.
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.workerPool = new WorkerPool(NUMWORKERS, "mandelbrotWorker.js");

    // Definicje kilku właściwości, które będą wykorzystane później.
    this.tiles = null;              // Podregiony kanwy.
    this.pendingRender = null;      // Obecnie nic nie jest wyświetlane.
    this.wantsRerender = false;     // Nie ma żądania wyświetlenia zbioru.
    this.resizeTimer = null;        // Właściwość zapobiegająca zbyt częstym zmianom wielkości.
    this.colorTable = null;         // Właściwość wykorzystywana do przekształcania surowych danych
                                    // w wartości pikseli.

    // Rejestracja procedur obsługi zdarzeń.
    this.canvas.addEventListener("pointerdown", e => this.handlePointer(e));
    window.addEventListener("keydown", e => this.handleKey(e));
    window.addEventListener("resize", e => this.handleResize(e));
    window.addEventListener("popstate", e => this.setState(e.state, false));

    // Zainicjowanie stanu na podstawie adresu URL lub start z początkowym stanem.
    this.state =
      PageState.fromURL(window.location) || PageState.initialState();

    // Zapisanie stanu za pomocą mechanizmu obsługi historii.
    history.replaceState(this.state, "", this.state.toURL());

    // Ustawienie wielkości kanwy i utworzenie tablicy obszarów pokrywających kanwę.
    this.setSize();

    // Wyświetlenie zbioru Mandelbrota na kanwie.
    this.render();
  }

  // Metoda ustawiająca wielkości kanwy i inicjująca tablicę za pomocą
  // obiektów Tile. Wywoływana przez konstruktor oraz metodę handleResize()
  // po zmianie wielkości okna.
  setSize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.tiles = [...Tile.tiles(this.width, this.height, ROWS, COLS)];
  }

  // Metoda zmieniająca obiekt PageState, ponownie wyświetlająca zbiór
  // Mandelbrota w nowym stanie i zapisująca nowy stan za pomocą
  // metody history.pushState(). Jeżeli pierwszym argumentem jest
  // funkcja, jest ona wywoływana z obiektem stanu w argumencie
  // w celu wprowadzenia w nim zmian. Jeżeli pierwszym argumentem
  // metody jest obiekt, jego właściwości są po prostu kopiowane do
  // obiektu stanu. Jeżeli opcjonalny drugi argument ma wartość false,
  // to nowy stan nie jest zapisywany. Taki przypadek ma miejsce,
  // gdy metoda setState() jest wywoływana w odpowiedzi na zdarzenie "popstate".
  setState(f, save=true) {
    // Jeżeli argumentem jest funkcja, jest wywoływana w celu aktualizacji stanu.
    // W przeciwnym razie właściwości obiektu są kopiowane do bieżącego stanu.
    if (typeof f === "function") {
      f(this.state);
    } else {
      for(let property in f) {
        this.state[property] = f[property];
      }
    }

    // W obu przypadkach natychmiast rozpoczyna się wyświetlanie.
    this.render();

    // Zazwyczaj nowy stan jest zapisywany. Wyjątkiem jest wywołanie
    // metody z drugim argumentem równym false, co ma miejsce
    // w przypadku zgłoszenia zdarzenia "popstate".
    if (save) {
      history.pushState(this.state, "", this.state.toURL());
    }
  }

  // Metoda asynchronicznie wyświetlająca fragment zbioru Mandelbrota,
  // określony za pomocą obiektu PageState. Metoda jest wywoływana
  // przez konstruktor lub metodę setState() po zmianie stanu lub procedurę
  // obsługi zdarzenia zgłoszonego po zmianie wielkości kanwy.
  render() {
    // Czasami użytkownik może użyć klawiatury lub myszy, aby zażądać
    // szybszego wyświetlenia, niż jest to możliwe. Nie można wysyłać
    // wszystkich żądań do puli wątków. Zamiast tego, jeżeli trwa wyświetlanie,
    // zaznaczamy, że zbiór trzeba wyświetlić na nowo. Gdy wyświetlanie się
    // zakończy, uwzględniamy bieżący stan, pomijając ewentualne pośrednie stany.
    if (this.pendingRender) {            // Jeżeli trwa wyświetlanie...
      this.wantsRerender = true;         // ...zaznaczamy, aby ponownie wyświetlić zbiór później...
      return;                            // ...i nic więcej nie robimy.
    }

    // Odczytanie zmiennych stanu i utworzenie liczby zespolonej
    // reprezentującej lewy górny róg kanwy.
    let {cx, cy, perPixel, maxIterations} = this.state;
    let x0 = cx - perPixel * this.width/2;
    let y0 = cy - perPixel * this.height/2;

    // Dla każdego ze wszystkich ROWS*COLS regionów wywołujemy metodę
    // addWork(), umieszczając w jej argumencie komunikat dla kodu zapisanego
    // w pliku mandelbrotWorker.js. Zwróconą promesę zapisujemy w tablicy.
    let promises = this.tiles.map(tile => this.workerPool.addWork({
      tile: tile,
      x0: x0 + tile.x * perPixel,
      y0: y0 + tile.y * perPixel,
      perPixel: perPixel,
      maxIterations: maxIterations
    }));

    // Za pomocą metody Promise.all() i tablicy promes tworzymy tablicę
    // odpowiedzi. Każda odpowiedź jest wynikiem obliczeń wykonanych
    // dla jednego fragmentu. Zgodnie z komentarzem zawartym w pliku
    // mandelbrotWorker.js w odpowiedzi znajduje się obiekt Tile, obiekt ImageData
    // zawierający liczby iteracji zamiast wartości pikseli, oraz minimalna
    // i maksymalna liczba iteracji wykonanych dla wszystkich fragmentów.
    this.pendingRender = Promise.all(promises).then(responses => {

      // Najpierw określamy minimalną i maksymalną liczbę iteracji wykonanych
      // dla wszystkich fragmentów. Wartości te są potrzebne do określenia kolorów pikseli.
      let min = maxIterations, max = 0;
      for(let r of responses) {
        if (r.min < min) min = r.min;
        if (r.max > max) max = r.max;
      }

      // Teraz potrzebny jest sposób przekształcenia liczby iteracji na
      // kolory pikseli, które będą wyświetlone na kanwie. Wartości pikseli
      // muszą zawierać się w przedziale od minimalnej do maksymalnej
      // liczby iteracji. Wyliczamy wstępnie kolory i zapisujemy je w tablicy
      // colorTable. Jeżeli tablica nie została jeszcze utworzona lub nie ma
      // właściwej wielkości, tworzymy nową.
      if (!this.colorTable || this.colorTable.length !== maxIterations+1){
        this.colorTable = new Uint32Array(maxIterations+1);
      }

      // Na podstawie wartości min i max wyliczamy odpowiednie wartości
      // w tablicy kolorów. Piksele znajdujące się wewnątrz zbioru będą miały
      // nieprzezroczysty czarny kolor, a znajdujące się na zewnątrz przezroczysty
      // kolor czarny. Im większa jest liczba iteracji, tym kolor jest mniej
      // przejrzysty. Piksele z minimalną liczbą iteracji będą przezroczyste. Tło
      // jest białe, dzięki czemu obraz będzie utworzony w odcieniach szarości.
      if (min === max) {                      // Jeżeli wszystkie piksele są takie same, ...
        if (min === maxIterations) {          // ...wyświetlamy je jako czarne...
          this.colorTable[min] = 0xFF000000;
        } else {                              // ...lub przezroczyste.
          this.colorTable[min] = 0;
        }
      } else {
        // W typowym przypadku, gdy wartości min i max są różne,
        // stosujemy skalę logarytmiczną, aby każdej liczbie iteracji
        // przypisać kod z przedziału od 0 do 255, który za pomocą
        // operatora przesunięcia zamieniamy na wartość piksela.
        let maxlog = Math.log(1+max-min);
        for(let i = min; i <= max; i++) {
          this.colorTable[i] =
            (Math.ceil(Math.log(1+i-min)/maxlog * 255) << 24);
        }
      }

      // Teraz przekształcamy liczby iteracji zapisane w tablicy
      // ImageData na kody kolorów zapisane w tablicy colorTable.
      for(let r of responses) {
        let iterations = new Uint32Array(r.imageData.data.buffer);
        for(let i = 0; i < iterations.length; i++) {
          iterations[i] = this.colorTable[iterations[i]];
        }
      }

      // Na koniec za pomocą metody putImageData() wyświetlamy wszystkie
      // obiekty imageData w odpowiadających im fragmentach kanwy.
      // Wcześniej jednak usuwamy transformacje CSS kanwy, które mogły
      // być zastosowane w wyniku zgłoszenia zdarzenia "pointerdown".
      this.canvas.style.transform = "";
      for(let r of responses) {
        this.context.putImageData(r.imageData, r.tile.x, r.tile.y);
      }
    })
    .catch((reason) => {
      // W tym miejscu rejestrujemy błąd, jeżeli w którejkolwiek promesie
      // coś pójdzie źle. Coś takiego nie powinno mieć miejsca, ale jeżeli się
      // zdarzy, łatwiej będzie zdiagnozować problem.
      console.error("Promesa odrzucona w metodzie render():", reason);
    })
    .finally(() => {
      // Po zakończeniu wyświetlania kasujemy flagę pendingRender.
      this.pendingRender = null;
      // Jeżeli w trakcie wyświetlania pojawiło się żądanie ponownego
      // wyświetlenia, spełniamy je teraz.
      if (this.wantsRerender) {
        this.wantsRerender = false;
        this.render();
      }
    });
  }

  // Poniższa metoda jest wywoływana, gdy użytkownik zmieni wielkość
  // okna. Zmiana wielkości kanwy i ponowne wyświetlenie zbioru Mandlebrota
  // jest czasochłonną operacją, której nie można wykonywać zbyt często.
  // Dlatego stosujemy czasomierz odraczający zmianę wielkości o 200 ms
  // od chwili zgłoszenia ostatniego zdarzenia "resize".
  handleResize(event) {
    // Jeżeli zmiana wielkości została odroczona, zatrzymujemy czasomierz...
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    // ...i ponownie odraczamy zmianę.
    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = null;        // Zaznaczamy, że zmiana została obsłużona.
      this.setSize();                 // Zmiana wielkości kanwy i jej fragmentów.
      this.render();                  // Wyświetlenie zbioru na nowej kanwie.
    }, 200);
  }

  // Metoda wywoływana, gdy użytkownik naciśnie klawisz. Metoda setState()
  // jest wywoływana w odpowiedzi na naciśnięcia różnych klawiszy, a metoda
  // setState() wyświetla zbiór w nowym stanie, aktualizuje adres URL
  // i zapisuje stan w historii przeglądarki.
  handleKey(event) {
    switch(event.key) {
    case "Escape":         // Klawisz Esc powoduje powrót to stanu początkowego.
      this.setState(PageState.initialState());
      break;
    case "+":              // Klawisz "+" zwiększa liczbę iteracji.
      this.setState(s => {
        s.maxIterations = Math.round(s.maxIterations*1.5);
      });
      break;
    case "-":              // Klawisz "-" zmniejsza liczbę iteracji.
      this.setState(s => {
        s.maxIterations = Math.round(s.maxIterations/1.5);
        if (s.maxIterations < 1) s.maxIterations = 1;
      });
      break;
    case "o":              // Klawisz "o" pomniejsza widok.
      this.setState(s => s.perPixel *= 2);
      break;
    case "ArrowUp":        // Strzałka w górę przewija widok w górę.
      this.setState(s => s.cy -= this.height/10 * s.perPixel);
      break;
    case "ArrowDown":      // Strzałka w dół przewija widok w dół.
      this.setState(s => s.cy += this.height/10 * s.perPixel);
      break;
    case "ArrowLeft":      // Strzałka w lewo przewija widok w lewo.
      this.setState(s => s.cx -= this.width/10 * s.perPixel);
      break;
    case "ArrowRight":     // Strzałka w prawo przewija widok w prawo.
      this.setState(s => s.cx += this.width/10 * s.perPixel);
      break;
    }
  }

  // Metoda wywoływana po zgłoszeniu zdarzenia "pointerdown" oznaczającego
  // początek gestu powiększenia (kliknięcia lub dotknięcia) lub przesunięcia
  // widoku. Metoda rejestruje procedury obsługi zdarzeń "pointermove"
  // i "pointerup", aby reagować na inne gesty. Te dodatkowe procedury są
  // usuwane, gdy gest zakończy się zdarzeniem "pointerup".
  handlePointer(event) {
    // Współrzędne piksela i czas zgłoszenia początkowego zdarzenia "pointerdown".
    // Ponieważ kanwa ma taką samą wielkość jak okno, współrzędne
    // zdarzenia są takie same jak współrzędne kanwy.
    const x0 = event.clientX, y0 = event.clientY, t0 = Date.now();

    // Procedura obsługi innych zdarzeń.
    const pointerMoveHandler = event => {
      // Jakie jest przesunięcie wskaźnika i ile czasu upłynęło?
      let dx=event.clientX-x0, dy=event.clientY-y0, dt=Date.now()-t0;

      // Jeżeli wskaźnik przesunął się na odpowiednią odległość lub upłynął
      // odpowiedni czas, to oznacza, że nie było to zwykłe kliknięcie.
      // Za pomocą stylu CSS przesuwamy widok (wyświetlimy go po
      // zgłoszeniu zdarzenia "pointerup").
      if (dx > 10 || dy > 10 || dt > 500) {
        this.canvas.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    };

    // Procedura obsługi zdarzenia "pointerup".
    const pointerUpHandler = event => {
      // Gest się kończy w chwili zwolnienia przycisku myszy, więc
      // usuwamy procedury obsługi zdarzeń "pointermove" i "pointerup"
      // do chwili wykonania następnego gestu.
      this.canvas.removeEventListener("pointermove", pointerMoveHandler);
      this.canvas.removeEventListener("pointerup", pointerUpHandler);

      // Jakie jest przesunięcie wskaźnika i ile czasu upłynęło?
      const dx = event.clientX-x0, dy=event.clientY-y0, dt=Date.now()-t0;
      // Rozpakowanie obiektu stanu do osobnych stałych.
      const {cx, cy, perPixel} = this.state;

      // Jeżeli wskaźnik przesunął się na odpowiednią odległość lub upłynął
      // odpowiedni czas to oznacza, że był to gest przesunięcia i musimy
      // zmienić stan oraz centralny punkt. Jeżeli powyższe warunki nie są
      // spełnione to oznacza, że użytkownik kliknął lub dotknął punktu, w którym
      // musimy wycentrować i powiększyć widok.
      if (dx > 10 || dy > 10 || dt > 500) {
        // Użytkownik przesunął widok o (dx, dy) pikseli. Przekształcamy
        // te wartości na przesunięcie na płaszczyźnie zespolonej.
        this.setState({cx: cx - dx*perPixel, cy: cy - dy*perPixel});
      } else {
        // Wyliczenie, o ile pikseli przesunął się środek.
        let cdx = x0 - this.width/2;
        let cdy = y0 - this.height/2;
        // Szybkie i tymczasowe powiększenie widoku za pomocą stylu CSS.
        this.canvas.style.transform =
          `translate(${-cdx*2}px, ${-cdy*2}px) scale(2)`;
        // Obliczenie zespolonych współrzędnych nowego środka
        // i dwukrotne powiększenie widoku.
        this.setState(s => {
          s.cx += cdx * s.perPixel;
          s.cy += cdy * s.perPixel;
          s.perPixel /= 2;
        });
      }
    };

    // Gdy użytkownik rozpoczyna wykonywanie gestu, rejestrujemy procedury
    // obsługi zdarzeń "pointermove" i "pointerup", które zostaną zgłoszone.
    this.canvas.addEventListener("pointermove", pointerMoveHandler);
    this.canvas.addEventListener("pointerup", pointerUpHandler);
  }
}

// Na koniec przygotowujemy kanwę. Zwróć uwagę, że wykorzystywany
// jest głównie plik JavaScript. Plik HTML musi zawierać jedynie znacznik <script>.
let canvas = document.createElement("canvas"); // Utworzenie elementu kanwy...
document.body.append(canvas);                  // ...i umieszczenie go w znaczniku <body>.
document.body.style = "margin:0";              // Zerowe marginesy znacznika <body>.
canvas.style.width = "100%";                   // Ustawienie takiej samej szerokości...
canvas.style.height = "100%";                  // ...i wysokości kanwy, jak znacznika <body>...
new MandelbrotCanvas(canvas);                  // ...i rozpoczęcie rysowania na niej!
