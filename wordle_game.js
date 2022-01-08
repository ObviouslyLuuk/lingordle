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
    constructor(word_len=5, attempts=6, language="english", wordle_words=true) {
        document.value = this

        this.word_len = word_len
        this.attempts = attempts
        this.language = language
        this.wordle_words = wordle_words

        this.word_probs = WORDS_BY_LANG[language]
        this.filtered_word_probs = this.filter_by_len(word_len, this.word_probs)
        this.possibilities = this.get_possibilities(language, word_len, wordle_words)
        this.mystery_word = multinomial_sample(
            Object.keys(this.possibilities), 
            Object.values(this.possibilities)
        )

        this.ui = new UI(word_len, attempts)
        this.solver = new Solver(this.possibilities, this.filtered_word_probs)
        this.update_stats()  
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
        
        this.solver.update_possibilities(guessed_word, result)
        if (this.ui.stats_visible)
            this.update_stats()
    }

    update_stats(stats_visible=true) {
        this.ui.stats_visible = stats_visible
        if (!stats_visible)
            return

        let { word_probs_entries, letters_probs, presence_probs } = this.solver.get_distributions(this.word_len)

        this.ui.fill_word_list(word_probs_entries)
        this.ui.fill_letter_distribution(letters_probs, presence_probs)
        this.solver.score_words(this.filtered_word_probs, letters_probs, presence_probs)
    }

    cell_update() {
        this.solver.reset()

        for (let row of document.querySelectorAll('.board_row')) {
            if (!alphabet.includes(row.firstChild.innerHTML))
                break
            let guessed_word = this.get_guess(row)
            if (!guessed_word)
                break
            let result = this.ui.get_state(row)
            this.solver.update_possibilities(guessed_word, result)
        }
        this.update_stats()
    }

    evaluate_word(mystery_word, guessed_word) {
        let result = []
        for (let i in guessed_word) {
            let c = guessed_word[i]
            let c_true = mystery_word[i]
            if (c == c_true)
                result.push("correct")
            else if (mystery_word.includes(c))
                result.push("present")
            else
                result.push("absent")
        }
        return result
    }

    win_fn() {
        this.ui.display_message("you win!")
        this.ui.current_cell = null
    }
    
    lose_fn() {
        this.ui.display_message("you lose\nThe answer was "+this.mystery_word.toUpperCase())
        this.ui.current_cell = null
    }

    get_guess(row) {
        let guessed_word = this.ui.get_input(row)
        if (!guessed_word)
            return false

        if (!Object.keys(this.filtered_word_probs).includes(guessed_word)) {
            this.ui.display_message("word not in vocabulary")
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

    get_possibilities(language, word_len, wordle_words) {
        if (language == "english" && word_len == 5 && wordle_words) {
            this.possibilities = {}
            for (let word of WORDLE_WORDS)
                this.possibilities[word] = 1
            this.possibilities = normalize_word_probs(this.possibilities)
        } else {
            this.possibilities = this.filtered_word_probs
        }
        return this.possibilities
    }

    reset(word_len=null, language=null, attempts=null) {
        if (!word_len)
            word_len = this.word_len
        if (language)
            this.language = language

        this.word_probs = WORDS_BY_LANG[this.language]
        if (this.word_len != word_len) {
            this.word_len = word_len
            this.filtered_word_probs = this.filter_by_len(word_len, this.word_probs)
        }

        this.possibilities = this.get_possibilities(this.language, word_len, this.wordle_words)
        this.mystery_word = multinomial_sample(
            Object.keys(this.possibilities), 
            Object.values(this.possibilities)
        )
        if (attempts)
            this.attempts = attempts

        this.ui.reset(word_len, this.attempts)
        this.solver = new Solver(this.possibilities, this.filtered_word_probs)
        this.update_stats()
    }
}


class UI {
    constructor(word_len, attempts) {
        this.current_cell = null

        let { screen_left, screen_mid, screen_right } = this.init_game_screen()
        this.init_settings(screen_left)
        this.reset(word_len, attempts)

        this.resize()
        window.addEventListener('resize', this.resize)
        window.addEventListener("keydown", (event) => {document.value.ui.key_down(keydict[event.keyCode])})

        this.stats_visible = false
        this.inference = false
    }

    reset(word_len, attempts) {
        let screen_mid = document.getElementById('game_screen_mid')
        this.init_grid(screen_mid, word_len, attempts)
        this.init_keyboard(screen_mid)
    }

    resize() {
        let game_screen = document.getElementById('game_screen')
        let screen_left = document.getElementById('game_screen_left')
        let screen_mid = document.getElementById('game_screen_mid')
        let screen_right = document.getElementById('game_screen_right')

        screen_left.style['height'] = `${screen_mid.offsetHeight}px`
        if (document.body.offsetHeight > document.body.offsetWidth) {
            screen_left.style.display = "none"
            screen_right.style.display = "none"
            game_screen.style['grid-template-columns'] = "auto"
            screen_mid.style.width = `${document.body.offsetWidth}px`
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

    add_credit_button(parent) {
        let credit = create_and_append('a', parent, null, 'btn')
        credit.innerHTML = "ORIGINAL WORDLE"
        credit.href = 'https://www.powerlanguage.co.uk/wordle/'
        credit.target="_blank"
        credit.rel="noopener noreferrer"
        credit.style.margin = '5px'
    }    

    init_game_screen() {
        let game_screen = create_and_append('div', null, "game_screen")
        let screen_left = create_and_append('div', game_screen, "game_screen_left", "game_screen_division")
        let screen_mid = create_and_append('div', game_screen, "game_screen_mid", "game_screen_division")
        let screen_right = create_and_append('div', game_screen, "game_screen_right", "game_screen_division")
        create_and_append('div', screen_mid, "message")
        this.add_credit_button(screen_mid)

        return { screen_left, screen_mid, screen_right }
    }

    init_grid(parent, word_len, attempts) {
        let old_board = document.getElementById('board')
        if (old_board)
            old_board.parentElement.removeChild(old_board)

        let board = create_and_append('div', parent, id='board')
        let grid_gap = 5
        let inter_column_gaps = (word_len-1)*grid_gap
        let inter_row_gaps = (attempts-1)*grid_gap
        board.style["grid-gap"] = `${grid_gap}px`
        let reference = Math.min(document.body.offsetHeight *.6, document.body.offsetWidth *.8)
        board.style['height'] = `${reference}px`
        board.style['width'] = `${(board.offsetHeight-inter_row_gaps)/attempts*word_len+inter_column_gaps}px`

        for (let row = 0; row < attempts; row++) {
            let row = create_and_append('div', board, null, "board_row")
            row.style["grid-gap"] = `${grid_gap}px`   
            row.style["grid-template-columns"] = `repeat(${word_len}, minmax(0, 1fr))`

            for (let col = 0; col < word_len; col++) {
                let cell = create_and_append('div', row, null, "board_cell")
                cell.innerHTML = "&nbsp"

                cell.setAttribute('data-state', 'none')
                cell.setAttribute('onclick', 'document.value.ui.switch_cell_state(this)')
            }
        }
        board.style['grid-template-rows'] = `repeat(${attempts}, minmax(0, 1fr))`

        this.set_current_row(board.firstChild)
    }

    switch_cell_state(cell) {
        if (!this.inference || !alphabet.includes(cell.innerHTML))
            return

        let order = ["present", "correct", "absent"]
        let new_state = order[0]
        if (cell.dataset.state != 'none') {
            let idx = order.indexOf(cell.dataset.state)
            new_state = order[(idx+1)%order.length]
        }
        this.set_cell_state(cell, new_state)

        document.value.cell_update()
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

    init_settings(parent) {
        let inference_label = create_and_append('label', parent)
        inference_label.innerHTML = 'inference '
        let inference_checkbox = create_and_append('input', inference_label, 'inference_checkbox')
        inference_checkbox.type = "checkbox"
        inference_checkbox.setAttribute('onclick', 'document.value.ui.inference=this.checked; document.value.reset()')

        let reset_btn = create_and_append('div', parent, 'reset_btn', 'btn')
        reset_btn.innerHTML = "Play Again"
        reset_btn.setAttribute('onclick', 'document.value.reset()')

        let cheats_label = create_and_append('label', parent)
        cheats_label.innerHTML = 'cheats '
        let cheats_checkbox = create_and_append('input', cheats_label, 'cheats_checkbox')
        cheats_checkbox.type = "checkbox"
        cheats_checkbox.setAttribute('onclick', 'set_visibility("word_list", this.checked); document.value.update_stats(this.checked)')        
    
        let word_list_div = create_and_append('div', parent, "word_list")
        create_and_append('div', word_list_div, "options_stat")
        let word_list_table_div = create_and_append('div', word_list_div, "word_list_table_div")
        create_and_append('table', word_list_table_div, 'word_list_table')
        word_list_table_div.setAttribute('data-simplebar', "init")
        return word_list_div
    }

    fill_word_list(word_probs_entries) {
        document.getElementById('options_stat').innerHTML = `OPTIONS: ${word_probs_entries.length}`
        let table = document.getElementById('word_list_table')
        empty_element(table)
        for (let [word, prob] of word_probs_entries) {
            let row = create_and_append('tr', table)
            let cell = create_and_append('td', row)
            cell.innerHTML = word
            let cell2 = create_and_append('td', row)
            cell2.innerHTML = `${(prob*100).toFixed(4)}%`
        }
    }

    fill_letter_distribution(letters_probs, presence_probs) {
        let div = document.getElementById('game_screen_right')
        empty_element(div)
        let grid = create_and_append('div', div)
        grid.style.display = 'grid'
        grid.style['grid-template-columns'] = 'auto '.repeat(letters_probs.length+2)
        for (let i in alphabet) {
            for (let pos in letters_probs) {
                let letter = Object.keys(letters_probs[pos])[i]
                let cell = create_and_append('div', grid, null, "distr_cell")
                cell.innerHTML = letter
                let prob = letters_probs[pos][letter]
                let color = `rgba(83, 141, 78,${prob})`
                cell.style['background-color'] = color
            }
            let empty = create_and_append('div', grid, null, "distr_cell")
            empty.innerHTML = "&nbsp"

            let letter = Object.keys(presence_probs)[i]
            let total_cell = create_and_append('div', grid, null, "distr_cell")
            total_cell.innerHTML = letter
            let color = `rgba(181, 159, 59,${presence_probs[letter]})`
            total_cell.style['background-color'] = color
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

    display_message(message) {
        console.log(message)
        let div = document.getElementById('message')
        div.innerHTML = message
        div.style['display'] = 'block'
        setTimeout(() => { div.style['display'] = 'none' }, 2000)
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

class Solver {
    constructor(possibilities) {
        this.initial_possibilities = possibilities
        this.possible_word_probs = possibilities
    }

    word_possible(guessed_word, result, word) {
        for (let i in result) {
            let c = guessed_word[i]

            switch (result[i]) {
                case "correct":
                    if (word[i] != c)
                        return false
                    break;
                case "present":
                    if (!word.includes(c) || word[i] == c)
                        return false
                    break;
                case "absent":
                    if (word.includes(c))
                        return false
                    break;
                default:
                    break;
            }
        }
        return true
    }    

    update_possibilities(guessed_word, result) {
        let new_word_probs = {}
        for (let [word, prob] of Object.entries(this.possible_word_probs)) {
            if (this.word_possible(guessed_word, result, word))
                new_word_probs[word] = prob
        }
        this.possible_word_probs = normalize_word_probs(new_word_probs)
        return this.possible_word_probs
    }    

    get_distributions(word_len) {
        let word_probs_entries = Object.entries(this.possible_word_probs)
        console.log(`options: ${word_probs_entries.length}`)
        let letters_probs = this.get_pos_distribution(word_probs_entries, word_len)
        let presence_probs = this.get_presence_probs(word_probs_entries)
        return { word_probs_entries, letters_probs, presence_probs }
    }

    get_pos_distribution(word_probs_entries, word_len, word_prob_weight=0) {
        let letters_probs = []
        for (let pos = 0; pos < word_len; pos++) {
            let pos_probs = {}
            for (let c of alphabet)
                pos_probs[c] = 0
    
            for (let [word, prob] of word_probs_entries) {
                let letter = word[pos]
                if (!alphabet.includes(letter))
                    continue
                let weight = (1-word_prob_weight) + word_prob_weight*prob
                pos_probs[letter] += weight
            }
            letters_probs.push(normalize_word_probs(order_words_by_value(pos_probs)))
        }
        return letters_probs
    }

    get_presence_probs(word_probs_entries, word_prob_weight=0) {
        let presence_probs = {}
        for (let c of alphabet) {
            presence_probs[c] = 0

            for (let [word, prob] of word_probs_entries) {
                let weight = (1-word_prob_weight) + word_prob_weight*prob
                if (word.includes(c))
                    presence_probs[c] += weight
            }
        }
        for (let c of alphabet) {
            presence_probs[c] /= word_probs_entries.length
        }
        return order_words_by_value(presence_probs)
    }

    discriminative_power(prob) {
        let certainty = Math.abs(1 - prob*2) // Closer to 0 means a more even split
        return 1 - certainty
    }

    score_words(vocab, letters_probs, presence_probs) {
        let vocab_scores = {}
        for (let [word, prob] of Object.entries(vocab)) {
            vocab_scores[word] = 0
            for (let pos in word) {
                vocab_scores[word] += this.discriminative_power(letters_probs[pos][word[pos]])
            }
            for (let c of alphabet) {
                if (!word.includes(c))
                    continue
                vocab_scores[word] += this.discriminative_power(presence_probs[c])
            }
        }
        console.log(order_words_by_value(vocab_scores))
    }

    reset() {
        this.possible_word_probs = this.initial_possibilities
    }
}

let language = "english"
let id = load_word_probs(language)
let checkExist = setInterval(function() {
    if (WORDS_BY_LANG[language]) {
        console.log("Words loaded!");
        clearInterval(checkExist);
        new Game(5, 6, language)
    }
}, 10); // check every 10ms
