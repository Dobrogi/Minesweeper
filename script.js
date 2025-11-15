let isFirstClick = true
let isGameOver = false
const fieldHeight = 12
const fieldWidth = 8
let mines = new Set()
const areaPattern = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1], [0, 0]]
const bigAreaPattern = [
    [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
    [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2],
    [0, -2], [0, -1], [0, 0], [0, 1], [0, 2],
    [1, -2], [1, -1], [1, 0], [1, 1], [1, 2],
    [2, -2], [2, -1], [2, 0], [2, 1], [2, 2],
]
const diamondAreaPattern = [
    [0, 0],
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-2, 0], [2, 0], [0, -2], [0, 2],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
]


function generateField(...size) {
    let table = document.querySelector("table")
    let field = ""
    if (size.length == 1) {
        for (let row = 0; row < size[0]; row++) {
            field += "<tr>"
            for (let col = 0; col < size[0]; col++) {
                field += `<td data-row-value='${row + 1}' data-col-value='${col + 1}'></td>`
            }
            field += "</tr>"
        }
    }
    else if (size.length >= 1) {
        for (let row = 0; row < size[1]; row++) {
            field += "<tr>"
            for (let col = 0; col < size[0]; col++) {
                field += `<td data-row-value='${row + 1}' data-col-value='${col + 1}'></td>`
            }
            field += "</tr>"
        }
    }
    table.innerHTML = field
    mineEventlistener()
    coolPattern()
}
function mineEventlistener() {
    let fieldList = document.querySelectorAll("td")
    const leftEventListener = (element) => {
        if (element.button == 0) {
            // If it is the first click, it generates, the field
            if (isFirstClick) {
                minePlanter(element.target, Math.floor((fieldHeight * fieldWidth / 10) * 1.5))
                isFirstClick = false
            }

            // If we are still in game, or the cell isnt a mine, we reveal the clicked cell
            if (!element.target.classList.contains("mine") && !isGameOver) { clearBlanks(element.target); gameFinished()}
            else { revealMines(); markDisable(rightEventListener); resetGame(); isGameOver = true }
        }
    }
    const rightEventListener = element => {
        const tile = element.target
        if (tile.classList.contains("unknownLight") || tile.classList.contains("unknownDark")) {
            tile.classList.toggle("marked")

            // If marked, doesnt listen to left clicks, and mark it
            if (tile.classList.contains("marked")) {
                tile.removeEventListener("mouseup", leftEventListener)
                tile.textContent = "!"
                tile.style.color = "red";
            }
            // else, yeah, they do, and unmark
            else {
                tile.addEventListener("mouseup", leftEventListener)
                tile.textContent = ""
                tile.style.color = "red";
            }
        }
    }
    fieldList.forEach(field => {
        // left ckick event listening
        field.addEventListener("mouseup", leftEventListener)

        //Right click/long holding on mobile, event listening = marking a tile
        field.addEventListener("contextmenu", rightEventListener)
    })
}
function minePlanter(clickedCell, mineAmount) {
    const cellRow = parseInt(clickedCell.dataset.rowValue)
    const cellCol = parseInt(clickedCell.dataset.colValue)

    while (mines.size < mineAmount) {
        let minePosRow = randomInt(1, fieldHeight)
        let minePosCol = randomInt(1, fieldWidth)
        let passed = true
        let minePos = [minePosRow, minePosCol]
        diamondAreaPattern.forEach(([row, col]) => {
            if (minePos[0] == cellRow + row && minePos[1] == cellCol + col) {
                passed = false
            }
            mines.forEach((cell) => {
                if (minePos[0] == row + parseInt(cell.split(",")[0]) && minePos[1] == col + parseInt(cell.split(",")[1])) {
                    if (randomInt(1, 5) == 2) passed = false
                }
            })
        });
        if (passed) mines.add(minePos.join(","));
    }
    mineAssigner()
}
function coolPattern() {
    let fieldList = document.querySelectorAll("td")
    fieldList.forEach(cell => {
        if ((parseInt(cell.dataset.colValue) + parseInt(cell.dataset.rowValue)) % 2 == 0) cell.classList.add("unknownDark")
        else cell.classList.add("unknownLight")
    })
}
function mineAssigner() {
    mines.forEach(coord => {
        document.querySelector(`td[data-row-value="${coord.split(",")[0]}"][data-col-value="${coord.split(",")[1]}"]`).classList.add("mine")
    });
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clearBlanks(cell) {
    const cellRow = parseInt(cell.dataset.rowValue)
    const cellCol = parseInt(cell.dataset.colValue)

    // skip if this cell is already revealed
    if (cell.classList.contains("blankLight") || cell.classList.contains("blankDark")) return

    // mark cell as revealed
    cell.classList.remove("unknownLight", "unknownDark")
    if ((parseInt(cell.dataset.colValue) + parseInt(cell.dataset.rowValue)) % 2 == 0) cell.classList.add("blankDark")
    else cell.classList.add("blankLight")
    cell.textContent = ""

    // count adjacent mines
    let mineCount = 0
    areaPattern.forEach(([rOffset, cOffset]) => {
        const r = cellRow + rOffset
        const c = cellCol + cOffset
        if (mines.has(`${r},${c}`)) mineCount++
    })

    // if there are adjacent mines, show the number and stop
    if (mineCount > 0 || cell.classList.contains("mine")) {
        cell.textContent = mineCount
        switch (mineCount) {
            case 1: cell.style.color = "blue"; break
            case 2: cell.style.color = "green"; break
            case 3: cell.style.color = "rgb(167, 30, 30)"; break
            case 4: cell.style.color = "purple"; break
            case 5: cell.style.color = "maroon"; break
            case 6: cell.style.color = "orange"; break
            case 7: cell.style.color = ""; break
            case 8: cell.style.color = "blue"; break
        }
        return
    }

    // otherwise, recursively clear all neighbors
    areaPattern.forEach(([rOffset, cOffset]) => {
        const r = cellRow + rOffset
        const c = cellCol + cOffset
        if (r < 1 || r > fieldHeight || c < 1 || c > fieldWidth) return
        const neighbor = document.querySelector(`td[data-row-value="${r}"][data-col-value="${c}"]`)
        if (neighbor) clearBlanks(neighbor)
    })
}
function revealMines() {
    const hiddenMines = document.querySelectorAll(".mine")
    hiddenMines.forEach(hiddenMine => {
        hiddenMine.classList.remove("unknownLight", "unknownDark")
    })
}
function markDisable(listener) {
    let fieldList = document.querySelectorAll("td")
    fieldList.forEach(e => {
        e.removeEventListener("contextmenu", listener)
    })
}
function resetGame() {
    setTimeout(() => {
        document.querySelector("table").innerHTML = ""
        isGameOver = false
        isFirstClick = true
        mines.clear()
        generateField(fieldWidth, fieldHeight)
    }, 500);

}
function gameFinished(){
    let hiddenTiles = document.querySelectorAll("td.unknownDark, td.unknownLight")
    const minesArray = [...mines];
    for (const tile of hiddenTiles){
        const coord = `${tile.dataset.rowValue},${tile.dataset.colValue}`;
        if (!minesArray.includes(coord)) {
            return
        }
    }
    console.log("elv nyertel")
}
document.addEventListener("contextmenu", e => e.preventDefault())
generateField(fieldWidth, fieldHeight)