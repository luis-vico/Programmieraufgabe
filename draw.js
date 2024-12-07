// Zugriff auf das Canvas-Element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let points = [];
let dist = 0;
let p1 = {};
let p2 = {};
let triangle_p1 = {};
let triangle_p2 = {};
let triangle_p3 = {};

// Setze Canvas-Größe dynamisch
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearCache();
}

function clearCache() {
    points = [];
    dist = 0;
    p1 = {};
    p2 = {};
    triangle_p1 = {};
    triangle_p2 = {};
    triangle_p2 = {};
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}


function findPoints() {
    let minDistance_1 = Infinity;
    let minDistance_2 = -Infinity;
    let closestPoint_1 = null;
    let closestPoint_2 = null;
    let lowestPoint = -Infinity;

    for (const point of points) {
        // Berechne den y-Wert der Linie an der Stelle von x
        let lineY1 = -(Math.sqrt(3))*(point.x);
        let lineY2 = Math.sqrt(3)*(point.x);
        
        // Berechne die vertikale Distanz zwischen dem Punkt und der Linie
        let distance_1 = Math.abs(lineY1 - point.y);
        let distance_2 = Math.abs(lineY2 - point.y);

        if (distance_1 < minDistance_1) {
            minDistance_1 = distance_1;
            closestPoint_1 = point;
        }
        if (distance_2 > minDistance_2) {
            minDistance_2 = distance_2;
            closestPoint_2 = point;
        }
        if (point.y > lowestPoint){
            lowestPoint = point.y;
        }
    } 
    
    //const func1 = -Math.sqrt(3)*(x-closestPoint_1.x) + closestPoint_1.y;
    //const func2 = Math.sqrt(3)*(x-closestPoint_2.x) + closestPoint_2.y;

    //Schnittpunkt berechnen
    //-Math.sqrt(3)*(x-closestPoint_1.x) + closestPoint_1.y = Math.sqrt(3)*(x-closestPoint_2.x) + closestPoint_2.y;
    const x_1 = ((closestPoint_2.y - closestPoint_1.y) - Math.sqrt(3) * (closestPoint_1.x + closestPoint_2.x)) / (2 * -Math.sqrt(3));
    const y_1 = -Math.sqrt(3) * (x_1-closestPoint_1.x) + closestPoint_1.y;           // y-Koordinate
    triangle_p1 = {x: x_1, y: y_1};

    console.log(triangle_p1);

    //Punkt 2 berechnen
    //const x_2 = x_1 - (Math.sqrt(3) * dist)/2; //???? 
    //const y_2 = -Math.sqrt(3) * (x_2 - closestPoint_1.x) + closestPoint_1.y;
    //triangle_p2 = {x: x_2, y: y_2};
    const x_2 = (lowestPoint - closestPoint_1.y) / -Math.sqrt(3) + closestPoint_1.x;
    triangle_p2 = {x: x_2, y: lowestPoint};

    //Punkt 3 berechnen
    //const x_3 = x_1 + (Math.sqrt(3) * dist)/2;
    //const y_3 = Math.sqrt(3) * (x_3 - closestPoint_2.x) + closestPoint_2.y;
    //triangle_p3 = {x: x_3, y: y_3};
    const x_3 = (lowestPoint - closestPoint_2.y) / Math.sqrt(3) + closestPoint_2.x;
    triangle_p3 = {x: x_3, y: lowestPoint};
}


// Funktion zum Zeichnen eines Punktes
function drawPoints() {
    for (const point of points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2); // Radius 4
        ctx.fillStyle = '#449DF5'; // Punktfarbe
        ctx.fill();
    }
}

// Linie zeichnen
function drawLine() {
    if(points.length >= 2){
        for (const point of points) { //d ausrechnen und punkte speichern
            let _distance = distance(point.x, point.y, points[points.length-1].x, points[points.length-1].y)
            if (_distance > dist){
                dist = _distance;
                p1 = {x: points[points.length-1].x , y: points[points.length-1].y};
                p2 = {x: point.x, y: point.y};
            }
        }

        ctx.beginPath();
        ctx.moveTo(p1.x ,p1.y);   // Startpunkt
        ctx.lineTo(p2.x, p2.y);  // Endpunkt
        ctx.strokeStyle = "#80EF80";    // Farbe
        ctx.lineWidth = 3;           // Dicke
        ctx.setLineDash([5, 8]);    // Linie gestrichelt (5px Linie, 15px Lücke)
        ctx.stroke();         // Linien zeichnen
    }
}

// Dreieck zeichnen
function drawTriangle() {
    if(points.length >= 2){
        findPoints();
        ctx.beginPath();
        ctx.moveTo(triangle_p1.x, triangle_p1.y);
        ctx.lineTo(triangle_p2.x, triangle_p2.y);
        ctx.lineTo(triangle_p3.x, triangle_p3.y);
        ctx.closePath();
        ctx.setLineDash([0, 0]);
        ctx.strokeStyle = "#CD1C18"; // Linienfarbe
        ctx.lineWidth = 4;       // Linienbreite
        ctx.stroke();            // Nur die Umrisse zeichnen

    }
    

}

// Eventlistener für Mausklicks
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({x, y});
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Canvas clear
    drawPoints();
    drawLine();
    drawTriangle();
});