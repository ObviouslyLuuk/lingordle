const alphabet = "abcdefghijklmnopqrstuvwxyz"
var keydict = {
    13: "enter",
    8: "backspace",
}
for (keycode = 65; keycode <= 90; keycode++) {
    keydict[keycode] = alphabet[keycode-65]
}

var WORDS_BY_LANG = {}

// Maths
function multinomial_sample(array, probs) {
    let rand = Math.random()
    let sum = 0
    for (let i in array) {
        sum += probs[i]
        if (sum > rand) {
            return array[i]
        }
    }
}

function sum_array(array) {
    let sum = 0
    for (let element of array)
        sum += element
    return sum
}

function sigmoid(array, constant=0) {
    new_array = []
    for (let x of array) {
        x = x - constant
        new_array.push( 1 / (1 + Math.pow(Math.E, -x)) )
    }
    return new_array
}

// HTML
function create_and_append(type, parent=null, id=null, class_=null) {
    if (parent == null)
        parent = document.body

    let element = document.createElement(type)

    if (id != null)
        element.id = id
    if (class_ != null)
        element.setAttribute('class', class_)

    parent.appendChild(element)
    return element
}

function empty_element(element) {
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function set_visibility(element_id, vis) {
    element = document.getElementById(element_id)
    if (vis)
        element.style['display'] = "grid"
    else
        element.style['display'] = 'none'
}

function load_word_probs(language) {
    let id = `${language}_words`
    let script = document.getElementById(id)
    if (!script) {
        script = create_and_append('script', document.body, id)
        script.src = `word_probs_${language}.js`
        script.type = "text/javascript"
    }
    return id
}

function move_element(element, new_parent) {
    element.parentElement.removeChild(element)
    new_parent.appendChild(element)
}

function respondToVisibility(element, callback) {
    // https://stackoverflow.com/questions/1462138/event-listener-for-when-element-becomes-visible
    var options = {
        root: document.documentElement,
    };
  
    var observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            callback(entry.intersectionRatio > 0);
        });
    }, options);
  
    observer.observe(element);
}

function create_switch(parent, label_text, id) {
    div = create_and_append("div", parent, id, "form-check form-switch")
    input = create_and_append("input", div, id+"_input", "form-check-input")
    input.setAttribute("type", "checkbox")
    label = create_and_append("label", div, null, "form-check-label")
    label.setAttribute("for", id+"_input")
    label.innerHTML = label_text
    return input
}

function create_incrementer(parent, id, def, title) {
    div = create_and_append("div", parent, id, "input-group")

    left_div = create_and_append("div", div, null, "input-group-prepend")
    left_button = create_and_append("button", left_div, null, "btn")
    left_button.type = "button"
    left_button.setAttribute("onclick", `let elem = document.getElementById('${id}_input'); if (elem.value > elem.min) {elem.value -= 1; elem.dispatchEvent(new Event("change"))}`)
    create_and_append("span", left_button, null, "glyphicon glyphicon-minus")

    input = create_and_append("input", div, id+"_input", "form-control")
    input.type = "number"
    input.setAttribute("value", def)
    input.max = 20
    input.min = 1   

    right_div = create_and_append("div", div, null, "input-group-append")
    right_button = create_and_append("button", right_div, null, "btn")
    right_button.type = "button"
    right_button.setAttribute("onclick", `let elem = document.getElementById('${id}_input'); if (+elem.value < +elem.max) { elem.value = +elem.value + 1; elem.dispatchEvent(new Event("change"))}`)
    create_and_append("span", right_button, null, "glyphicon glyphicon-plus")

    div.innerHTML += title 

    return input
}

// Data manipulation
function order_words_by_value(word_values) {
    return Object.fromEntries(Object.entries(word_values).sort(([,v1],[,v2]) => v2-v1))
}

function normalize_word_probs(word_probs) {
    let sum = sum_array(Object.values(word_probs))
    for (let key of Object.keys(word_probs)) {
        word_probs[key] /= sum
    }
    return word_probs
}


// Classes
class Game {
    constructor(word_len=5, attempts=6, language="wordle", wordle_words=true, hard_mode=false) {
        document.value = this

        this.word_len = word_len
        this.attempts = attempts
        this.language = language
        this.wordle_words = wordle_words
        this.hard_mode = hard_mode

        this.word_probs = WORDS_BY_LANG[language]
        this.filtered_word_probs = this.filter_by_len(word_len, this.word_probs)
        this.allowed_guesses = this.filtered_word_probs
        this.mystery_words = normalize_word_probs(
            this.get_mystery_words(language, word_len, wordle_words)
        )
        this.mystery_word = multinomial_sample(
            Object.keys(this.mystery_words), 
            sigmoid(Object.values(this.mystery_words))
        )

        this.ui = new UI(word_len, attempts)
    }

    step() {
        let current_row = this.ui.current_cell.parentElement
        let guessed_word = this.get_guess(current_row)
        if (!guessed_word)
            return
        
        let next_row = current_row.nextElementSibling
        if (this.ui.inference) {
            var result = this.ui.get_state(current_row)
        } else {
            var result = this.attempt_word(guessed_word, current_row)
            if (this.check_winstate(result, !next_row))
                return
        }
        if (next_row)
            this.ui.set_current_row(next_row)
        
        if (this.hard_mode)
            this.update_allowed_guesses(guessed_word, result)
    }

    word_allowed(guessed_word, result, word) {
        for (let i in result) {
            let c = guessed_word[i]

            switch (result[i]) {
                case "correct":
                    if (word[i] != c)
                        return false
                    break;
                case "present":
                    if (!word.includes(c))
                        return false
                    break;
                default:
                    break;
            }
        }
        return true
    }

    update_allowed_guesses(guessed_word, result) {
        if (!this.hard_mode)
            return this.allowed_guesses

        let word_probs = this.allowed_guesses
        let new_word_probs = {}
        for (let [word, prob] of Object.entries(word_probs)) {
            if (this.word_allowed(guessed_word, result, word))
                new_word_probs[word] = prob
        }
        this.allowed_guesses = normalize_word_probs(new_word_probs)
        return this.allowed_guesses
    }

    evaluate_word(mystery_word, guessed_word) {
        let result = []
        for (let i in guessed_word) {
            let c = guessed_word[i]
            let c_true = mystery_word[i]
            if (c == c_true) {
                result.push("correct")
                mystery_word = mystery_word.replace(c, '-')
            }
            else
                result.push("absent")
        }
        // Second round to make sure corrects aren't counted as presents beforehand
        for (let i in guessed_word) {
            let c = guessed_word[i]
            if (mystery_word.includes(c) && result[i] != "correct") {
                result[i] = "present"
                mystery_word = mystery_word.replace(c, '-')
            }
        }
        return result
    }

    win_fn() {
        this.ui.display_message("You win!")
        this.ui.current_cell = null
    }
    
    lose_fn() {
        this.ui.display_message("You lose.\nThe answer was "+this.mystery_word.toUpperCase(), 3600000)
        this.ui.current_cell = null
    }

    get_guess(row, check_vocab=true) {
        let guessed_word = this.ui.get_input(row)
        if (!guessed_word)
            return false

        if (check_vocab && !Object.keys(this.allowed_guesses).includes(guessed_word)) {
            this.ui.display_message(guessed_word+" isn't a valid guess")
            return false
        }
        return guessed_word
    }
    
    attempt_word(guessed_word, current_row) {
        let result = this.evaluate_word(this.mystery_word, guessed_word)
        this.ui.color_row(current_row, result)

        return result
    }

    check_winstate(result, last_attempt=false) {
        if (!result.includes("present") && !result.includes("absent")) {
            this.win_fn()
            return true
        } else if (last_attempt)
            this.lose_fn()
        
        return false
    }

    filter_by_len(word_len, word_probs) {
        let filtered_word_probs = {}
        for (let [word, count] of Object.entries(word_probs)) {
            if (word.length == word_len)
                filtered_word_probs[word] = count
        }
        return normalize_word_probs(filtered_word_probs)
    }

    get_mystery_words(language, word_len, wordle_words) {
        if (language == "wordle" && word_len == 5 && wordle_words) {
            this.mystery_words = {}
            for (let word of WORDLE_WORDS)
                this.mystery_words[word] = 1
            this.mystery_words = normalize_word_probs(this.mystery_words)
        } else {
            this.mystery_words = this.allowed_guesses
        }
        return this.mystery_words
    }

    reset(word_len=null, language=null, attempts=null) {
        if (!word_len)
            word_len = this.word_len
        if (!language)
            language = this.language

        console.log(word_len)

        if (this.word_len != word_len || this.language != language) {
            this.word_len = word_len
            this.language = language
            this.word_probs = WORDS_BY_LANG[this.language]
            this.filtered_word_probs = this.filter_by_len(word_len, this.word_probs)
        }

        this.allowed_guesses = this.filtered_word_probs
        this.mystery_words = this.get_mystery_words(this.language, word_len, this.wordle_words)
        this.mystery_word = multinomial_sample(
            Object.keys(this.mystery_words), 
            Object.values(this.mystery_words)
        )
        if (attempts)
            this.attempts = attempts

        this.ui.reset(word_len, this.attempts)
        setTimeout(() => { 
            this.ui.display_message(`total allowed words: ${Object.keys(this.allowed_guesses).length}`, 5000)
        }, 100)
    }
}


class UI {
    constructor(word_len, attempts) {
        this.current_cell = null

        let settings_div = this.init_game_screen()
        this.init_settings(settings_div)
        this.reset(word_len, attempts)

        window.addEventListener('resize', this.resize)
        window.addEventListener("keydown", (event) => {document.value.ui.key_down(keydict[event.keyCode])})

        this.resize()
    }

    reset(word_len, attempts) {
        let screen_mid_mid = document.getElementById('game_screen_mid_mid')
        this.resize()
        this.init_grid(screen_mid_mid, word_len, attempts)
        this.init_keyboard(document.getElementById('game_screen_mid_bott'))
    }

    resize() {
        let game_screen = document.getElementById('game_screen')
        let screen_left = document.getElementById('game_screen_left')
        let screen_mid = document.getElementById('game_screen_mid')
        let screen_mid_left = document.getElementById('game_screen_mid_left')
        let screen_mid_mid = document.getElementById('game_screen_mid_mid')
        let screen_mid_right = document.getElementById('game_screen_mid_right')
        let screen_right = document.getElementById('game_screen_right')
        let settings_overlay = document.getElementById('settings_overlay')

        let settings_btn = document.getElementById("settings_btn")

        screen_left.style['height'] = `${screen_mid.offsetHeight}px`
        // Mobile view
        if (document.body.offsetHeight > document.body.offsetWidth) {
            move_element(screen_left, settings_overlay)
            move_element(screen_right, settings_overlay)
            game_screen.style['grid-template-columns'] = "auto"
            screen_mid.style.width = `${document.body.offsetWidth*.95}px`
        // Desktop view
        } else {
            move_element(screen_left, game_screen)
            move_element(screen_mid, game_screen)
            move_element(screen_right, game_screen)
            game_screen.style['grid-template-columns'] = "auto auto auto"
            screen_mid.style.width = `100%`   
        }
    }

    key_down(key) {
        if (alphabet.includes(key)) {
            this.enter_letter(key)
        } else if (key == "backspace") {
            this.remove_letter()
        } else if (key == "enter") {
            document.value.step()
        }
    }

    init_settings(parent) {
        let close_settings_btn = create_and_append('div', parent, 'close_settings_btn', 'btn')
        close_settings_btn.innerHTML = "Close Settings"
        close_settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", false)')

        let hard_mode_checkbox = create_switch(parent, " hard mode", "hard_mode_checkbox")
        hard_mode_checkbox.setAttribute('onclick', 'document.value.hard_mode=this.checked; document.value.reset()')

        let select = create_and_append("select", parent, "language_select")
        for (let lang of ["english", "dutch", "wordle"]) {
            let option = create_and_append("option", select, lang+"_option")
            option.innerHTML = lang[0].toUpperCase() + lang.slice(1)
            option.value = lang
            option.selected = true
        }
        select.setAttribute("onchange", `let language = this.value;
            load_word_probs(language);
            let checkExist = setInterval(function() {
                if (WORDS_BY_LANG[language]) {
                    console.log("Words loaded!");
                    clearInterval(checkExist);
                    document.value.reset(null, language, null); 
                }
            }, 10); // check every 10ms`)

        let incrementer = create_incrementer(parent, "word_len", 5, "Word Length")
        document.getElementById("word_len_input").addEventListener("change", () => {
            let elem = document.getElementById("word_len_input");
            let word_len = +elem.value;
            let game = document.value; if (game.language == "wordle" && word_len != 5) {
                let language = "english"
                document.getElementById(language+"_option").selected = true;
                load_word_probs(language)

                let checkExist = setInterval(function() {
                    if (WORDS_BY_LANG[language]) {
                        clearInterval(checkExist);
                        game.reset(word_len, language, null); 
                    }
                }, 10); // check every 10ms                
            } else {
            game.reset(word_len, null, null) }
        })
    }    

    init_game_screen() {
        let game_screen = create_and_append('div', null, "game_screen")
        let screen_left = create_and_append('div', game_screen, "game_screen_left", "game_screen_division")
        let screen_mid = create_and_append('div', game_screen, "game_screen_mid", "game_screen_division")
        let screen_mid_left = create_and_append('div', screen_mid, "game_screen_mid_left")
        let screen_mid_mid = create_and_append('div', screen_mid, "game_screen_mid_mid")
        let screen_mid_right = create_and_append('div', screen_mid, "game_screen_mid_right")
        let screen_mid_bott = create_and_append('div', screen_mid, "game_screen_mid_bott")
        let screen_right = create_and_append('div', game_screen, "game_screen_right", "game_screen_division")
        let settings_overlay = create_and_append('div', screen_mid, "settings_overlay")
        let settings_div = create_and_append('div', settings_overlay, "settings_div", "game_screen_division")

        let message = create_and_append('div', screen_mid_bott, "message")
        message.innerHTML = "&nbsp"

        // Add main buttons
        let reset_btn = create_and_append('div', screen_mid_left, 'reset_btn', 'butn')
        // reset_btn.innerHTML = "Play Again"
        create_and_append("span", reset_btn, null, "glyphicon glyphicon-repeat")        
        reset_btn.setAttribute('onclick', 'document.value.reset()')

        let settings_btn = create_and_append('div', screen_mid_right, 'settings_btn', 'butn')
        // settings_btn.innerHTML = "Settings"
        create_and_append("span", settings_btn, null, "glyphicon glyphicon-cog")
        settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", true)')

        return settings_div
    }

    init_grid(parent, word_len, attempts) {
        let old_board = document.getElementById('board')
        if (old_board)
            old_board.parentElement.removeChild(old_board)

        let board = create_and_append('div', parent, id='board')
        let grid_gap = Math.min(document.body.offsetHeight, document.body.offsetWidth) / 100
        let inter_column_gaps = (word_len-1)*grid_gap
        let inter_row_gaps = (attempts-1)*grid_gap
        board.style["grid-gap"] = `${grid_gap}px`

        let reference = Math.min(document.body.offsetHeight, document.body.offsetWidth)
        let mobile_view = document.body.offsetHeight > document.body.offsetWidth

        if (word_len > attempts && mobile_view) {
            board.style['width'] = `${reference*.75}px`
            board.style['height'] = `${(board.offsetWidth-inter_column_gaps)/word_len*attempts+inter_row_gaps}px`
        } else {
            board.style['height'] = `${reference*.6}px`
            board.style['width'] = `${(board.offsetHeight-inter_row_gaps)/attempts*word_len+inter_column_gaps}px`
        }

        for (let row = 0; row < attempts; row++) {
            let row = create_and_append('div', board, null, "board_row")
            row.style["grid-gap"] = `${grid_gap}px`   
            row.style["grid-template-columns"] = `repeat(${word_len}, minmax(0, 1fr))`

            for (let col = 0; col < word_len; col++) {
                let cell = create_and_append('div', row, null, "board_cell")
                cell.innerHTML = "&nbsp"

                cell.setAttribute('data-state', 'none')
                // cell.setAttribute('onclick', 'document.value.ui.switch_cell_state(this)')
            }
        }
        board.style['grid-template-rows'] = `repeat(${attempts}, minmax(0, 1fr))`

        this.set_current_row(board.firstChild)
    }

    set_cell_state(cell, state) {
        cell.setAttribute('data-state', state)
        if (!this.inference && alphabet.includes(cell.innerHTML)) {
            let key = document.getElementById(`${cell.innerHTML}-key`)
            if (key.dataset.state != "correct")
                key.setAttribute('data-state', state)            
        }
    }

    set_current_row(new_row) {
        let current_cell = this.current_cell
        if (current_cell && current_cell.parentElement)
            current_cell.parentElement.setAttribute('class', 'board_row')
        this.current_cell = new_row.firstChild
        new_row.setAttribute('class', 'board_row current_row')        
    }

    init_keyboard(parent) {
        let old_keyboard = document.getElementById('keyboard')
        if (old_keyboard)
            old_keyboard.parentElement.removeChild(old_keyboard)

        let rows = ["q,w,e,r,t,y,u,i,o,p", 
                    "a,s,d,f,g,h,j,k,l", 
                "enter,z,x,c,v,b,n,m,backspace"]
        let keyboard = create_and_append('div', parent, id="keyboard")
        
        for (let i in rows) {
            let keys = rows[i]
            let row = create_and_append('div', keyboard, null, "keyboard_row")
            if (i == 1)
                row.style.width = "90%"
            for (let key of keys.split(",")) {
                let btn = create_and_append('div', row, `${key}-key`, "keyboard_btn")
                btn.innerHTML = key
                btn.setAttribute('onclick', `document.value.ui.key_down('${btn.innerHTML}')`)
                btn.setAttribute('data-state', 'none')
            }
        }
    }

    enter_letter(letter) {
        let cell = this.current_cell
        cell.innerHTML = letter
        if (cell.nextElementSibling != null)
            this.current_cell = cell.nextElementSibling
    }

    remove_letter() {
        let cell = this.current_cell
        let prev_cell = cell.previousElementSibling
        if (prev_cell == null)
            return

        let is_last_cell = (cell.nextElementSibling == null)

        if (is_last_cell && alphabet.includes(cell.innerHTML)) {
            cell.innerHTML = "&nbsp"
            this.set_cell_state(cell, "none")
            return
        }

        prev_cell.innerHTML = "&nbsp"
        this.set_cell_state(prev_cell, "none")
        this.current_cell = prev_cell
    }

    color_row(row, result) {
        let cell = row.firstChild
        for (let r of result) {
            this.set_cell_state(cell, r)
            cell = cell.nextElementSibling
        }
    }

    display_message(message, time=2000) {
        console.log(message)
        let div = document.getElementById('message')
        div.innerHTML = message
        div.style['display'] = 'block'
        // setTimeout(() => { div.style['display'] = 'none' }, time)
        setTimeout(() => { div.innerHTML = '&nbsp' }, time)
    }

    word_finished(row) {
        return alphabet.includes(row.lastChild.innerHTML)
    }

    get_input(row) {
        if (!this.word_finished(row)) {
            this.display_message("word not finished")
            return false
        }

        let word = []
        for (let cell of row.children) {
            word.push(cell.innerHTML)
        }
        return word.join('')        
    }

    get_state(row) {
        if (!this.word_finished(row)) {
            this.display_message("word not finished")
            return false
        }

        let result = []
        for (let cell of row.children) {
            if (cell.dataset.state == 'none')
                this.set_cell_state(cell, 'absent')
            result.push(cell.dataset.state)
            cell = cell.previousElementSibling
        }      
        return result
    }

}

let language = "wordle"
let id = load_word_probs(language)
let checkExist = setInterval(function() {
    if (WORDS_BY_LANG[language]) {
        console.log("Words loaded!");
        clearInterval(checkExist);
        new Game(5, 6, language, false, false)
    }
}, 10); // check every 10ms
