// Metoda canvas.toBlob() jest opakowaniem procedury
// obsługi zdarzenia zwracającej promesę.
async function getCanvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve);
  });
}

// Funkcja wysyłająca do serwera plik PNG zawierający obraz kanwy.
async function uploadCanvasImage(canvas) {
  let pngblob = await getCanvasBlob(canvas);
  let formdata = new FormData();
  formdata.set("canvasimage", pngblob);
  let response = await fetch("/upload", { method: "POST", body: formdata });
  let body = await response.json();
}
