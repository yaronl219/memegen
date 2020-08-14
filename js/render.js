const dPad = `
<div class="text-directional-change-location">
<button class="text-edit-btn btn-up" label="up" onclick="onEditTextLineParameters('up')"></button>
<button class="text-edit-btn btn-down" label="down" onclick="onEditTextLineParameters('down')"></button>
<button class="text-edit-btn btn-left" label="left" onclick="onEditTextLineParameters('left')"></button>
<button class="text-edit-btn btn-right" label="right" onclick="onEditTextLineParameters('right')"></button>
</div>
`
const hiddenColorInputs = `    <input id="color-choice" class="color-edit-hidden hidden" type="color" oninput="onChangeFontColor(this)"</input>
<input id="border-choice" class="color-edit-hidden hidden" type="color" oninput="onChangeFontColor(this)"</input>`

function switchThroughMobileNav(fn) {
    closeHamburgerMenu()
    fn()
}


function aboutScreenInit() {
    highlightRelevantNavs('about')
    renderAboutScreen()
}

function renderAboutScreen() {
    const header = 'Proudly Built By Yaron Lipshitz'
    const headerChars = header.split('')

    var strHtml = `<div class="about-container">
                        <div>
                        <h1 class="about-header">`
    headerChars.forEach(letter => strHtml += `<span>${letter}</span>`)
    strHtml += `</h1>
            </div>
            <div class="something-title">
                <h6>It's something</h6>
            </div>
        </div>`
    const el = document.querySelector('.main-container')
    el.innerHTML = strHtml
}



function renderMemeEditScreen() {
    const el = document.querySelector('.main-container')
        // currently toggled off - can be later added

    el.innerHTML = `            <div class="editor-container">
    <div class="canvas-area-container">
    <div class="back-to-gallery">
    <a onclick="onGalleryInit()">Back To Gallery</a>
</div>
        <div class="canvas-container">

        </div>

    </div>
    <div class="side-container">
        <div class="text-editor-head-container">
            <h3>Edit Text Lines</h3>
            <div class="text-editor-controller">
                <div class="layer-counter"></div>
                <button class="text-controller-buttons text-controller-switch-line" onclick="onSwitchLine()"></button>
                <button class="text-controller-buttons text-controller-add-line" onclick="onAddLine()"></button>
                <button class="text-controller-buttons text-controller-remove-line" onclick="onRemoveLine()"></button>
            </div>
        </div>
        <div class="text-editor-container">
            <div class="text-params">
                <select class="text-edit-btn select-dropdown" label="font selection" oninput="onChangeFont()">
                    <option value="Custom-Impact">Impact</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Arial">Arial</option>
                </select>
                <button class="text-edit-btn btn-minus" label="-" onclick="onEditTextLineParameters('-')"></button>
                <button class="text-edit-btn btn-plus" label="+" onclick="onEditTextLineParameters('+')"></button>
                <svg width="1" height="24" viewBox="0 0 1 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="18" stroke="#727272"/>
                    </svg>
                <button class="text-edit-btn btn-alignLeft" label="alignLeft" onclick="onEditTextLineParameters('alignLeft')"></button>
                <button class="text-edit-btn btn-alignCenter" label="alignCenter" onclick="onEditTextLineParameters('alignCenter')"></button>
                <button class="text-edit-btn btn-alignRight" label="alignRight" onclick="onEditTextLineParameters('alignRight')"></button>
                <svg width="1" height="24" viewBox="0 0 1 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="18" stroke="#727272"/>
                </svg>
                <label for="border-choice" onclick="renderColorPallete('border','Select Border Color')" class="text-edit-btn btn-change-border-color"></label>
                <label for="color-choice" onclick="renderColorPallete('text','Select Text Color')" class="text-edit-btn btn-change-font-color"></label>

            </div>
            <div class="text-editor-lower-half">
                <input class="textline-edit-input" type="text" oninput="setTextLine(this)">

            </div>
        </div>
        <div class="sticker-container"></div>
        <div class="share-features-container">
        <a class="save-btn" onclick="onSaveMeme(this)">Save</a>
        <a class="download-btn" onclick="onDownload(this)">Download</a>
        <a class="share-btn" onclick="onShare()">Share</a>
    </div>
    <input class="textline-edit-input hidden-text-line" type="text" oninput="setTextLine(this)"></input>


    </div>`
    window.addEventListener('resize', () => checkWindowWidth())
}

function renderColorPallete(kind, header) {
    const colorPallete = [
        '#000000', '#000080', '#00008B', '#0000CD', '#0000FF', '#006400', '#008000', '#008080', '#008B8B', '#00BFFF', '#00CED1', '#00FA9A', '#00FF00', '#00FF7F', '#00FFFF', '#00FFFF', '#191970', '#1E90FF', '#20B2AA', '#228B22', '#2E8B57', '#2F4F4F', '#2F4F4F', '#32CD32', '#3CB371', '#40E0D0', '#4169E1', '#4682B4', '#483D8B', '#48D1CC', '#4B0082', '#556B2F', '#5F9EA0', '#6495ED', '#663399', '#66CDAA', '#696969', '#696969', '#6A5ACD', '#6B8E23', '#708090', '#708090', '#778899', '#778899', '#7B68EE', '#7CFC00', '#7FFF00', '#7FFFD4', '#800000', '#800080', '#808000', '#808080', '#808080', '#87CEEB', '#87CEFA', '#8A2BE2', '#8B0000', '#8B008B', '#8B4513', '#8FBC8F', '#90EE90', '#9370DB', '#9400D3', '#98FB98', '#9932CC', '#9ACD32', '#A0522D', '#A52A2A', '#A9A9A9', '#A9A9A9', '#ADD8E6', '#ADFF2F', '#AFEEEE', '#B0C4DE', '#B0E0E6', '#B22222', '#B8860B', '#BA55D3', '#BC8F8F', '#BDB76B', '#C0C0C0', '#C71585', '#CD5C5C', '#CD853F', '#D2691E', '#D2B48C', '#D3D3D3', '#D3D3D3', '#D8BFD8', '#DA70D6', '#DAA520', '#DB7093', '#DC143C', '#DCDCDC', '#DDA0DD', '#DEB887', '#E0FFFF', '#E6E6FA', '#E9967A', '#EE82EE', '#EEE8AA', '#F08080', '#F0E68C', '#F0F8FF', '#F0FFF0', '#F0FFFF', '#F4A460', '#F5DEB3', '#F5F5DC', '#F5F5F5', '#F5FFFA', '#F8F8FF', '#FA8072', '#FAEBD7', '#FAF0E6', '#FAFAD2', '#FDF5E6', '#FF0000', '#FF00FF', '#FF00FF', '#FF1493', '#FF4500', '#FF6347', '#FF69B4', '#FF7F50', '#FF8C00', '#FFA07A', '#FFA500', '#FFB6C1', '#FFC0CB', '#FFD700', '#FFDAB9', '#FFDEAD', '#FFE4B5', '#FFE4C4', '#FFE4E1', '#FFEBCD', '#FFEFD5', '#FFF0F5', '#FFF5EE', '#FFF8DC', '#FFFACD', '#FFFAF0', '#FFFAFA', '#FFFF00', '#FFFFE0', '#FFFFF0', '#FFFFFF'
    ]
    const el = document.querySelector('.color-pallete-container')
    el.classList.toggle('hidden')
    strHtml = `<h3>${header}</h3>`
    colorPallete.forEach(color => {
        strHtml += `<div class="color-choice" style="background-color : ${color}" onclick="onChangeColor(this,'${kind}','${color}')"></div>`
    });
    el.innerHTML = strHtml
}