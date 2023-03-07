const threads = require("worker_threads");

if (threads.isMainThread) {
  // W głównym wątku tworzymy współdzieloną typowaną tablicę
  // zawierającą jeden element. Dwa wątki będą mogły odczytywać
  // i zapisywać element sharedArray[0] w tym samym czasie.
  let sharedBuffer = new SharedArrayBuffer(4);
  let sharedArray = new Int32Array(sharedBuffer);

  // Tworzymy wątek roboczy i przekazujemy mu tablicę jako
  // wartość właściwości workerData, ponieważ wątek nie będzie
  // odbierał ani wysyłał komunikatów.
  let worker = new threads.Worker(__filename, { workerData: sharedArray });

  // Oczekujemy na uruchomienie wątku, a następnie zwiększamy
  // współdzielony element 10 milionów razy.
  worker.on("online", () => {
    for(let i = 0; i < 10_000_000; i++) sharedArray[0]++;

    // Po zakończeniu zwiększania czekamy na zgłoszenie zdarzenia
    // "message" oznaczającego zakończenie działania wątku.
    worker.on("message", () => {
      // Współdzielony element tablicy został zwiększony 20 milionów
      // razy, ale jego rzeczywista wartość jest znacznie mniejsza.
      // W moim przypadku nie przekracza 12 milionów.
      console.log(sharedArray[0]);
    });
  });
} else {
  // W wątku roboczym odczytujemy współdzieloną tablicę z właściwości
  // workerData i zwiększamy jej element 10 milionów razy.
  let sharedArray = threads.workerData;
  for(let i = 0; i < 10_000_000; i++) sharedArray[0]++;

  // Powiadamiamy wątek główny o zakończeniu operacji.
  threads.parentPort.postMessage("done");
}
