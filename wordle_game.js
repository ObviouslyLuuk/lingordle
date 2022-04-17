var ALPHABET = []
var WORD_PROBS = {}
var ALLOWED_WORDS = {}

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

function mean(array) {
    if (array.length == 0) {return 0}
    return sum_array(array) / array.length
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
        // unfade(element)
    else
        element.style['display'] = 'none'
        // fade(element)
}

function load_word_probs(language, length) {
    if (language != "wordle" && !AVAILABLE_LENGTHS[language].includes(length)) {
        if (document.value && document.value.ui) {
            document.value.ui.display_message(`Not enough words found of length ${length} in ${language}`, 2000)
        } else {
            window.location.href = window.location.origin
        }
        return null
    }

    set_loader()

    let probs_id = `${language}_word_probs_L${length}`
    let probs_script = document.getElementById(probs_id)
    if (!probs_script) {
        probs_script = create_and_append('script', document.body, probs_id)
        probs_script.src = `word_sampling_distrs/${language}/${language}_distr_len=${length}.js`
        probs_script.type = "text/javascript"
        probs_script.charset = "UTF-8"
    }
    let allow_id = `${language}_allowed_L${length}`
    let allow_script = document.getElementById(allow_id)
    if (!allow_script) {
        allow_script = create_and_append('script', document.body, allow_id)
        allow_script.src = `words_allowed/${language}/${language}_allowed_len=${length}.js`
        allow_script.type = "text/javascript"
        allow_script.charset = "UTF-8"
    }
    return { probs_id, allow_id }
}

function move_element(element, new_parent) {
    element.parentElement.removeChild(element)
    new_parent.appendChild(element)
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
    else {
        url.searchParams.delete("seed") }

    return url
}

function get_date_string() {
    let date = new Date()
    let utc_date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    return `${utc_date.getFullYear()}${utc_date.getMonth()+1}${utc_date.getDate()}`    
}

function HTMLify_text(text) {
    for (let [key, value] of Object.entries(HTML_DICT)) {
        text = text.replaceAll(key, value)
    }
    return text
}

function get_share_string(use_dict=emoji_dict_code) {
    let game = document.value
    let results = game.get_results()

    let language = game.language
    let LotD = ""
    let seed_text = `\nseed: ${game.seed}`
    if (game.is_LotD()) {
        LotD = " of the Day"
        seed_text = ""
    }

    if (results.length < 1) {return `I'm playing ${language.toTitleCase()} Lingordle${LotD} :D${seed_text}`}

    let attempts = results.length
    let total_attempts = game.attempts

    let last_row = results[results.length-1]
    if (last_row.includes("present") || last_row.includes("absent")) {attempts = "X"}

    let text = `${language.toTitleCase()} Lingordle${LotD} ${attempts}/${total_attempts}\n`
    for (let row of results) {
        text += "\n"
        for (let result of row) {
            text += use_dict[result]
        }
    }
    text += seed_text
    return text
}

function get_twitter_link() {
    let text = get_share_string(emoji_dict)
    let link = TWITTER_SHARE_LINK + HTMLify_text(text)
    return link
}

function isAlpha(c){
    // https://stackoverflow.com/questions/40120915/javascript-function-that-returns-true-if-a-letter
    return /^[A-Z]$/i.test(c);
  }

function toTitleCase(text) {
    if (text.length == 1) {text = [text]}

    let new_text = ""
    let prev_char = ""
    for (let c of text) {
        if (isAlpha(prev_char)) {new_text += c}
        else                    {new_text += c.toUpperCase()}
        prev_char = c
    }
    return new_text
}

function print_mystery_words() {
    console.log(Object.keys(document.value.mystery_words))
}

Object.defineProperty( String.prototype, 'toTitleCase', {
	value: function (param) {
        return toTitleCase(this.toString())}
})

// Data manipulation
function get_closest_num(value, list) {
    let closest = list[0]
    for (let v of list) {
        if (Math.abs(value-v) < Math.abs(value-closest)) {
            closest = v }
    }
    return closest
}

function order_dict_by_value(dict) {
    return Object.fromEntries(Object.entries(dict).sort(([,v1],[,v2]) => v2-v1))
}

function normalize_dict_values(dict) {
    let sum = sum_array(Object.values(dict))
    for (let key of Object.keys(dict)) {
        dict[key] /= sum
    }
    return dict
}

function remove_accents(word, lang=document.value.language) {
    let accent_dict = LANG_DICT[lang].accent_dict
    if (!accent_dict) {accent_dict = {}}

    let new_word = ''
    for (let i in word) {
        c = word[i]
        // c = c.toLowerCase()
        if (Object.keys(accent_dict).includes(c)) {
            new_word += accent_dict[c]
        } else {
            new_word += c
        }
    }
    return new_word
}

function copy_to_clipboard(text) {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    navigator.clipboard.writeText(text).then(function() {
        /* clipboard successfully set */
        document.value.ui.display_message("copied to clipboard")
    }, function() {
        console.log("clipboard write failed")
    });
}

// Classes
class Game {
    constructor(word_len=5, attempts=6, language="wordle", hard_mode=false, seed=null) {
        document.value = this

        this.language
        this.word_len
        this.attempts
        this.hard_mode
        this.seed

        this.filtered_word_probs
        this.allowed_guesses
        this.mystery_words
        this.mystery_word

        this.win_list
        this.guess_distribution

        this.possible_answers
        this.possible_answers_last_updated = 0

        this.board_hint = false
        this.keyboard_freq = false
        this.keyboard_freq_dict

        this.init_stats(attempts)

        this.ui = new UI(word_len, attempts, language)
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

        if (this.keyboard_freq) {
            this.set_keyboard_freq(true)
        }
        if (this.board_hint) {
            this.set_board_hint(true)
        }
    }

    set_board_hint(state) {
        this.board_hint = state

        if (this.board_hint) {
            this.update_possible_answers()

            this.ui.update_board_hint(this.keyboard_freq_dict)
        } else {
            this.ui.update_board_hint()
        }
    }

    set_keyboard_freq(state) {
        this.keyboard_freq = state

        if (this.keyboard_freq) {
            this.update_possible_answers()

            this.ui.update_keyboard_freq(this.keyboard_freq_dict, Object.values(this.possible_answers).length)
        } else {
            this.ui.update_keyboard_freq()
        }
    }

    update_possible_answers() {
        if (!this.possible_answers) {
            this.possible_answers = Object.assign({}, this.mystery_words)
            this.count_key_freqs()
        }

        let possible_answers = {}
        let results = this.get_results()
        let rows = document.getElementById("board").children

        if (this.possible_answers_last_updated - results.length == 0) {return this.possible_answers}

        for (let [word,prob] of Object.entries(this.possible_answers)) {
            let allowed = true
            for (let i = this.possible_answers_last_updated; i < results.length; i++) {
                let result = results[i]
                let guessed_word = this.get_guess(rows[i], false)
                if (!this.word_possible(guessed_word, result, word)) {
                    allowed = false
                    for (let l in word) {
                        let c = word[l]
                        if (!ALPHABET.includes(c)) {continue}
                        this.keyboard_freq_dict[l][c] -= parseInt(prob*1e6)
                    }
                    break
                }
            }
            if (allowed) {possible_answers[word] = this.possible_answers[word]}
        }
        this.possible_answers = possible_answers
        this.possible_answers_last_updated = results.length
        return this.possible_answers
    }

    count_key_freqs() {
        // possible_answers already has to be updated here
        let key_freqs = {}
        for (let l = 0; l < this.word_len; l++) {
            key_freqs[l] = {}
            for (let c of ALPHABET) {key_freqs[l][c]=0}
        }

        for (let [word,prob] of Object.entries(this.possible_answers)) {
            for (let l in word) {
                let c = word[l]
                if (!ALPHABET.includes(c)) {continue}
                key_freqs[l][c] += parseInt(prob*1e6)
            }
        }
        this.keyboard_freq_dict = key_freqs
        return key_freqs
    }

    word_allowed(guessed_word, result, word) {
        word = remove_accents(word)

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

    word_possible(guessed_word, result, word) {
        word = remove_accents(word)

        let correct_or_present = []
        for (let i in result) {if (["correct","present"].includes(result[i])) {correct_or_present.push(guessed_word[i])}}

        for (let i in result) {
            let c = guessed_word[i]

            switch (result[i]) {
                case "correct":
                    if (word[i] != c)                       {return false}
                    break;
                case "present":
                    if (!word.includes(c) || word[i] == c)  {return false}
                    break;
                default:
                    if (word[i] == c)                       {return false}
                    else if (word.includes(c) && correct_or_present.includes(c)) {
                        correct_or_present.splice(correct_or_present.indexOf(c)) }
                    else if (word.includes(c))              {return false}
                    break;
            }
        }
        return true
    }

    update_allowed_guesses(guessed_word, result) {
        if (!this.hard_mode)
            return this.allowed_guesses

        let allowed_guesses = []
        for (let word of this.allowed_guesses) {
            if (this.word_allowed(guessed_word, result, word))
                allowed_guesses.push(word)
        }
        this.allowed_guesses = allowed_guesses
        return this.allowed_guesses
    }

    evaluate_word(mystery_word, guessed_word) {
        mystery_word = remove_accents(mystery_word)

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
        this.win_list.push(true)
        let guesses = this.get_results().length
        if (!this.guess_distribution[guesses]) {this.guess_distribution[guesses] = 0}
        this.guess_distribution[guesses] ++

        this.ui.update_win_screen(true)
        this.ui.current_cell = null
    }
    
    lose_fn() {
        this.win_list.push(false)

        this.ui.update_win_screen(false)
        this.ui.current_cell = null
    }

    get_guess(row, check_vocab=true) {
        let guessed_word = this.ui.get_input(row)
        if (!guessed_word)
            return false

        if (check_vocab) {
            let allowed = false
            for (let allowed_guess of this.allowed_guesses) {
                if (guessed_word == remove_accents(allowed_guess)) {
                    allowed = true }
            }
            if (!allowed) {
                this.ui.display_message(guessed_word.toUpperCase()+` isn't a valid guess.`,
                10000)
                let msg_div = document.getElementById('message')
                msg_div.innerHTML += ` Disagree? <a class='link' onclick='set_visibility("form_overlay", true)'>Add word</a>`
                return false
            }
        }
        return guessed_word
    }

    get_results() {
        let results = []
        for (let row of document.getElementById("board").children) {
            let result = this.ui.get_state(row, print=false)
            if (!result) {break}

            results.push(result)
        }
        return results
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
        } else if (last_attempt) {
            this.lose_fn() }
        
        return false
    }

    init_stats(attempts) {
        // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage
        try {
            this.win_list = JSON.parse(localStorage.getItem("Lingordle_win_list"))
        } catch(e) {}
        if (!this.win_list) {
            this.win_list = [] }
        
        try {
            this.guess_distribution = JSON.parse(localStorage.getItem("Lingordle_guess_distribution"))
        } catch(e) {}
        if (!this.guess_distribution) {
            this.guess_distribution = {}
            for (let i = 1; i <= attempts; i++) {
                this.guess_distribution[i] = 0 } 
        }
    }

    is_LotD() {
        return this.seed == get_date_string()
    }

    wait_for_reset(word_len, language) {
        if (language == "wordle" && word_len != 5) {language = "english"}

        let id = load_word_probs(language, word_len);
        if (id == null) {
            if (language != this.language) {
                let new_word_len = get_closest_num(word_len, AVAILABLE_LENGTHS[language])
                this.wait_for_reset(new_word_len, language)
            } else {
                document.getElementById("word_len_input").value = this.word_len
            }
            return
        }
        let game = this
        let key = `${language},${word_len}`
        let checkExist = setInterval(function() {
            if (WORD_PROBS[key] && ALLOWED_WORDS[key]) {
                console.log("Words loaded!")
                clearInterval(checkExist);
                game.reset(word_len, language); 
            }
        }, 10); // check every 10ms
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

        if (this.word_len != word_len || this.language != language) {
            this.word_len = word_len
            this.language = language
            let key = `${this.language},${this.word_len}`
            this.mystery_words = WORD_PROBS[key]
            this.allowed_guesses = ALLOWED_WORDS[key].concat(Object.keys(this.mystery_words))
        } else {
            this.seed = parseInt(Math.random()*99999) }

        if (attempts) {
            this.attempts = attempts }
        if (hard_mode != null) {
            this.hard_mode = hard_mode }
        if (seed != null) {
            this.seed = seed }


        // console.log("mystery words: ", Object.entries(this.mystery_words))
        // console.log("allowed guesses: ", this.allowed_guesses)
        this.mystery_word = multinomial_sample(
            Object.keys(this.mystery_words), 
            Object.values(this.mystery_words),
            this.seed
        )          

        this.ui.reset(word_len, this.attempts, this.language)
        this.ui.display_message(`${this.language.toTitleCase()}<br>total allowed words: ${this.allowed_guesses.length}<br>total mystery words: ${Object.keys(this.mystery_words).length}`, 5000)

        document.getElementById("word_len_input").value = this.word_len
        document.getElementById(this.language+"_option").selected = true
        document.getElementById("hard_mode_checkbox_input").checked = this.hard_mode
        if (this.is_LotD()) {
            document.getElementById("page_header").innerHTML = "LINGORDLE OF THE DAY" }
        else {
            document.getElementById("page_header").innerHTML = "LINGORDLE" }

        this.ui.update_win_screen()

        this.possible_answers_last_updated = 0
        this.possible_answers = null
        if (this.keyboard_freq) {
            this.set_keyboard_freq(true) }
        if (this.board_hint) {
            this.set_board_hint(true) }

        let new_url = get_share_link((seed != null))
        window.history.pushState(null, document.title, new_url.pathname+new_url.search)

        console.log("\nNEW ROUND")
        console.log("language: ", this.language)
        console.log("word length: ", this.word_len)
        console.log("attempts: ", this.attempts)
        console.log("hard mode: ", this.hard_mode)
        console.log("seed: ", this.seed)
    }
}


class UI {
    constructor(word_len, attempts, lang) {
        this.current_cell = null

        this.init_game_screen()
        this.reset(word_len, attempts, lang)
        this.init_overlays()

        window.addEventListener('resize', this.resize)
        window.addEventListener("keydown", (event) => {if (event.key == "Backspace"){document.value.ui.keycode_down(event.key)}})
        window.addEventListener("keypress", (event) => {if (event.key != " "){document.value.ui.keycode_down(event.key)}})
    }

    reset(word_len, attempts, lang) {
        let screen_mid_mid = document.getElementById('game_screen_mid_mid')

        this.init_grid(screen_mid_mid, word_len, attempts, lang)
        this.init_keyboard(document.getElementById('game_screen_mid_bott'), lang)
        this.resize()
        set_loader("none")
    }

    resize(ui=null) {
        let game_screen = document.getElementById('game_screen')
        // let screen_left = document.getElementById('game_screen_left')
        let screen_mid = document.getElementById('game_screen_mid')
        // let screen_right = document.getElementById('game_screen_right')
        let settings_overlay = document.getElementById('settings_overlay')

        // screen_left.style['height'] = `${screen_mid.offsetHeight}px`
        // Mobile view
        if (document.body.offsetHeight > document.body.offsetWidth) {
            // move_element(screen_left, settings_overlay)
            // move_element(screen_right, settings_overlay)
            game_screen.style['grid-template-columns'] = "auto"
            screen_mid.style.width = `${document.body.offsetWidth*.95}px`
        // Desktop view
        } else {
            // move_element(screen_left, game_screen)
            // move_element(screen_mid, game_screen)
            // move_element(screen_right, game_screen)
            // game_screen.style['grid-template-columns'] = "auto auto auto"
            screen_mid.style.width = `100%`
        }

        let keyboard = document.getElementById("keyboard")
        if (keyboard) {
            let keyboard_width = Math.min(document.body.offsetWidth*.95, 800)
            keyboard.style.width = `${keyboard_width}px`
            keyboard.style.height = `${250}px` }

        let game = document.value
        if (game.ui) {
            game.ui.resize_board(document.getElementById("board")) }
    }

    keycode_down(keycode) {
        let game = document.value
        let key = keycode.toLowerCase()
        game.ui.key_down(key)
    }

    key_down(key) {
        if (ALPHABET.includes(key)) {
            this.enter_letter(key)
        } else if (key == "backspace") {
            this.remove_letter()
        } else if (key == "enter") {
            document.value.step()
        } else {
            document.value.ui.display_message(`Key "${key}" is not in this language's alphabet<br>You could try switching your system's keyboard language`, 1000)
        }
    }

    init_settings(parent) {
        let close_settings_btn = create_and_append('div', parent, 'close_settings_btn', 'butn close_btn')
        // close_settings_btn.innerHTML = "Close Settings"
        create_and_append("span", close_settings_btn, null, "glyphicon glyphicon-remove")        
        close_settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", false)')

        let subscript

        let hard_mode_checkbox = create_switch(parent, " hard mode", "hard_mode_checkbox")
        hard_mode_checkbox.setAttribute('onclick', 'document.value.reset(null, null, null, this.checked)')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Revealed letters must be used in subsequent guesses'

        let select = create_and_append("select", parent, "language_select")
        let languages = Object.keys(LANG_DICT)
        languages.sort()
        languages.push("wordle")
        for (let lang of languages) {
            let option = create_and_append("option", select, lang+"_option")
            option.innerHTML = lang.toTitleCase()
            option.value = lang
            option.selected = true
        }
        select.setAttribute("onchange", `let language = this.value; let word_len = document.value.word_len;
            document.value.wait_for_reset(word_len, language);
            set_visibility("settings_overlay", false);`)
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Switch to another language'            

        let incrementer = create_incrementer(parent, "word_len", 5, "Word Length")
        document.getElementById("word_len_input").addEventListener("change", () => {
            let elem = document.getElementById("word_len_input");
            let game = document.value; 
            let word_len = +elem.value;
            if (game.word_len == word_len) { return }

            game.wait_for_reset(word_len, game.language)
        })
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Change word length'
        
        let hide_loan_chars = create_switch(parent, " hide loan characters", "hide_loan_chars")
        hide_loan_chars.setAttribute('onclick', 'document.value.ui.show_loan_chars(!this.checked)')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = "hide characters that aren't used in words native to the language"        

        let word_otd_btn = create_and_append('div', parent, 'word_otd_btn', 'btn')
        word_otd_btn.innerHTML = "Lingordle of the Day"
        word_otd_btn.setAttribute('onclick', 'document.value.reset(null, null, null, null, get_date_string())')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Switch back to the Lingordle of the Day'
        
        // Cheats
        let cheats_title = create_and_append("h2", parent)
        cheats_title.innerHTML = "Cheats"

        let keyboard_freq_cheat = create_switch(parent, " character frequency")
        keyboard_freq_cheat.setAttribute('onclick', 'document.value.set_keyboard_freq(this.checked)')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'more likely characters will be lighter on the keyboard'

        let board_hints = create_switch(parent, " position frequency")
        board_hints.setAttribute('onclick', 'document.value.set_board_hint(this.checked)')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'for every position the most likely character will be displayed'
    }

    init_help(parent) {
        let close_help_btn = create_and_append('div', parent, 'close_help_btn', 'butn close_btn')
        create_and_append("span", close_help_btn, null, "glyphicon glyphicon-remove")
        close_help_btn.setAttribute('onclick', 'set_visibility("help_overlay", false)')

        parent = create_and_append("div", parent, "help_div")
        parent.style.height = `${document.body.offsetHeight*.85}px`
        parent.style["padding-right"] = "10px"
        parent.setAttribute('data-simplebar', "init")

        let cell_width = 50
        let word, board, row

        for (let text of [
            'This WORDLE clone allows you to change the language and word length in the settings <span class="glyphicon glyphicon-cog"></span>.',
        ]) {
            let p = create_and_append("p", parent, null, null)
            p.innerHTML = text
        }

        word = "magnifique"
        let gap = 5
        let margin = 5
        let max_row_width = Math.min(cell_width*word.length, document.body.offsetWidth*.7)
        board = this.build_grid(parent, null, word.length, 1, gap, null, max_row_width)
        board.style.margin = `${margin}px`
        row = board.firstChild
        for (let i in word) {
            let cell = row.children[i]
            cell.innerHTML = word[i]
        }
        this.color_row(row, Array(word.length).fill("correct"), false)
        parent.parentElement.style.width = `${max_row_width+2*margin+20*2}px` // 20 is the parent padding

        for (let text of [
            '<br>Guess the LINGORDLE in six tries.',
            'Each guess must be a valid word. Hit the enter button to submit.',
            'After each guess, the color of the tiles will change to show how close your guess was to the word.<br>',
        ]) {
            let p = create_and_append("p", parent, null, null)
            p.innerHTML = text
        }

        word = "sheep"
        board = this.build_grid(parent, null, word.length, 1, 5, null, Math.min(cell_width*word.length, document.body.offsetWidth*.7))
        board.style.margin = "5px"
        row = board.firstChild
        for (let i in word) {
            let cell = row.children[i]
            cell.innerHTML = word[i]
        }
        this.color_row(row, ["correct", "absent", "present", "absent", "absent"], false)

        for (let text of [
            'The letter <b>S</b> is in the correct spot.',
            'The letter <b>E</b> is in the answer, but only once, and in a different location.',
            'The letters <b>H</b> and <b>P</b> do not occur in the answer.',
        ]) {
            let p = create_and_append("p", parent, null, null)
            p.innerHTML = text
        }

        word = "sauce"
        board = this.build_grid(parent, null, word.length, 1, 5, null, Math.min(cell_width*word.length, document.body.offsetWidth*.7))
        board.style.margin = "5px"
        row = board.firstChild
        for (let i in word) {
            let cell = row.children[i]
            cell.innerHTML = word[i]
        }
        this.color_row(row, Array(word.length).fill("correct"), false)

        for (let text of [
            '<br>Every day this homepage opens on the "Lingordle of the Day", which is the same for everyone.',
            'By clicking the replay button <span class="glyphicon glyphicon-repeat"></span> you can keep playing with random words.',
            'You can reset to the Lingordle of the Day in the settings <span class="glyphicon glyphicon-cog"></span>.',
        ]) {
            let p = create_and_append("p", parent, null, null)
            p.innerHTML = text
        }
    }

    init_win_screen(parent) {
        let close_btn = create_and_append('div', parent, null, 'butn close_btn')
        create_and_append("span", close_btn, null, "glyphicon glyphicon-remove")        
        close_btn.setAttribute('onclick', 'set_visibility("win_overlay", false)')

        let title = create_and_append('h1', parent, "win_title", "title")
        title.innerHTML = ""

        let game = document.value

        let guess_distribution = game.guess_distribution
        let guess_bars_title = create_and_append("h2", parent, null, "title")
        guess_bars_title.innerHTML = "Guess Distribution"
        this.init_guess_bars(parent, guess_distribution)

        let win_rate = create_and_append("div", parent, "win_rate")
        let win_rate_value = create_and_append("h2", win_rate, "win_rate_value")
        let win_rate_title = create_and_append("div", win_rate)
        win_rate_value.innerHTML = `${(mean(game.win_list)*100).toFixed(0)}%`
        win_rate_title.innerHTML = "wins"

        let tweet_btn = create_and_append('button', parent, "tweet_btn", "btn btn-primary")
        tweet_btn.innerHTML = "Tweet "+TWITTER_ICON

        let copy_btn = create_and_append('button', parent, null, "btn btn-secondary")
        copy_btn.innerHTML = "Copy result "+COPY_ICON
        copy_btn.setAttribute("onclick", "copy_to_clipboard(get_share_string())")

        let share_seed_btn = create_and_append('button', parent, "share_seed", "btn btn-secondary")
        share_seed_btn.innerHTML = "Share this Word"
        share_seed_btn.setAttribute("onclick", "copy_to_clipboard(get_share_link(true))")

        let play_again_btn = create_and_append('button', parent, "play_again_btn", "btn")
        play_again_btn.innerHTML = "Play Random Word"
        play_again_btn.setAttribute("onclick", 'document.value.reset(); set_visibility("win_overlay", false)')
    }

    init_guess_bars(parent, guess_distribution) {
        let guess_bars = document.getElementById("guess_bars")
        if (!guess_bars) {
            guess_bars = create_and_append("div", parent, "guess_bars")
        } else {
            empty_element(guess_bars)
        }
        let max_count = Math.max(Math.max(...Object.values(guess_distribution)), 1)
        for (let [num, count] of Object.entries(guess_distribution)) {
            let guess_bar_div = create_and_append("div", guess_bars, null, "guess_bar_div")
            let num_div = create_and_append("div", guess_bar_div, null, "guess_bar_num")
            num_div.innerHTML = `${num} `
            let guess_bar = create_and_append("div", guess_bar_div, null, "guess_bar")
            guess_bar.style["min-width"] = `15px`
            let percentage = count/max_count * 100
            guess_bar.style.width = `${percentage}%`
            guess_bar.innerHTML = count
        }
        return guess_bars
    }

    update_win_screen(won=null) {
        let message
        let game = document.value
        if (won) {
            message = "You Won!"
        } else if (won == false) {
            message = `Too bad :(<br>the word was '${game.mystery_word}'`
        } else if (won == null) {
            message = ''
        }
        let title = document.getElementById("win_title")
        title.innerHTML = message
        // this.display_message(message, 10000)

        document.getElementById("win_rate_value").innerHTML = `${(mean(game.win_list)*100).toFixed(0)}%`
        this.init_guess_bars(title.parentElement, game.guess_distribution)
        
        localStorage.setItem("Lingordle_win_list", JSON.stringify(game.win_list))
        localStorage.setItem("Lingordle_guess_distribution", JSON.stringify(game.guess_distribution))

        let share_seed_btn = document.getElementById("share_seed")
        if (game.is_LotD()) {
            share_seed_btn.style.display = "none"
        } else {
            share_seed_btn.style.display = "block"
        }

        let tweet_btn = document.getElementById("tweet_btn")
        tweet_btn.setAttribute('onclick', `window.open("${get_twitter_link()}", '_blank').focus()`)

        if (won != null) {
            setTimeout(() => { 
                // set_visibility("win_overlay", true)
                // unfade(document.getElementById("win_overlay"))
                let win_overlay = document.getElementById("win_overlay")
                win_overlay.setAttribute("data-animation", "fade_in")
                win_overlay.style.display = "grid"
            }, 1000)
        }
    }

    init_form(parent) {
        let width=400, height=600
        let form_HTML = `<iframe id="form_frame" src="https://docs.google.com/forms/d/e/1FAIpQLSdqORg91cAGu2u4i4KqGengJkiADum6AoS-n7K-c7xHuFZGiA/viewform?embedded=true" 
            width="${width}" height="${height}" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`
        parent.innerHTML = form_HTML

        // No access to the iframe content apparently
        // let div_to_remove = document.getElementById('form_frame').contentWindow.document.getElementsByClassName("freebirdFormviewerViewFooterEmbeddedBackground")[0]
        // div_to_remove.parentElement.removeChild(div_to_remove)

        let close_form_btn = create_and_append('div', parent, 'close_form_btn', 'butn close_btn')
        create_and_append("span", close_form_btn, null, "glyphicon glyphicon-remove")        
        close_form_btn.setAttribute('onclick', 'set_visibility("form_overlay", false)')
    }

    init_overlays() {
        let settings_overlay = create_and_append('div', document.body, "settings_overlay", "overlay")
        let settings_div = create_and_append('div', settings_overlay, "settings_div", "game_screen_division")
        let help_overlay = create_and_append('div', document.body, "help_overlay", "overlay")
        let win_overlay = create_and_append('div', document.body, "win_overlay", "overlay")
        let form_overlay = create_and_append('div', document.body, "form_overlay", "overlay")

        this.init_settings(settings_div)
        this.init_help(help_overlay)
        this.init_win_screen(win_overlay)
        this.init_form(form_overlay)

        let overlays = {
            "help_overlay": {div: help_overlay, btn_ids: ["help_btn"]},
            "win_overlay": {div: win_overlay, btn_ids: ["game_screen_mid_bott", "stats_btn"]},
            "form_overlay": {div: form_overlay, btn_ids: ["message"]},
            "settings_overlay": {div: settings_overlay, btn_ids: ["settings_btn"]},
            "message": {div: document.getElementById("message"), btn_ids: ["message"]}
        }

        // Close overlay when clicking elsewhere
        for (let [id, {div, btn_ids}] of Object.entries(overlays)) {
            window.addEventListener('click', (e) => {
                let includes_btn = false
                for (let btn_id of btn_ids) {
                    if (e.path.includes(document.getElementById(btn_id))) {
                        includes_btn = true; break }
                }

                if (e.path.includes(div) || includes_btn) {return}
                set_visibility(id, false)
            })
        }
        // Close help overlay when clicking anywhere
        window.addEventListener('click', (e) => {
            let help_btn = document.getElementById("help_btn")
            if (e.path.includes(help_btn)) {return}
            set_visibility("help_overlay", false)
        })        
    }

    init_game_screen() {
        let game_screen = create_and_append('div', null, "game_screen")
        // let screen_left = create_and_append('div', game_screen, "game_screen_left", "game_screen_division")
        let screen_mid = create_and_append('div', game_screen, "game_screen_mid", "game_screen_division")
        let screen_mid_left = create_and_append('div', screen_mid, "game_screen_mid_left")
        let screen_mid_mid = create_and_append('div', screen_mid, "game_screen_mid_mid")
        let screen_mid_right = create_and_append('div', screen_mid, "game_screen_mid_right")
        let screen_mid_bott = create_and_append('div', screen_mid, "game_screen_mid_bott")
        // let screen_right = create_and_append('div', game_screen, "game_screen_right", "game_screen_division")

        create_and_append('div', document.body, "loader_div", "loader")

        let message = create_and_append('div', document.body, "message")
        message.innerHTML = "&nbsp"

        // Add main buttons
        let reset_btn = create_and_append('div', screen_mid_left, 'reset_btn', 'butn')
        create_and_append("span", reset_btn, null, "glyphicon glyphicon-repeat")        
        reset_btn.setAttribute('onclick', 'document.value.reset()')

        let stats_btn = create_and_append('div', screen_mid_left, 'stats_btn', 'butn')
        stats_btn.innerHTML = BARCHART_ICON
        stats_btn.setAttribute('onclick', 'set_visibility("win_overlay", true)')      

        let settings_btn = create_and_append('div', screen_mid_right, 'settings_btn', 'butn')
        create_and_append("span", settings_btn, null, "glyphicon glyphicon-cog")
        settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", true)')

        let help_btn = create_and_append('div', screen_mid_right, 'help_btn', 'butn')
        help_btn.innerHTML = QUESTION_MARK
        help_btn.setAttribute('onclick', 'set_visibility("help_overlay", true)')
    }

    init_grid(parent, word_len, attempts, lang) {
        let old_board = document.getElementById('board')
        if (old_board)
            old_board.parentElement.removeChild(old_board)

        let grid_gap = Math.min(document.body.offsetHeight, document.body.offsetWidth) / 100

        let reference = Math.min(document.body.offsetHeight, document.body.offsetWidth)
        let mobile_view = document.body.offsetHeight > document.body.offsetWidth

        let height, width
        if (word_len > attempts && mobile_view) {
            width = reference*.75 } 
        else {
            height = reference*.5 }

        let board = this.build_grid(parent, "board", word_len, attempts, grid_gap, height, width, lang)

        this.set_current_row(board.firstChild)
    }

    build_grid(parent, id, word_len, attempts, grid_gap, height=null, width=null, lang=null) {
        let board = create_and_append('div', parent, id=id, "board")
        board.style["grid-gap"] = `${grid_gap}px`
        let inter_column_gaps = (word_len-1)*grid_gap
        let inter_row_gaps = (attempts-1)*grid_gap

        if (height) {
            board.style['height'] = `${height}px`
            board.style['width'] = `${(height-inter_row_gaps)/attempts*word_len+inter_column_gaps}px`
        } else if (width) {
            board.style['width'] = `${width}px`
            board.style['height'] = `${(width-inter_column_gaps)/word_len*attempts+inter_row_gaps}px`
        }

        for (let row = 0; row < attempts; row++) {
            let row = create_and_append('div', board, null, "board_row")
            row.style["grid-gap"] = `${grid_gap}px`   
            row.style["grid-template-columns"] = `repeat(${word_len}, minmax(0, 1fr))`

            if (lang && lang != "wordle" && LANG_DICT[lang].right_to_left) {
                row.style["display"] = "flex"
                row.style["flex-direction"] = "row-reverse" }            

            for (let col = 0; col < word_len; col++) {
                let cell = create_and_append('div', row, null, "board_cell")
                cell.innerHTML = "&nbsp"

                cell.setAttribute('data-state', 'none')
                cell.setAttribute("onanimationend", 'this.setAttribute("data-animation", "none")')
                // cell.setAttribute('onclick', 'document.value.ui.switch_cell_state(this)')
                cell.setAttribute('onclick', 'let ui = document.value.ui; if (ui.current_cell.parentElement != this.parentElement) {return}; ui.set_current_cell(this, true)')
            }
        }
        board.style['grid-template-rows'] = `repeat(${attempts}, minmax(0, 1fr))`

        return board
    }

    resize_board(board) {
        let game = document.value
        let word_len = game.word_len
        let attempts = game.attempts

        let grid_gap = Math.min(document.body.offsetHeight, document.body.offsetWidth) / 100
        board.style["grid-gap"] = `${grid_gap}px`
        let inter_column_gaps = (word_len-1)*grid_gap
        let inter_row_gaps = (attempts-1)*grid_gap

        let title_div = document.getElementById("page_title_div")
        let keyboard = document.getElementById("keyboard")
        let allowed_height = document.body.offsetHeight - title_div.offsetHeight - keyboard.offsetHeight
        let mid_right = document.getElementById("game_screen_mid_right")
        let mid_left = document.getElementById("game_screen_mid_left")
        let allowed_width = document.body.offsetWidth - mid_left.offsetWidth - mid_right.offsetWidth

        let allowed_wideness = allowed_width/allowed_height
        let wideness = word_len/attempts

        if (wideness > allowed_wideness) {
            let width = allowed_width *.85
            board.style['width'] = `${width}px`
            board.style['height'] = `${(width-inter_column_gaps)/word_len*attempts+inter_row_gaps}px`
        } else {
            let height = allowed_height *.85
            board.style['height'] = `${height}px`
            board.style['width'] = `${(height-inter_row_gaps)/attempts*word_len+inter_column_gaps}px`
        }
    }

    set_cell_state(cell, state, change_keys) {
        cell.setAttribute('data-state', state)
        if (change_keys && !this.inference && ALPHABET.includes(cell.innerHTML)) {
            let key = document.getElementById(`${cell.innerHTML}-key`)
            if      (key.getAttribute("data-state") != "correct" &&
                   !(key.getAttribute("data-state") == "present" && state == "absent"))
                key.setAttribute('data-state', state)
        }
    }

    set_current_cell(cell, animate=false) {
        if (animate) {cell.setAttribute("data-animation", "pop")}
        cell.setAttribute("data-current_cell", true)
        if (this.current_cell) {
            this.current_cell.removeAttribute("data-current_cell") }
        this.current_cell = cell
    }

    set_current_row(new_row) {
        let current_cell = this.current_cell
        if (current_cell && current_cell.parentElement)
            current_cell.parentElement.setAttribute('class', 'board_row')
        this.set_current_cell(new_row.firstChild)
        new_row.setAttribute('class', 'board_row current_row')        
    }

    init_keyboard(parent, lang=null, width=null) {
        if (!lang) {
            lang = document.value.language
        }
        if (lang == "wordle" || !lang) {lang = "english"}

        let old_keyboard = document.getElementById('keyboard')
        if (old_keyboard)
            old_keyboard.parentElement.removeChild(old_keyboard)

        ALPHABET = []

        let rows = []
        for (let row of LANG_DICT[lang]["keyboard"]) {
            rows.push([...row]) }
        let middle_row = (rows.length-1)-1 // We'll call second to last: middle
        rows[rows.length-1].push("backspace")
        rows.push(["enter"])
        let extra_chars = LANG_DICT[lang].extra_chars
        if (!extra_chars) {extra_chars = []}
        let loan_chars = LANG_DICT[lang].loan_chars
        if (!loan_chars) {loan_chars = []}

        let keyboard = create_and_append('div', parent, "keyboard")
        
        for (let i in rows) {
            let keys = rows[i]
            let row = create_and_append('div', keyboard, null, "keyboard_row")
            if (i == middle_row)
                row.style.width = "90%"
            for (let key of keys) {
                let add_class = ''
                if (extra_chars.includes(key)) {
                    add_class += " extra_char" }
                if (loan_chars.includes(key)) {
                    add_class += " loan_char" }

                let btn = create_and_append('div', row, null, "keyboard_btn"+add_class)
                btn.innerHTML = key
                btn.id = `${btn.innerHTML}-key` // Set id based on innerHTML for formatting unique chars
                btn.setAttribute('onclick', `document.value.ui.key_down('${btn.innerHTML}')`)
                btn.setAttribute('data-state', 'none')
                if (LANG_DICT[lang].loan_chars && LANG_DICT[lang].loan_chars.includes(key)) {
                    btn.setAttribute('data-state', 'absent')
                }

                if (!["enter", "backspace"].includes(key)) {
                    ALPHABET.push(btn.innerHTML)
                } else if (key == "backspace") {
                    btn.innerHTML = BACKSPACE_1
                }
            }
        }

        if (width) {
            keyboard.style.width = `${width}px`
        }
    }

    show_loan_chars(state=true) {
        let style = document.getElementById("loan_char_style")
        if (state) {style.innerHTML = ""}
        else       {style.innerHTML = ".loan_char {display: none}"}
    }

    enter_letter(letter) {
        let cell = this.current_cell
        cell.innerHTML = letter
        cell.setAttribute("data-animation", "pop")
        cell.setAttribute("data-filled", true)
        if (cell.nextElementSibling != null)
            this.set_current_cell(cell.nextElementSibling)
    }

    remove_letter() {
        let cell = this.current_cell
        let prev_cell = cell.previousElementSibling
        if (prev_cell == null)
            return

        let is_last_cell = (cell.nextElementSibling == null)

        if (is_last_cell && cell.getAttribute("data-filled")) {
            this.empty_cell(cell)
        } else {
            this.empty_cell(prev_cell)
            this.set_current_cell(prev_cell)
        }
    }

    empty_cell(cell) {
        let most_likely = cell.getAttribute("data-most_likely")
        if (most_likely && document.value.board_hint) {
            cell.innerHTML = most_likely
        } else {
            cell.innerHTML = "&nbsp"
        }
        this.set_cell_state(cell, "none")
        cell.removeAttribute("data-filled")
    }

    color_row(row, result, change_keys=true) {
        let cell = row.firstChild
        for (let r of result) {
            this.set_cell_state(cell, r, change_keys)
            cell = cell.nextElementSibling
        }
    }

    display_message(message, time=2000) {
        console.log(message.replaceAll("<br>", "\n"))
        let div = document.getElementById('message')
        div.innerHTML = message

        let messageid = div.getAttribute("data-messageid")
        if (!messageid) {
            messageid = 0 }
        messageid++
        div.setAttribute("data-messageid", messageid)

        setTimeout(() => { div.style['display'] = 'block' }, 100) // Delay to make sure it's not immediately set to none
        setTimeout(() => { 
            if (div.getAttribute("data-messageid") != messageid) {return}
            div.style['display'] = 'none' }, time)
        // setTimeout(() => { div.innerHTML = '&nbsp' }, time)
    }

    word_finished(row) {
        for (let i = 0; i < row.children.length; i++) {
            let cell = row.children[i]
            if (!cell.getAttribute("data-filled")) {
                return false }
        }
        return true
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

    get_state(row, print=true) {
        if (!this.word_finished(row)) {
            if (print) {this.display_message("word not finished")}
            return false
        }

        let result = []
        for (let cell of row.children) {
            result.push(cell.getAttribute('data-state'))
            cell = cell.previousElementSibling
        }      
        return result
    }

    update_keyboard_freq(key_freqs=null, word_count=null) {
        if (!key_freqs || !word_count) {
            for (let key of document.getElementsByClassName("keyboard_btn")) {
                if (key.getAttribute("data-state") != "none" || !ALPHABET.includes(key.innerHTML.replace('-key',''))) {continue}
                key.style["background-color"] = `rgba(128,128,128,1)`
            }
            return
        }
        
        let aggregated_key_freqs = {}
        for (let c of ALPHABET) {
            aggregated_key_freqs[c] = 0
            for (let freq_dict of Object.values(key_freqs)) {
                aggregated_key_freqs[c] += freq_dict[c]
            }
        }
        key_freqs = aggregated_key_freqs

        let filtered_key_freqs = {}
        for (let [c,freq] of Object.entries(key_freqs)) {
            let key = document.getElementById(`${c}-key`)
            if (key.getAttribute("data-state") == "none") {filtered_key_freqs[c] = freq}
        }
        key_freqs = filtered_key_freqs

        let values = Object.values(key_freqs)
        let min = Math.min(...values)
        let inv_range = 1 / (Math.max(...values) - min)

        for (let [c,freq] of Object.entries(key_freqs)) {
            let key = document.getElementById(`${c}-key`)
            // key.style["background-color"] = `rgba(155,140,85,${(freq-min)*inv_range*.9+.1})`
            key.style["background-color"] = `rgba(175,175,175,${(freq-min)*inv_range*.8+.2})`
        }
    }

    update_board_hint(key_freqs=null) {
        let row = this.current_cell.parentElement
        if (!key_freqs) {
            for (let i = 0; i < row.children.length; i++) {
                let cell = row.children[i]
                if (!cell.getAttribute("data-filled")) {
                    cell.innerHTML = '' }
            }
            return
        }

        let maxes = []
        for (let l of Object.keys(key_freqs)) {
            key_freqs[l] = order_dict_by_value(key_freqs[l])
            maxes.push(Object.keys(key_freqs[l])[0])
        }
        for (let i = 0; i < row.children.length; i++) {
            let cell = row.children[i]
            cell.setAttribute("data-most_likely", maxes[i])
            if (!cell.getAttribute("data-filled")) {
                cell.innerHTML = maxes[i] }
        }
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
    word_len = parseInt(urlParams.get("word_len"))
}

let attempts = 6
if (urlParams.has("attempts")) {
    attempts = parseInt(urlParams.get("attempts"))
}

let seed = get_date_string()
if (urlParams.has("seed")) {
    seed = parseInt(urlParams.get("seed"))
}

if (language == "wordle" && word_len != 5) {
    language = "english"
}
let id = load_word_probs(language, word_len)
let key = `${language},${word_len}`
let checkExist = setInterval(function() {
    if (WORD_PROBS[key] && ALLOWED_WORDS[key] && LANG_DICT && AVAILABLE_LENGTHS && CONSTANTS) {
        console.log("Words loaded!");
        clearInterval(checkExist);
        new Game(word_len, attempts, language, false, seed)
    }
}, 10); // check every 10ms
