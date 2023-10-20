function createGrid(size = 16) {
    const gridlinesToggle = document.getElementById('gridlines-toggle');   //used to check whether a checkbox with this ID is checked or not

    for (let i = 0; i < size; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.setAttribute('id', `row-${i}`)

        row.style.cssText = `display: flex; width: 500px; height: ${500/size}px; min-width: 500px; min-height: ${500/size}px; max-width: 500px; max-height: ${500/size}px`
        document.querySelector('.grid').appendChild(row);

        for (let j = 0; j < size; j++) {                                  //this loop creates a series of boxes within the current row
            let box = document.createElement('div');
            box.classList.add('box');
            box.id = `${i}-${j}`

            if (gridlinesToggle.checked) {
                box.style.cssText = `user-select: none; border: 1px solid #D3D3D3; width: ${500/size}px; height: ${500/size}px; min-width: 0px; min-height: 0px; max-width: ${500/size}px; max-height: ${500/size}px;`
            }
            else{
                box.style.cssText = `user-select: none; width: ${500/size}px; height: ${500/size}px; min-width: 0px; min-height: 0px; max-width: ${500/size}px; max-height: ${500/size}px;`
            }
            row.appendChild(box);                //the box is appended as a child to the current row, populating the row with boxes.
        }
    }
    draw();
}

function clearGrid() {
    let boxes = document.querySelectorAll('.box')             //returns a NodeList of all boxes          
    boxes.forEach(box => {
        if (box.style.backgroundColor != 'white'){      
            box.style.backgroundColor = 'white';             //set backgroundColor white to clear the grid
        }
    });
}

function draw(color='black', rainbow=false) {           //color represents the initial drawing color, and rainbow is a flag to indicate whether to use random colors while drawing.
  let isDrawing = false;

  function startDrawing() {
    isDrawing = true;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function drawBox(box) {
    if (isDrawing) {
        if (rainbow) {
            color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`             //random rgb color
        }
        box.style.backgroundColor = color;
    }
  }

  let boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    box.addEventListener('mousedown', () => {     //mousedown event is triggered when the user presses the mouse button
      startDrawing();
      drawBox(box);                               //drawBox function is called to color the box
    });
    box.addEventListener('mouseover', () => {
        drawBox(box);
    });
  });

  document.addEventListener('mouseup', stopDrawing);    //It listens for the 'mouseup' event, which occurs when the user releases the mouse button. 
}

function removeGrid() {
    let grid = document.querySelector('.grid');
    grid.innerHTML = '';
}

function gridAction() {

    createGrid();

    const boxSlider = document.getElementById('box-slider');
    const boxCountDisplay = document.querySelectorAll('.box-count');
    const eraseButton = document.querySelector('.eraser');
    const clearButton = document.querySelector('.clear');
    const rainbowButton = document.querySelector('.rainbow');
    const colorButton = document.querySelector('.color');

    boxSlider.addEventListener('input', () => {                 //occurs when the user interacts with the slider like moving it
        boxCountDisplay.forEach(boxCount => boxCount.textContent = boxSlider.value);
        removeGrid();
        createGrid(boxSlider.value);                           //updates the box count display,removes the existing grid,creates a new grid with the specified size

        const colorPicker = document.querySelector("#color-picker");
        draw(colorPicker.value); 
        if (eraseButton.style.opacity == 1) {                  //opacity=1 means not transparent means erase mode is activated
            draw('white');
        }
        else if (rainbowButton.style.opacity == 1) {
            draw('white',true);
        }
    });

    clearButton.onclick = clearGrid;

    eraseButton.addEventListener('click', () => {
        eraseButton.style.cssText = "opacity: 1;"
        rainbowButton.style.cssText = "opacity: 0.6;"
        draw('white');
    });

    rainbowButton.addEventListener('click', () => {
        rainbowButton.style.cssText = "opacity: 1;"
        eraseButton.style.cssText = "opacity: 0.6;"
        draw('white',true);
    });

    colorButton.addEventListener('click', () => {
        rainbowButton.style.cssText = "opacity: 0.6;"
        eraseButton.style.cssText = "opacity: 0.6;"
        const colorPicker = document.querySelector("#color-picker");
        draw(colorPicker.value); 
    });

    const gridlinesToggle = document.getElementById('gridlines-toggle');
    gridlinesToggle.addEventListener('change', () => {
        let boxes = document.querySelectorAll('.box')
        boxes.forEach(box => {
            if (gridlinesToggle.checked) {
                box.style.border = '1px solid #D3D3D3';
            }
            else {
                box.style.border = 'none';
            }
        });
    });

    window.addEventListener("load", startup, false);

}

function startup() {
    let colorPicker;
    colorPicker = document.querySelector("#color-picker");
    colorPicker.value = "#000000";                                 //sets initial color to black
    colorPicker.addEventListener("input", updateFirst, false);     //user interacts with the color picker and changes the selected color.
    colorPicker.addEventListener("change", updateAll, false);      //when the user selects a final color (when they confirm their choice).
    colorPicker.select();
}

function updateFirst(event) {
    draw(event.target.value);                       //this value is the color selected by the user in the color picker. 
}

function updateAll(event) {
    draw(event.target.value);
}

gridAction();
