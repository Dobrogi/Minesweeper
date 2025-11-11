let isFirstClick = true
const fieldHeight = 9
const fieldWidth = 11
const areaPattern = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1], [0, 0]]
const bigAreaPattern = [
         [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
         [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2],
         [0, -2], [0, -1], [0, 0], [0, 1], [0, 2],
         [1, -2], [1, -1], [1, 0], [1, 1], [1, 2],
         [2, -2], [2, -1], [2, 0], [2, 1], [2, 2],
]
let mines = new Set()

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
         console.log();

}
function mineEventlistener() {
         let fieldList = document.querySelectorAll("td")
         fieldList.forEach(field => {
                  field.addEventListener("click", (element) => {
                           if (isFirstClick) {
                                    minePlanter(element.target, Math.floor((fieldHeight * fieldWidth / 10) * 1.5))
                                    isFirstClick = false
                           }
                           else {
                                    //checkArea(element.target, 3, "mark")
                           }
                  })
         })
}
function minePlanter(clickedCell, mineAmount) {
         const cellRow = parseInt(clickedCell.dataset.rowValue)
         const cellCol = parseInt(clickedCell.dataset.colValue)
         while (mines.size < mineAmount) {
                  let passed = true
                  let minePos = [randomInt(1, fieldHeight), randomInt(1, fieldWidth)]
                  bigAreaPattern.forEach(([row, col]) => {
                           if (minePos[0] == cellRow + row && minePos[1] == cellCol + col) {
                                    passed = false
                           }
                           ;
                           areaPattern.forEach(([row, col]) => {
                                    mines.forEach((cell) => {
                                             if (minePos[0] == row + parseInt(cell.split(",")[0]) && minePos[1] == col + parseInt(cell.split(",")[1])) {
                                                      if (randomInt(1, 2) != 2) passed = false
                                             }
                                    })
                           }
                           )
                  });
                  if (passed) mines.add(minePos.join(","));
         }
         mineAssigner()
}
function checkArea(cell, size) {
         console.log(cell.dataset.rowValue, cell.dataset.colValue);
         areaPattern.forEach((row, col) => {
         });
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
generateField(fieldWidth, fieldHeight)