var size = 400
var pointradius = 20
var lineradius = 15

var offset = 30;

var grid = document.getElementById("grid");
var overlay = document.getElementById("overlay");
var ctx = overlay.getContext("2d")
var character = document.getElementById("character");

function genGrid() {
    grid.setAttribute("viewBox", `0 0 ${size} ${size}`)
    character.setAttribute("viewBox", `0 0 ${size} ${size}`)
    genPoint(offset, offset, 1)
    genPoint(size / 2, offset, 2)
    genPoint(size - offset, offset, 3)
    genPoint(offset, size / 2, 4)
    genPoint(size / 2, size / 2, 5)
    genPoint(size - offset, size / 2, 6)
    genPoint(offset, size - offset, 7)
    genPoint(size / 2, size - offset, 8)
    genPoint(size - offset, size - offset, 9)

    function genPoint(x, y, n) {
        var point = document.createElementNS('http://www.w3.org/2000/svg', "circle")
        point.setAttribute("cx", x)
        point.setAttribute("cy", y)
        point.setAttribute("r", pointradius)
        point.setAttribute("fill", "white")
        point.classList.add("point")
        grid.appendChild(point)
            //point.setAttribute("onmouseover", `hovPoint(${n})`)
            //point.setAttribute("onmouseleave", `clearHov()`)
        point.setAttribute("onclick", `ptClick(${n})`)
    }
}

var clicked = 0;

var connections = {
    1: [2, 4, 5, 6, 8],
    2: [1, 3, 4, 5, 6, 7, 9],
    3: [2, 5, 6, 4, 8],
    4: [1, 7, 5, 2, 8, 3, 9],
    5: [1, 2, 3, 4, 6, 7, 8, 9],
    6: [2, 3, 5, 8, 9, 1, 7],
    7: [4, 5, 8, 2, 6],
    8: [4, 5, 6, 7, 9, 1, 3],
    9: [5, 6, 8, 2, 4]
}

var doubles = {
    1: {
        3: 2,
        9: 5,
        7: 4
    },
    2: {
        8: 5
    },
    3: {
        1: 2,
        9: 6,
        7: 5
    },
    4: {
        6: 5
    },
    5: {

    },
    6: {
        4: 5
    },
    7: {
        1: 4,
        3: 5,
        9: 8
    },
    8: {
        2: 5
    },
    9: {
        1: 5,
        3: 6,
        7: 8
    }
}

var positions = {
    1: [offset, offset],
    2: [size / 2, offset],
    3: [size - offset, offset],
    4: [offset, size / 2],
    5: [size / 2, size / 2],
    6: [size - offset, size / 2],
    7: [offset, size - offset],
    8: [size / 2, size - offset],
    9: [size - offset, size - offset],
}

genGrid()

function hovPoint(p) {
    console.log(connections[p])
    for (let i = 0; i < connections[p].length; i++) {
        const point = connections[p][i];
        genLine(positions[p][0], positions[p][1], positions[point][0], positions[point][1])
    }
}

function clearHov() {
    while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
    }
}

function ptClick(n) {
    if (clicked == n) {
        clicked = 0
        return
    }
    if (clicked == 0) {
        clicked = n;
    }
    console.log(clicked)
    if (clicked != 0) {
        if (connections[clicked].includes(n)) {
            if (sets.hasArray([clicked, n].sort())) {
                clicked = 0
                return
            };
            createLine(positions[clicked][0], positions[clicked][1], positions[n][0], positions[n][1])
            sets.push([clicked, n].sort())
            clicked = 0
        } else if (doubles[clicked][n] != null) {
            if (sets.hasArray([clicked, doubles[clicked][n]].sort())) {
                clicked = 0
            } else {
                createLine(positions[clicked][0], positions[clicked][1], positions[doubles[clicked][n]][0], positions[doubles[clicked][n]][1])
                sets.push([clicked, doubles[clicked][n]].sort())
            }

            if (sets.hasArray([n, doubles[clicked][n]].sort())) {
                clicked = 0
            } else {
                createLine(positions[n][0], positions[n][1], positions[doubles[clicked][n]][0], positions[doubles[clicked][n]][1])
                sets.push([n, doubles[clicked][n]].sort())

            }
            clicked = 0
        }
    }
}

document.onclick = function(e) {
    console.log()
    if (e.target.tagName != "circle") {
        clicked = 0
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

document.onmousemove = function(e) {
    if (clicked != 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        ctx.moveTo(positions[clicked][0] + rect.left, positions[clicked][1] + rect.top);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    }
}

function genLine(x1, y1, x2, y2) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', "line")
    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)
    line.setAttribute("stroke-linecap", "round")
    line.setAttribute("stroke-width", lineradius * 2)
    line.setAttribute("stroke", "white")
    line.classList.add("previewline")
    overlay.appendChild(line)
}


function createLine(x1, y1, x2, y2) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', "line")
    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)
    line.setAttribute("stroke-linecap", "round")
    line.setAttribute("stroke-width", lineradius * 2)
    line.setAttribute("stroke", "white")
    character.appendChild(line)

}

function resizeCanvas(e) {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
}

resizeCanvas()

window.onresize = function(e) {
    rect = grid.getBoundingClientRect()
    resizeCanvas()
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
}
var rect = grid.getBoundingClientRect()

function testPts() {
    for (const key in positions) {
        if (Object.hasOwnProperty.call(positions, key)) {
            const element = positions[key];
            console.log(element)
        }
    }
}
ctx.fillStyle = "white"
ctx.strokeStyle = "white"
testPts()

var sets = [

]



Array.prototype.hasArray = function(array) {
    var item_as_string = JSON.stringify(array);

    var contains = this.some(function(ele) {
        return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}

Object.prototype.hasArray = function(array) {
    var item_as_string = JSON.stringify(array.sort());

    var contains = false;
    for (const key in this) {
        if (Object.hasOwnProperty.call(this, key)) {
            const element = this[key].sort();

            if (JSON.stringify(element) == item_as_string) {
                contains = true
            }
        }
    }
    return contains
}

SVGElement.prototype.clearChildren = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return true;
}


function resetCharacter() {
    sets = []
    character.clearChildren()
    document.getElementById("meaning").value = ""
}

var topEl = document.getElementById("top")

function openTop() {
    if (topEl.classList.contains("top-open")) topEl.classList.remove("top-open")
    else if (!topEl.classList.contains("top-open")) topEl.classList.add("top-open")
}

var characters = {}
window.onbeforeunload = function(e) {
    document.getElementById("meaning").value = ""
    localStorage.setItem("characters", JSON.stringify(characters))
}
characters = JSON.parse(localStorage.getItem("characters"))

function storeCharacter() {
    if (characters.hasArray(sets)) {
        alrt.log("this character already exists")
        return
    }
    var name = document.getElementById("meaning")
    if (name.value == "" || name.value == null) {
        alrt.log("Please name the character")
        return
    }
    if (sets.length == 0) {
        alrt.log("Please create a character")
        return
    }
    characters[name.value] = sets
}


let alrt = new Alrt({
    position: "bottom-left"
});

function displayCharacter(c) {
    if (characters[c] == null) {
        return
    }
    resetCharacter()
    var name = document.getElementById("meaning")
    name.value = c
    for (let i = 0; i < characters[c].length; i++) {
        const connection = characters[c][i];
        createLine(positions[connection[0]][0], positions[connection[0]][1], positions[connection[1]][0], positions[connection[1]][1])

    }
}