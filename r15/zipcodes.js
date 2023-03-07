import { lookupCity, lookupZipcodes } from "./zipcodeDatabase.js";

window.addEventListener("load", () => {
    let zipcodeInput = document.querySelector("#zipcodeInput");
    let cityOutput = document.querySelector("#cityOutput");
    zipcodeInput.onchange = () => {
        lookupCity(zipcodeInput.value, city => {
            cityOutput.value = city || "Nieznany kod";
        });
    };

    let cityInput = document.querySelector("#cityInput");
    let zipcodesOutput = document.querySelector("#zipcodesOutput");
    cityInput.onchange = () => {
        zipcodesOutput.textContent = "Pasujące kody:";
        lookupZipcodes(cityInput.value, zipcodes => {
            zipcodes.forEach(zip => {
                let item = document.createElement("li");
                item.append(`${zip.zipcode}: ${zip.city}, ${zip.state}`);
                zipcodesOutput.append(item);
            });
        });
    };
});
