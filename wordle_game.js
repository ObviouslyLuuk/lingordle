
const emoji_dict_code = {
    "correct": "\uD83D\uDFE9",
    "present": "\uD83D\uDFE8",
    "absent": "\u2b1b",
}
const emoji_dict = {
    "correct": "🟩",
    "present": "🟨",
    "absent": "⬛",
}

var TWITTER_SHARE_LINK = `https://twitter.com/intent/tweet?text=`

const HTML_DICT = {
    " ": "%20",
    "\n": "%0A",
}

const latin_alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
const greek_alphabet = ['\u03B1', '\u03B2', '\u03B3', '\u03B4', '\u03B5', '\u03B6', '\u03B7', '\u03B8', '\u03D1', '\u03B9', '\u03BA', '\u03BB', '\u03BC', '\u03BD', '\u03BE', '\u03BF', '\u03C0', '\u03D6', '\u03C1', '\u03C2', '\u03C3', '\u03C4', '\u03C5', '\u03C6', '\u03C7', '\u03C8', '\u03C9']
const greek_chars_dict = {"\u03b1": "a", "\u03b2": "b", "\u03b3": "g", "\u03b4": "d", "\u03b5": "e", "\u03b6": "z", "\u03b7": "h", "\u03b8": "u", "\u03b9": "i", "\u03ba": "k", "\u03bb": "l", "\u03bc": "m", "\u03bd": "n", "\u03be": "j", "\u03bf": "o", "\u03c0": "p", "\u03c1": "r", "\u03c3": "s", "\u03c2": "q", "\u03c4": "t", "\u03c5": "y", "\u03c6": "f", "\u03c7": "x", "\u03c8": "c", "\u03c9": "v", "a": "\u03b1", "b": "\u03b2", "g": "\u03b3", "d": "\u03b4", "e": "\u03b5", "z": "\u03b6", "h": "\u03b7", "u": "\u03b8", "i": "\u03b9", "k": "\u03ba", "l": "\u03bb", "m": "\u03bc", "n": "\u03bd", "j": "\u03be", "o": "\u03bf", "p": "\u03c0", "r": "\u03c1", "s": "\u03c3", "q": "\u03c2", "t": "\u03c4", "y": "\u03c5", "f": "\u03c6", "x": "\u03c7", "c": "\u03c8", "v": "\u03c9"}

var alphabet = latin_alphabet

var accent_dict = {
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
    8: "backspace",}
for (let keycode = 65; keycode <= 90; keycode++) {
    keydict[keycode] = alphabet[keycode-65]
}

var keydict_greek = {}
for (let [keycode, char] of Object.entries(keydict)) {
    keydict_greek[keycode] = greek_chars_dict[char] }
keydict_greek[13] = "enter"
keydict_greek[8] = "backspace"

const QUESTION_MARK = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
</svg>`
const BACKSPACE_0 = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace-fill" viewBox="0 0 16 16">
    <path d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z"/>
</svg>`
const BACKSPACE_1 = `
<svg xmlns="http://www.w3.org/2000/svg" height="21" viewBox="0 0 24 24" width="24">
    <path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
</svg>`
const TWITTER_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
</svg>`
const COPY_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>`

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

function mean(array) {
    if (array.length == 0) {return 0}
    return sum_array(array) / array.length
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
        // unfade(element)
    else
        element.style['display'] = 'none'
        // fade(element)
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
    if (results.length < 1) {return null}

    let language = game.language
    let LotD = ""
    let seed_text = `\nseed: ${game.seed}`
    if (game.is_LotD()) {
        LotD = "of the Day"
        seed_text = ""
    }
    let attempts = results.length
    let total_attempts = game.attempts

    let last_row = results[results.length-1]
    if (last_row.includes("present") || last_row.includes("absent")) {attempts = "X"}

    let text = `${language.toTitleCase()} Lingordle ${LotD} ${attempts}/${total_attempts}\n`
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
    if (!text) {return null}
    let link = TWITTER_SHARE_LINK + HTMLify_text(text)
    return link
}

function fade(element) {
    // https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function unfade(element, display="grid") {
    // https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
    var op = 0.1;  // initial opacity
    element.style.opacity = op;
    element.style.display = display;
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
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

Object.defineProperty( String.prototype, 'toTitleCase', {
	value: function (param) {
        return toTitleCase(this.toString())}
})

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

        this.init_stats(attempts)

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
        if (this.language == "greek") {
            mystery_word = remove_accents(mystery_word) }

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
            for (let allowed_guess of Object.keys(this.allowed_guesses)) {
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
            this.word_probs = WORDS_BY_LANG[this.language]
            this.filtered_word_probs = this.filter_by_len(word_len, this.word_probs)
        } else {
            this.seed = parseInt(Math.random()*99999) }

        if (attempts) {
            this.attempts = attempts }
        if (hard_mode != null) {
            this.hard_mode = hard_mode }
        if (seed != null) {
            this.seed = seed }
        
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
        this.ui.display_message(`${this.language.toTitleCase()}<br>total allowed words: ${Object.keys(this.allowed_guesses).length}<br>total mystery words: ${Object.keys(this.mystery_words).length}`, 5000)

        document.getElementById("word_len_input").value = this.word_len
        document.getElementById(this.language+"_option").selected = true
        document.getElementById("hard_mode_checkbox_input").checked = this.hard_mode
        if (this.is_LotD()) {
            document.getElementById("page_header").innerHTML = "LINGORDLE OF THE DAY" }
        else {
            document.getElementById("page_header").innerHTML = "LINGORDLE" }

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
    constructor(word_len, attempts) {
        this.current_cell = null

        this.init_game_screen()
        this.reset(word_len, attempts)
        this.init_overlays()

        window.addEventListener('resize', this.resize)
        window.addEventListener("keydown", (event) => {document.value.ui.keycode_down(event.keyCode)})
    }

    reset(word_len, attempts, lang) {
        let screen_mid_mid = document.getElementById('game_screen_mid_mid')

        this.init_grid(screen_mid_mid, word_len, attempts)
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
            keyboard.style.width = `${keyboard_width}px` }
    }

    keycode_down(keycode) {
        let game = document.value
        let key = keydict[keycode]
        if (game.language == "greek") {
            key = keydict_greek[keycode] }
        game.ui.key_down(key)
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

        let subscript

        let hard_mode_checkbox = create_switch(parent, " hard mode", "hard_mode_checkbox")
        hard_mode_checkbox.setAttribute('onclick', 'document.value.reset(null, null, null, this.checked)')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Revealed letters must be used in subsequent guesses'

        let select = create_and_append("select", parent, "language_select")
        let languages = ["english", "dutch", "spanish", "french", "italian", "german", "greek", "polish"]
        languages.sort()
        languages.push("wordle")
        for (let lang of languages) {
            let option = create_and_append("option", select, lang+"_option")
            option.innerHTML = lang.toTitleCase()
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
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Switch to another language'            

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
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Change word length'        

        let word_otd_btn = create_and_append('div', parent, 'word_otd_btn', 'btn')
        word_otd_btn.innerHTML = "Lingordle of the Day"
        word_otd_btn.setAttribute('onclick', 'document.value.reset(null, null, null, null, get_date_string())')
        subscript = create_and_append("div", parent, null, "subscript")
        subscript.innerHTML = 'Switch back to the Lingordle of the Day'        
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
        board = this.build_grid(parent, null, word.length, 1, 5, null, Math.min(cell_width*word.length, document.body.offsetWidth*.7))
        board.style.margin = "5px"
        row = board.firstChild
        for (let i in word) {
            let cell = row.children[i]
            cell.innerHTML = word[i]
        }
        this.color_row(row, Array(word.length).fill("correct"), false) 

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
        let win_rate = create_and_append("div", parent, "win_rate")
        win_rate.innerHTML = `Wins: ${(mean(game.win_list)*100).toFixed(0)}%`

        let guess_distribution = game.guess_distribution
        let guess_bars_title = create_and_append("h2", parent, null, "title")
        guess_bars_title.innerHTML = "Guess Distribution"
        this.init_guess_bars(parent, guess_distribution)

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

    update_win_screen(won) {
        let message
        let game = document.value
        if (won) {
            message = "You Won!"
        } else {
            message = `Too bad :(<br>the word was '${game.mystery_word.toUpperCase()}'`
        }
        let title = document.getElementById("win_title")
        title.innerHTML = message
        // this.display_message(message, 10000)

        document.getElementById("win_rate").innerHTML = `Wins: ${(mean(game.win_list)*100).toFixed(0)}%`
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

        setTimeout(() => { 
            // set_visibility("win_overlay", true)
            unfade(document.getElementById("win_overlay"))
        }, 100)
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
            "help_overlay": {div: help_overlay, btn_id: "help_btn"},
            "win_overlay": {div: win_overlay, btn_id: "game_screen_mid_bott"},
            "form_overlay": {div: form_overlay, btn_id: "message"},
            "settings_overlay": {div: settings_overlay, btn_id: "settings_btn"},
            "message": {div: document.getElementById("message"), btn_id: "message"}
        }

        // Close overlay when clicking elsewhere
        for (let [id, {div, btn_id}] of Object.entries(overlays)) {
            window.addEventListener('click', (e) => {
                if (e.path.includes(div) || e.path.includes(document.getElementById(btn_id))) {return}
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

        let settings_btn = create_and_append('div', screen_mid_right, 'settings_btn', 'butn')
        create_and_append("span", settings_btn, null, "glyphicon glyphicon-cog")
        settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", true)')

        let help_btn = create_and_append('div', screen_mid_right, 'help_btn', 'butn')
        help_btn.innerHTML = QUESTION_MARK
        help_btn.setAttribute('onclick', 'set_visibility("help_overlay", true)')
    }

    init_grid(parent, word_len, attempts) {
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

        let board = this.build_grid(parent, "board", word_len, attempts, grid_gap, height, width)

        this.set_current_row(board.firstChild)
    }

    build_grid(parent, id, word_len, attempts, grid_gap, height=null, width=null) {
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

            for (let col = 0; col < word_len; col++) {
                let cell = create_and_append('div', row, null, "board_cell")
                cell.innerHTML = "&nbsp"

                cell.setAttribute('data-state', 'none')
                cell.setAttribute("onanimationend", 'this.setAttribute("data-animation", "none")')
                // cell.setAttribute('onclick', 'document.value.ui.switch_cell_state(this)')
            }
        }
        board.style['grid-template-rows'] = `repeat(${attempts}, minmax(0, 1fr))`

        return board
    }

    set_cell_state(cell, state, change_keys) {
        cell.setAttribute('data-state', state)
        if (change_keys && !this.inference && alphabet.includes(cell.innerHTML)) {
            let key = document.getElementById(`${cell.innerHTML}-key`)
            if      (key.getAttribute("data-state") != "correct" &&
                   !(key.getAttribute("data-state") == "present" && state == "absent"))
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

        let middle_row = 1
        let rows = [
                   "q,w,e,r,t,y,u,i,o,p", 
                    "a,s,d,f,g,h,j,k,l", 
                "z,x,c,v,b,n,m,backspace",
                "enter",]
        if (lang == "greek") {
            rows = [
            "&#949,&#961,&#964,&#965,&#952,&#953,&#959,&#960", // removed &#962
            "&#945,&#963,&#948,&#966,&#947,&#951,&#958,&#954,&#955",
            "&#950,&#967,&#968,&#969,&#946,&#957,&#956,backspace",
            "enter",]
        } else if (lang == "dutch") {
            rows[middle_row] += ",&#307"
        } else if (lang == "french") {
            rows[middle_row] += ",&#230,&#339"
        } else if (lang == "german") {
            rows[middle_row] += ",&#223"
        } else if (lang == "polish") {
            rows[middle_row] += ",&#322"
        }
        let keyboard = create_and_append('div', parent, id="keyboard")
        
        for (let i in rows) {
            let keys = rows[i]
            let row = create_and_append('div', keyboard, null, "keyboard_row")
            if (i == middle_row)
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
                } else if (key == "backspace") {
                    btn.innerHTML = BACKSPACE_1
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
        cell.setAttribute("data-animation", "pop")
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

    get_state(row, print=true) {
        if (!this.word_finished(row)) {
            if (print) {this.display_message("word not finished")}
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