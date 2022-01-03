
CORRECT_COLOR = "#538d4e"
PRESENT_COLOR = "#b59f3b"
ABSENT_COLOR = "#3a3a3c"

const WORD_LEN = 5
const ATTEMPTS = 6

var filtered_words = filter_words(WORD_LEN, WORDS)
var mystery_word = filtered_words[Math.floor(Math.random()*filtered_words.length)]

const alphabet = "abcdefghijklmnopqrstuvwxyz"
var keydict = {
    13: "enter",
    8: "backspace",
}
for (keycode = 65; keycode <= 90; keycode++) {
    keydict[keycode] = alphabet[keycode-65]
}

window.current_cell = null


function create_and_append(type, parent=null, id=null, class_=null) {
    if (parent == null)
        parent = document.body

    let element = document.createElement(type)
    parent.appendChild(element)

    if (id != null)
        element.id = id
    if (class_ != null)
        element.setAttribute('class', class_)

    return element
}

function empty_element(element) {
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function init_game_screen() {
    let game_screen = create_and_append('div', null, "game_screen")
    let screen_left = create_and_append('div', game_screen, "game_screen_left", "game_screen_division")
    let screen_right = create_and_append('div', game_screen, "game_screen_right", "game_screen_division")
    create_and_append('div', screen_right, "message")
    return { screen_left, screen_right }
}

function init_grid(parent, word_len, attempts) {
    let board = create_and_append('div', parent, id='board')
    board.style['height'] = `${document.body.offsetHeight * .6}px`
    board.style['width'] = `${board.offsetHeight/attempts*word_len}px`

    for (let row = 0; row < attempts; row++) {
        let row = create_and_append('div', board, null, class_="board_row")        
        row.style["grid-template-columns"] = `${100/word_len}% `.repeat(word_len)

        for (let col = 0; col < word_len; col++) {
            let cell = create_and_append('div', row, null, class_="board_cell")
            cell.innerHTML = "&nbsp"
        }
    }
    board.style['grid-template-rows'] = 'auto '.repeat(attempts)

    window.current_cell = board.firstChild.firstChild
}

function init_keyboard(parent) {
    rows = ["q,w,e,r,t,y,u,i,o,p", 
             "a,s,d,f,g,h,j,k,l", 
        "enter,z,x,c,v,b,n,m,backspace"]
    let keyboard = create_and_append('div', parent, id="keyboard")
    
    for (keys of rows) {
        let row = create_and_append('div', keyboard, null, class_="keyboard_row")
        for (key of keys.split(",")) {
            let btn = create_and_append('div', row, `${key}-key`, "keyboard_btn")
            btn.innerHTML = key
            btn.setAttribute('onclick', `window.key_down('${btn.innerHTML}')`)
        }
    }
}

function init_settings(parent) {
    let word_list_div = create_and_append('div', parent, "word_list")
    return word_list_div
}

function fill_word_list(word_list_div, words) {
    empty_element(word_list_div)
    let table = create_and_append('table', word_list_div)
    for (let word of words) {
        let row = create_and_append('tr', table)
        let cell = create_and_append('td', row)
        cell.innerHTML = word
    }
    word_list_div.setAttribute('data-simplebar', "init")
}

function enter_letter(letter) {
    let cell = window.current_cell
    cell.innerHTML = letter
    if (cell.nextElementSibling != null)
        window.current_cell = cell.nextElementSibling
}

function remove_letter() {
    let cell = window.current_cell
    let prev_cell = cell.previousElementSibling
    if (prev_cell == null)
        return

    let is_last_cell = (cell.nextElementSibling == null)

    if (is_last_cell && alphabet.includes(cell.innerHTML)) {
        cell.innerHTML = "&nbsp"
        return
    }

    prev_cell.innerHTML = "&nbsp"
    window.current_cell = prev_cell
}

function compare_words(mystery_word, attempt) {
    let result = []
    for (let i in attempt) {
        c = attempt[i]
        c_true = mystery_word[i]
        if (c == c_true)
            result.push("correct")
        else if (mystery_word.includes(c))
            result.push("present")
        else
            result.push("absent")
    }
    return result
}

function color_row(row, result) {
    cell = row.firstChild
    for (r of result) {
        let color = ABSENT_COLOR
        switch (r) {
            case "correct":
                color = CORRECT_COLOR
                break;
            case "present":
                color = PRESENT_COLOR
                break;
        }
        cell.style["background-color"] = color
        cell.style["border-color"] = color
        key = document.getElementById(`${cell.innerHTML}-key`)
        if (key.style["background-color"] != CORRECT_COLOR)
            key.style["background-color"] = color

        cell = cell.nextElementSibling
    }
}

function display_message(message) {
    console.log(message)
    div = document.getElementById('message')
    div.innerHTML = message
    div.style['display'] = 'block'
    setTimeout(() => { div.style['display'] = 'none' }, 2000)
}

function win_fn() {
    display_message("you win!")
    window.current_cell = null
}

function lose_fn() {
    display_message("you lose")
    window.current_cell = null
}

function attempt_word() {
    let cell = window.current_cell
    let is_last_cell = (cell.nextElementSibling == null)
    let full_word = (is_last_cell && alphabet.includes(cell.innerHTML))
    if (!full_word) {
        display_message("word not finished")
        return
    }

    let word = []
    while (cell.previousElementSibling) {
        word.unshift(cell.innerHTML)
        cell = cell.previousElementSibling
    }
    word.unshift(cell.innerHTML)
    word = word.join('')

    if (!filtered_words.includes(word)) {
        display_message("word not in vocabulary")
        return
    }

    console.log(word)

    let row = cell.parentElement
    let result = compare_words(mystery_word, word)
    color_row(row, result)

    if (!result.includes("present") && !result.includes("absent"))
        win_fn()
    else if (row.nextElementSibling)
        window.current_cell = row.nextElementSibling.firstChild
    else
        lose_fn()
}

window.key_down = function(key) {
    if (alphabet.includes(key)) {
        enter_letter(key)
    } else if (key == "backspace") {
        remove_letter()
    } else if (key == "enter") {
        attempt_word()
    }
}




function filter_words(word_len, words) {
    let filtered_words = []
    for (let word of words) {
        if (word.length == word_len)
            filtered_words.push(word)
    }
    return filtered_words
}

let { screen_left, screen_right } = init_game_screen()
init_grid(screen_right, WORD_LEN, ATTEMPTS)
init_keyboard(screen_right)
window.addEventListener("keydown", (event) => {window.key_down(keydict[event.keyCode])})
let word_list_div = init_settings(screen_left)

screen_left.style['height'] = `${screen_right.offsetHeight}px`

let possible_words = [...filtered_words]

fill_word_list(word_list_div, possible_words)

console.log(mystery_word)