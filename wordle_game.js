const latin_alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
const greek_alphabet = ['\u03B1', '\u03B2', '\u03B3', '\u03B4', '\u03B5', '\u03B6', '\u03B7', '\u03B8', '\u03D1', '\u03B9', '\u03BA', '\u03BB', '\u03BC', '\u03BD', '\u03BE', '\u03BF', '\u03C0', '\u03D6', '\u03C1', '\u03C2', '\u03C3', '\u03C4', '\u03C5', '\u03C6', '\u03C7', '\u03C8', '\u03C9']

var alphabet = latin_alphabet

accent_dict = {
    '\xe0': 'a',
    '\xe1': 'a',
    '\xe2': 'a',
    '\xe4': 'a',
    '\xe5': 'a',
    '\xe3': 'a',
    '\xe7': 'c',
    '\xe8': 'e',
    '\xe9': 'e',
    '\xea': 'e',
    '\xeb': 'e',
    '\xec': 'i',
    '\xed': 'i',
    '\xee': 'i',
    '\xef': 'i',
    '\xf1': 'n',
    '\u0144': 'n',
    '\xf2': 'o',
    '\xf3': 'o',
    '\xf4': 'o',
    '\xf6': 'o',
    '\xf9': 'u',
    '\xfa': 'u',
    '\xfb': 'u',
    '\xfc': 'u',
    '\u015b': 's',
    '\u0105': 'a',
    '\u0107': 'c',
    '\u0119': 'e',
    '\u017a': 'z',
    '\u017c': 'z',
    '\u03ae': '\u03b7',
    '\u0389': '\u0397',
    '\u038e': '\u03a5',
    '\u038a': '\u0399',
    '\u03cb': '\u03c5',
    '\u03b0': '\u03c5',
    '\u03cd': '\u03c5',
    '\u0388': '\u0395',
    '\u038c': '\u039f',
    '\u03ad': '\u03b5',
    '\u03cc': '\u03bf',
    '\u03ca': '\u03b9',
    '\u03af': '\u03b9',
    '\u0390': '\u03b9',
    '\u03ac': '\u03b1',
    '\u03ce': '\u03c9',
    '\u03c2': '\u03c3',
}
for (let [k, v] of Object.entries(accent_dict)) {
    accent_dict[k.toUpperCase()] = v.toUpperCase()
}

var keydict = {
    13: "enter",
    8: "backspace",
}
for (keycode = 65; keycode <= 90; keycode++) {
    keydict[keycode] = alphabet[keycode-65]
}

var WORDS_BY_LANG = {}

// Maths
function random(seed) {
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript    
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function multinomial_sample(array, probs, seed=null) {
    let rand = Math.random()
    if (seed) {rand = random(seed)}
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

function sigmoid_elementwise(array, constant=0) {
    new_array = []
    for (let x of array) {
        x = x - constant
        new_array.push( sigmoid(x) )
    }
    return new_array    
}

function sigmoid(x) {
    return 1 / (1 + Math.pow(Math.E, -x))
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
    set_loader()

    let id = `${language}_words`
    let script = document.getElementById(id)
    if (!script) {
        script = create_and_append('script', document.body, id)
        script.src = `words/word_probs_${language}.js`
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

function set_loader(display="block") {
    loader = document.getElementById("loader_div")
    if (!loader) {
        return
    }
    
    loader.style.display = display
    loader.style.left = `${document.body.offsetWidth / 2 - loader.offsetWidth / 2}px`
    loader.style.top = `${document.body.offsetHeight / 2 - loader.offsetHeight / 2}px`
}

function get_share_link(include_seed=false) {
    let game = document.value

    let url = new URL(window.location.href)
    url.searchParams.set("lang", game.language)
    url.searchParams.set("word_len", game.word_len)
    if (include_seed) {
        url.searchParams.set("seed", game.seed) }

    return url
}

function get_date_string() {
    let date = new Date()
    let utc_date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    return `${utc_date.getFullYear()}${utc_date.getMonth()+1}${utc_date.getDate()}`    
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

function apply_sigmoid(word_probs) {
    for (let [key, prob] of Object.entries(word_probs)) {
        word_probs[key] = Math.log(prob) } // take log to mitigate Zipf's law

    let max = Math.max(...Object.values(word_probs))
    let min = Math.min(...Object.values(word_probs))
    let range = max - min + 1e-8
    for (let [key, prob] of Object.entries(word_probs)) {
        fixed_range_prob = (prob - min)/range * 20 - 10 // Make between -10 and 10
        word_probs[key] = sigmoid( fixed_range_prob )
    }
    return word_probs
}

function remove_accents(word) {
    new_word = ''
    for (let i in word) {
        if (Object.keys(accent_dict).includes(word[i])) {
            new_word += accent_dict[word[i]]
        } else {
            new_word += word[i]
        }
    }
    return new_word
}

// Classes
class Game {
    constructor(word_len=5, attempts=6, language="wordle", hard_mode=false, seed=null) {
        document.value = this

        this.ui = new UI(word_len, attempts)
        this.ui.resize(this.ui)

        this.reset(word_len, language, attempts, hard_mode, seed)
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
        this.ui.display_message("You lose.\nThe answer was "+this.mystery_word, 3600000)
        this.ui.current_cell = null
    }

    get_guess(row, check_vocab=true) {
        let guessed_word = this.ui.get_input(row)
        if (!guessed_word)
            return false

        if (check_vocab) {
            let allowed = false
            for (let allowed_guess of Object.keys(this.allowed_guesses)) {
                if (guessed_word == remove_accents(allowed_guess)) {
                    allowed = true }
            }
            if (!allowed) {
                this.ui.display_message(guessed_word+" isn't a valid guess")
                return false
            }
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

    get_mystery_words(language, word_len) {
        if (language == "wordle" && word_len == 5) {
            this.mystery_words = {}
            for (let word of WORDLE_WORDS) {
                this.mystery_words[word] = 1 }
            this.mystery_words = normalize_word_probs(this.mystery_words)
        } else {
            this.mystery_words = {}
            // Only add lowercase words without accents (unless greek)
            for (let [word, count] of Object.entries(this.allowed_guesses)) {
                if (word[0] == word[0].toLowerCase() && (word == remove_accents(word) || language == "greek") ) {
                    this.mystery_words[word] = count }
            }
        }
        return this.mystery_words
    }

    reset(word_len=null, language=null, attempts=null, hard_mode=null, seed=null) {
        set_loader()
        if (!word_len)
            word_len = this.word_len
        if (!language) {
            language = this.language
        } else if (language == "wordle") {
            word_len = 5
            attempts = 6
        }

        if (attempts) {
            this.attempts = attempts }
        if (hard_mode) {
            this.hard_mode = hard_mode }
        if (seed) {
            this.seed = seed }          
        
        if (this.word_len != word_len || this.language != language) {
            this.word_len = word_len
            this.language = language
            this.word_probs = WORDS_BY_LANG[this.language]
            this.filtered_word_probs = this.filter_by_len(word_len, this.word_probs)
        } else if (!seed) {
            this.seed = Math.random()*1000 }

        this.allowed_guesses = this.filtered_word_probs
        this.mystery_words = normalize_word_probs(apply_sigmoid(
            this.get_mystery_words(this.language, word_len)
        ))
        // console.log("mystery words: ", Object.entries(this.mystery_words))
        // console.log("allowed guesses: ", Object.keys(this.allowed_guesses))
        this.mystery_word = multinomial_sample(
            Object.keys(this.mystery_words), 
            Object.values(this.mystery_words),
            this.seed
        )          

        this.ui.reset(word_len, this.attempts, this.language)
        setTimeout(() => { 
            this.ui.display_message(`total allowed words: ${Object.keys(this.allowed_guesses).length}, total mystery words: ${Object.keys(this.mystery_words).length}`, 5000)
        }, 100)

        document.getElementById("word_len_input").value = this.word_len
        document.getElementById(this.language+"_option").selected = true
        document.getElementById("hard_mode_checkbox_input").checked = this.hard_mode
        if (this.seed == get_date_string()) {
            document.getElementById("page_header").innerHTML = "LINGORDLE OF THE DAY" }
        else {
            document.getElementById("page_header").innerHTML = "LINGORDLE" }

        console.log("language: ", this.language)
        console.log("word length: ", this.word_len)
        console.log("attempts: ", this.attempts)
        console.log("seed: ", this.seed)        
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
    }

    reset(word_len, attempts, lang) {
        let screen_mid_mid = document.getElementById('game_screen_mid_mid')

        this.init_grid(screen_mid_mid, word_len, attempts)
        this.init_keyboard(document.getElementById('game_screen_mid_bott'), lang)
        this.resize()
        set_loader("none")

        let new_url = get_share_link()
        window.history.pushState(null, document.title, new_url.pathname+new_url.search)
    }

    resize(ui=null) {
        let game_screen = document.getElementById('game_screen')
        let screen_left = document.getElementById('game_screen_left')
        let screen_mid = document.getElementById('game_screen_mid')
        let screen_right = document.getElementById('game_screen_right')
        let settings_overlay = document.getElementById('settings_overlay')

        let keyboard_width = Math.min(document.body.offsetWidth*.95, 800)

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

        if (!ui && document.value) {ui = document.value.ui}
        if (ui) {
            document.value.ui.init_keyboard(document.getElementById('game_screen_mid_bott'), null, keyboard_width) }
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
        let close_settings_btn = create_and_append('div', parent, 'close_settings_btn', 'butn close_btn')
        // close_settings_btn.innerHTML = "Close Settings"
        create_and_append("span", close_settings_btn, null, "glyphicon glyphicon-remove")        
        close_settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", false)')

        let hard_mode_checkbox = create_switch(parent, " hard mode", "hard_mode_checkbox")
        hard_mode_checkbox.setAttribute('onclick', 'document.value.reset(null, null, null, this.checked)')

        let select = create_and_append("select", parent, "language_select")
        let languages = ["english", "dutch", "spanish", "french", "italian", "german", "greek", "polish"]
        languages.sort()
        languages.push("wordle")
        for (let lang of languages) {
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
                    set_visibility("settings_overlay", false);
                }
            }, 10); // check every 10ms`)

        let incrementer = create_incrementer(parent, "word_len", 5, "Word Length")
        document.getElementById("word_len_input").addEventListener("change", () => {
            let elem = document.getElementById("word_len_input");
            let game = document.value; 
            let word_len = +elem.value;
            if (game.word_len == word_len) {
                return
            }
            if (game.language == "wordle" && word_len != 5) {
                let language = "english"
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

        let word_otd_btn = create_and_append('div', parent, 'word_otd_btn', 'btn')
        word_otd_btn.innerHTML = "Lingordle of the Day"
        word_otd_btn.setAttribute('onclick', 'document.value.reset(null, null, null, null, get_date_string())')
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
        create_and_append('div', document.body, "loader_div", "loader")

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
            if (key.getAttribute("data-state") != "correct")
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

    init_keyboard(parent, lang=null, width=null) {
        if (!lang) {
            lang = document.value.language
        }

        let old_keyboard = document.getElementById('keyboard')
        if (old_keyboard)
            old_keyboard.parentElement.removeChild(old_keyboard)

        alphabet = []

        let keep_lower = ["&#223"]

        let rows = ["q,w,e,r,t,y,u,i,o,p", 
                    "a,s,d,f,g,h,j,k,l", 
                "enter,z,x,c,v,b,n,m,backspace"]
        if (lang == "greek") {
            rows = ["&#949,&#961,&#964,&#965,&#952,&#953,&#959,&#960", // removed &#962
            "&#945,&#963,&#948,&#966,&#947,&#951,&#958,&#954,&#955",
            "enter,&#950,&#967,&#968,&#969,&#946,&#957,&#956,backspace"]
        } else if (lang == "dutch") {
            rows[1] += ",&#307"
        } else if (lang == "french") {
            rows[1] += ",&#230,&#339"
        } else if (lang == "german") {
            rows[1] += ",&#223"
        } else if (lang == "polish") {
            rows[1] += ",&#322"
        }
        let keyboard = create_and_append('div', parent, id="keyboard")
        
        for (let i in rows) {
            let keys = rows[i]
            let row = create_and_append('div', keyboard, null, "keyboard_row")
            if (i == 1)
                row.style.width = "90%"
            for (let key of keys.split(",")) {
                let add_class = ''
                if (keep_lower.includes(key)) {
                    add_class = 'keep_lower'
                }

                let btn = create_and_append('div', row, null, "keyboard_btn "+add_class)
                btn.innerHTML = key
                btn.id = `${btn.innerHTML}-key` // Set id based on innerHTML for formatting unique chars
                btn.setAttribute('onclick', `document.value.ui.key_down('${btn.innerHTML}')`)
                btn.setAttribute('data-state', 'none')

                if (!["enter", "backspace"].includes(key)) {
                    alphabet.push(btn.innerHTML)
                }
            }
        }

        if (width) {
            keyboard.style.width = `${width}px`
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
            if (cell.getAttribute('data-state') == 'none')
                this.set_cell_state(cell, 'absent')
            result.push(cell.getAttribute('data-state'))
            cell = cell.previousElementSibling
        }      
        return result
    }

}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

let language = "wordle"
if (urlParams.has("lang")) {
    language = urlParams.get("lang")
}

let word_len = 5
if (urlParams.has("word_len")) {
    word_len = urlParams.get("word_len")
}

let attempts = 6
if (urlParams.has("attempts")) {
    attempts = urlParams.get("attempts")
}

let seed = get_date_string()
if (urlParams.has("seed")) {
    seed = urlParams.get("seed")
}

let id = load_word_probs(language)
let checkExist = setInterval(function() {
    if (WORDS_BY_LANG[language]) {
        console.log("Words loaded!");
        clearInterval(checkExist);
        new Game(word_len, attempts, language, false, seed)
    }
}, 10); // check every 10ms