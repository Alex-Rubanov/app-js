// Najpierw definiujemy dwie proste funkcje.
const sum = (x,y) => x+y;
const square = x => x*x;

// Następnie stosujemy funkcje z metodami tablicowymi
// w celu wyliczenia średniej i odchylenia standardowego.
let data = [1,1,3,5,5];
let mean = data.reduce(sum)/data.length;  // mean == 3
let deviations = data.map(x => x-mean);
let stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));
stddev  // => 2
