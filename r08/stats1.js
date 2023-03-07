let data = [1,1,3,5,5];  // Tablica liczb.

// Średnia jest sumą elementów podzieloną przez ich liczbę.
let total = 0;
for(let i = 0; i < data.length; i++) total += data[i];
let mean = total/data.length;  // mean == 3; średnia zadanych wartości jest równa 3.

// Aby wyliczyć odchylenie standardowe, najpierw należy zsumować
// kwadraty odchyleń wszystkich elementów od średniej.
total = 0;
for(let i = 0; i < data.length; i++) {
    let deviation = data[i] - mean;
    total += deviation * deviation;
}
let stddev = Math.sqrt(total/(data.length-1));  // stddev == 2
