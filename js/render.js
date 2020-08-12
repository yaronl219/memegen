function renderMemeEditScreen() {
    const el = document.querySelector('.main-container')
    el.innerHTML = `            <div class="editor-container">
    <div class="canvas-area-container">

        <div class="canvas-container">

        </div>

    </div>
    <div class="side-container">
        <div class="text-editor-head-container">
            <h3>Edit Text Lines</h3>
            <div class="text-editor-controller">
                <div class="layer-counter"></div>
                <button class="text-controller-buttons text-controller-switch-line" onclick="onSwitchLine()"></button>
                <button class="text-controller-buttons text-controller-add-line"></button>
                <button class="text-controller-buttons text-controller-remove-line"></button>
            </div>
        </div>
        <div class="text-editor-container">
            <div class="text-params">
                <select class="text-edit-btn select-dropdown" label="font selection" oninput="onChangeFont()">
                    <option value="Impact">Impact</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Arial">Arial</option>
                </select>
                <button class="text-edit-btn btn-minus" label="-" onclick="editTextLineParameters('-')"></button>
                <button class="text-edit-btn btn-plus" label="+" onclick="editTextLineParameters('+')"></button>
                <svg width="1" height="18" viewBox="0 0 1 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="18" stroke="#727272"/>
                    </svg>
                <button class="text-edit-btn btn-alignLeft" label="alignLeft" onclick="editTextLineParameters('alignLeft')"></button>
                <button class="text-edit-btn btn-alignCenter" label="alignCenter" onclick="editTextLineParameters('alignCenter')"></button>
                <button class="text-edit-btn btn-alignRight" label="alignRight" onclick="editTextLineParameters('alignRight')"></button>

            </div>
            <div class="text-editor-lower-half">
                <input class="textline-edit-input" type="text" oninput="setTextLine()">
                <div class="text-directional-change-location">
                    <button class="text-edit-btn btn-up" label="up" onclick="editTextLineParameters('up')"></button>
                    <button class="text-edit-btn btn-down" label="down" onclick="editTextLineParameters('down')"></button>
                    <button class="text-edit-btn btn-left" label="left" onclick="editTextLineParameters('left')"></button>
                    <button class="text-edit-btn btn-right" label="right" onclick="editTextLineParameters('right')"></button>
                </div>
            </div>
        </div>
        <div class="sticker-container"></div>
    </div>`
}

function renderGalleryScreen() {
    const el = document.querySelector('.main-container')
    el.innerHTML = `<div class="search-bar-container">
                        <input type="search" class="search-bar-input">
                    </div>
                    <div class="meme-gallery"></div>`
}