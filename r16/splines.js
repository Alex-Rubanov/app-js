const threads = require("worker_threads");
// Moduł "worker_threads" eksportuje właściwość logiczną isMainThread
// przyjmującą wartość true, jeżeli kod jest uruchomiony w głównym wątku,
// lub false, jeżeli w wątku roboczym. Właściwość ta jest wykorzystana
// do uruchomienia w obu wątkach tego samego kodu.
if (threads.isMainThread) {
  // Jeżeli kod jest uruchomiony w głównym wątku, wystarczy jedynie
  // wyeksportować funkcję. Funkcja ta, zamiast wykonywać czasochłonne
  // operacje w głównym wątku, wykonuje zadanie w wątku roboczym
  // i zwraca promesę determinowaną po zakończeniu jego działania.
  module.exports = function reticulateSplines(splines) {
    return new Promise((resolve,reject) => {
      // Utworzenie wątku roboczego ładującego i uruchamiającego
      // kod z tego samego pliku, co wątek główny. Zwróć uwagę
      // na użycie specjalnej zmiennej __filename.
      let reticulator = new threads.Worker(__filename);
      // Przekazanie wątkowi roboczemu kopii tablicy splines.
      reticulator.postMessage(splines);
      // Spełnienie promesy po odebraniu komunikatu z wątku
      // roboczego lub odrzucenie jej w przypadku pojawienia się błędu.
      reticulator.on("message", resolve);
      reticulator.on("error", reject);
    });
  };
} else {
  // Ta część kodu jest wykonywana w wątku roboczym. Rejestrujemy
  // procedurę obsługi komunikatów wysyłanych przez główny wątek. Odebrany
  // ma być tylko jeden komunikat, więc procedurę rejestrujemy za pomocą
  // funkcji once(), a nie on(). Dzięki temu wątek po wykonaniu zadania zakończy
  // działanie w zwykły sposób.
  threads.parentPort.once("message", splines => {
    // Po odebraniu tablicy splines wysłanej przez główny wątek
    // przetwarzamy jej elementy za pomocą pętli.
    for(let spline of splines) {
      // Na potrzeby tego przykładu przyjęto założenie, że obiekt
      // spline ma metodę reticulate() wykonującą czasochłonne obliczenia.
      spline.reticulate ? spline.reticulate() : spline.reticulated = true;
    }
    // Po przeliczeniu wszystkich elementów tablicy splines
    // odsyłamy jej kopię do wątku głównego.
    threads.parentPort.postMessage(splines);
  });
}
