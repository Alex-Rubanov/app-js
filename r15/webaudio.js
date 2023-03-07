// Zaczynamy od utworzenia obiektu AudioContext. Przeglądarka Safari
// wymaga, aby zamiast niego użyć obiektu webkitAudioContext.
let audioContext = new (this.AudioContext||this.webkitAudioContext)();

// Definicja dźwięku bazowego jako kombinacji trzech fal sinusoidalnych.
let notes = [ 293.7, 370.0, 440.0 ]; // Akord D-dur: dźwięki D, F# i A.

// Utworzenie oscylatorów dla trzech nut, które mają być odegrane.
let oscillators = notes.map(note => {
  let o = audioContext.createOscillator();
  o.frequency.value = note;
  return o;
});

// Kształtowanie dźwięku poprzez zmienianie jego głośności.
// Na początku szybko zwiększamy ją do maksimum.
// Po upływie 0,1 sekundy powoli zmniejszamy do zera.
let volumeControl = audioContext.createGain();
volumeControl.gain.setTargetAtTime(1, 0.0, 0.02);
volumeControl.gain.setTargetAtTime(0, 0.1, 0.2);

// Dźwięk wysyłamy do domyślnego miejsca przeznaczenia,
// czyli głośników.
let speakers = audioContext.destination;

// Podłączenie wszystkich źródeł dźwięku do panelu obiektu sterującego głośnością.
oscillators.forEach(o => o.connect(volumeControl));

// Połączenie wyjścia obiektu sterujące głośnością z głośnikami.
volumeControl.connect(speakers);

// Odtwarzanie dźwięków przez 1,25 sekundy.
let startTime = audioContext.currentTime;
let stopTime = startTime + 1.25;
oscillators.forEach(o => {
  o.start(startTime);
  o.stop(stopTime);
});

// Aby utworzyć sekwencję dźwięków, można użyć procedury obsługi zdarzenia.
oscillators[0].addEventListener("ended", () => {
  // Ta procedura jest wywoływana po zakończeniu odtwarzania dźwięku.
});
