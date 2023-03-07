// Jeżeli liczba całkowita 0x00000001 jest zapisana w pamięci jako ciąg
// 01 00 00 00, oznacza yo że system jest typu little-endian. W systemie
// typu big-endian liczba ta jest zapisana jako ciąg 00 00 00 01.
let littleEndian = new Int8Array(new Int32Array([1]).buffer)[0] === 1;
