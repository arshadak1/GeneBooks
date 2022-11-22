import { TODAY, API_ENDPOINT, toCSV, getCsrf, setCardDetails, getFormattedDate } from "./index.js"
// ___________________________________________________________
// add book form datas and btn
const add_book_btn = document.getElementById('add-book')

const book_name = document.getElementById('book-name-input')
const book_name_msg = document.getElementById('book-name-msg')

const book_author = document.getElementById('book-author-input')
const book_author_msg = document.getElementById('book-author-msg')

const book_dop = document.getElementById('book-dop-input')
const book_dop_msg = document.getElementById('book-dop-msg')

const book_pages = document.getElementById('book-pages-input')
const book_pages_msg = document.getElementById('book-pages-msg')

const book_rating = document.getElementById('book-rating-input')
const book_rating_msg = document.getElementById('book-rating-msg')

// ___________________________________________________________

// CSV
const book_to_csv = document.getElementById('book-to-csv')
const csv_alert = document.getElementById('csv-alerts')

// ___________________________________________________________
// book search and filter data
const book_search_field = document.getElementById('book-search-field')
const book_search_btn = document.getElementById('book-search-btn')

// filters
const publish_year_from_filter = document.getElementById('publish-year-from-filter')
const publish_year_upto_filter = document.getElementById('publish-year-upto-filter')
const year_filter_btn = document.getElementById('year-filter-btn')

const min_page_filter = document.getElementById('min-page-filter')
const max_page_filter = document.getElementById('max-page-filter')
const page_filter_btn = document.getElementById('page-filter-btn')

const book_rating_filter = document.getElementById('book-rating-filter')

const clear_filters = document.getElementById('clear-filters')


// -----------------------------------------------------------

// ___________________________________________________________
// helper functions

const validateBookData = (name, author, dop, pages) => {
    let error = {}
    error.hasError = false

    if (name == '') {
        error.name = 'This field is required!'
        error.hasError = true
    }


    if (author == '--select-author') {
        error.author = 'Please select the author!'
        error.hasError = true
    }

    if (dop > TODAY) {
        error.dop = 'Enter a valid date'
        error.hasError = true
    }

    if (isNaN(pages) || Number(pages) <= 0 || !Number.isInteger(Number(pages))) {
        error.pages = 'Enter valid number of pages'
        error.hasError = true
    }

    return error
}

const setBookData = (book_details) => {

    book_details.forEach(book => {
        book.heading = book.name
        book.date_of_publishing = getFormattedDate(book.date_of_publishing)
        book.detail = `<i>by </i> ${book.author_name}<br />Number of pages: ${book.number_of_pages}<br>Published: ${book.date_of_publishing}<br />Rating: ${book.average_critics_rating}`
    })
    setCardDetails(book_details)
}

const makeValid = () => {
    book_author.value = '--select-author'
    book_name.value = ''
    book_dop.value = ''
    book_pages.value = ''
    book_rating.value = ''

    book_author.classList.remove('is-invalid')
    book_dop.classList.remove('is-invalid')
    book_name.classList.remove('is-invalid')
    book_pages.classList.remove('is-invalid')

    
    document.getElementById("current-book-rating").innerText = '5'

    book_rating_filter.value = '0'
    changeRatingText('book-rating-filter-span', book_rating_filter)

}


// ___________________________________________________________
// event listener callback functions

const getBooks = () => {

    const endpoint = `${API_ENDPOINT}books/`
    const request = new XMLHttpRequest()

    // const selected_gender = {male: male_checkbox.checked, female: female_checkbox.checked, others: others_checkbox.checked}
    const params = {
        book_name: book_search_field.value.trim(),
        from_year: publish_year_from_filter.value.trim(),
        upto_year: publish_year_upto_filter.value.trim(),
        min_page: min_page_filter.value.trim(),
        max_page: max_page_filter.value.trim(),
        rating: book_rating_filter.value.trim()
    }
    
    request.open('GET', `${endpoint}?params=${JSON.stringify(params)}`, true)
    
    request.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type")

    request.addEventListener('readystatechange', () => {
        if (request.readyState == 4 && request.status == 200) {
            setBookData(JSON.parse(request.responseText))
            // setCardDetails(JSON.parse(request.responseText))

        }
    })

    request.send()

}

const submitBookDetails = (e) => {
    e.preventDefault()
    const data = {name:book_name.value.trim(), author: book_author.value.trim(), dop: book_dop.value.trim(), pages: book_pages.value.trim(), rating: book_rating.value}

    const error = validateBookData(data.name, data.author, data.dop, data.pages)
    if (error.hasError) {
        if (error.name) {
            book_name.classList.add('is-invalid')
            book_name_msg.innerText = error.name
        }

        if (error.pages) {
            book_pages.classList.add('is-invalid')
            book_pages_msg.innerText = error.pages
        }
        if (error.dop) {
            book_dop.classList.add('is-invalid')
            book_dop_msg.innerText = error.dop
        }
        if (error.pages) {
            book_pages.classList.add('is-invalid')
            book_pages_msg.innerText = error.pages
        }
    }

    else {
        const csrf = getCsrf()

        const endpoint = `${API_ENDPOINT}create/book/`
        const request = new XMLHttpRequest()
        const params = { "name": data.name, "author": Number(data.author), "date_of_publishing": data.dop, "number_of_pages": Number(data.pages), "average_critics_rating": Number(data.rating)}


        request.open('POST', endpoint, true)
        // setting neccesary headers
        request.setRequestHeader('Content-type', 'application/json')
        request.setRequestHeader('X-CSRFToken', csrf)
        request.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type")

        request.addEventListener('readystatechange', () => {
            if (request.readyState == 4) {
                if (request.status == 201) {
                    const success_msg = document.getElementById('book-success-msg')
                    makeValid()
                    getBooks()
                    changeRatingText()

                    success_msg.classList.remove('hidden')
                    setTimeout(() => { success_msg.classList.add('hidden') }, 5000)
                }
                else {

                    const danger_msg = document.getElementById('book-danger-msg')

                    danger_msg.classList.remove('hidden')
                    setTimeout(() => { danger_msg.classList.add('hidden') }, 5000)
                }
            }
        })
        request.send(JSON.stringify(params))


    }

}

const changeRatingText = ( id, target) => {
    const curr_rating = document.getElementById(id)
    if(target && curr_rating) {
    curr_rating.innerText = target.value
    }
}

const resetFilters = () => {
    publish_year_from_filter.value = ''
    publish_year_upto_filter.value = ''
    min_page_filter.value = ''
    max_page_filter.value = ''
    book_rating_filter.value = ''
    getBooks()
}

// ___________________________________________________________

// ___________________________________________________________
// event listeners

add_book_btn.addEventListener('click', submitBookDetails)

book_rating.addEventListener('input', (e) => {
    changeRatingText("current-book-rating", book_rating)
})

book_search_field.addEventListener('input', getBooks)


// filter event listeners
book_rating_filter.addEventListener('input', (e) => {
    changeRatingText('book-rating-filter-span', book_rating_filter)
    getBooks()
})
year_filter_btn.addEventListener('click', getBooks)
page_filter_btn.addEventListener('click', getBooks)

book_to_csv.addEventListener('click', () => toCSV('books-csv', 'books-csv-download'))
csv_alert.querySelector('button').addEventListener('click', () => {
    csv_alert.classList.add('d-none')
})

clear_filters.addEventListener('click', resetFilters)

// ___________________________________________________________

