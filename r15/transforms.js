// Ścinanie.
//  x' = x + kx*y;
//  y' = ky*x + y;
function shear(c, kx, ky) { c.transform(1, ky, kx, 1, 0, 0); }

// Obrót układu o kąt theta w kierunku przeciwnym do ruchu wskazówek zegara,
// wokół punktu o współrzędnych (x, y). Ten sam efekt można osiągnąć za pomocą
// translacji, obrotu i ponownej translacji.
function rotateAbout(c, theta, x, y) {
    let ct = Math.cos(theta);
    let st = Math.sin(theta);
    c.transform(ct, -st, st, ct, -x*ct-y*st+x, x*st-y*ct+y);
}
