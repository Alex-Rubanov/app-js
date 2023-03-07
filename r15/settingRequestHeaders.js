let authHeaders = new Headers();
// Jeżeli nie jest wykorzystywany protokół HTTPS, nie należy stosować podstawowego uwierzytelnienia.
authHeaders.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
fetch("/api/users/", { headers: authHeaders })
  .then(response => response.json())               // Obsługa błędów pominięta.
  .then(usersList => displayAllUsers(usersList));
