import { API_ENDPOINT, toCSV, letterSpaceValidation, getCsrf, setCardDetails } from "./index.js"



const add_author_btn = document.getElementById('add-author')

const author_search_btn = document.getElementById('author-search-btn')
const author_search_field = document.getElementById('author-field')

const age_filter_btn = document.getElementById('age-filter-btn')
const age_filter_min_input = document.getElementById('age-filter-min-input')
const age_filter_max_input = document.getElementById('age-filter-max-input')

const genders = document.querySelectorAll('.gender')
const female_checkbox = document.getElementById('female-checkbox')
const male_checkbox = document.getElementById('male-checkbox')
const others_checkbox = document.getElementById('others-checkbox')



// author popup for inputs
const author_name = document.getElementById('author-name-input')
const author_age = document.getElementById('author-age-input')
const author_gender = document.getElementById('author-gender-input')
const author_country = document.getElementById('author-country-input')


// csv 
const authors_to_csv_btn = document.getElementById('authors-to-csv')
const csv_alert = document.getElementById('csv-alerts')


/*
Age: {{ author.age }} yr
<br />
Gender: {{ author.gender }}
<br />
Country: {{ author.country }} */
const setAuthorData = (author_details) => {
    author_details.forEach(author => {
        author.heading = author.name
        author.detail = `Age: ${author.age} yr <br>Gender: ${author.gender}<br>Country: ${author.country}`
    })
    setCardDetails(author_details)
}
const makeValid = () => {
    author_age.value = ''
    author_name.value = ''
    author_country.value = ''
    author_name.classList.remove('is-invalid')
    author_age.classList.remove('is-invalid')
    author_country.classList.remove('is-invalid')
}


const validateAuthorData = (name, age, country) => {
    let error = {}
    error.hasError = false

    if (name == '') {
        error.name = 'This field is required'
        error.hasError = true
    }
    else if (!letterSpaceValidation(name)) {
        error.name = 'Only alphabets are allowed'
        error.hasError = true
    }

    if (age == '') {
        error.age = 'This field is required'
        error.hasError = true
    }

    else if (isNaN(age) || Number(age) <= 0 || !Number.isInteger(Number(age))) {
        error.age = 'Enter a valid age'
        error.hasError = true
    }

    if (!letterSpaceValidation(country)) {
        error.name = 'Only alphabets are allowed'
        error.hasError = true
    }

    return error
}


const submitAuthorDetails = (e) => {
    e.preventDefault()

    const error = validateAuthorData(author_name.value.trim(), author_age.value.trim(), author_country.value.trim())
    if (error.hasError) {
        if (error.name) {
            const author_name_msg = document.getElementById('author-name-msg')
            author_name.classList.add('is-invalid')
            author_name_msg.innerText = error.name
        }

        if (error.age) {
            const author_age_msg = document.getElementById('author-age-msg')
            author_age.classList.add('is-invalid')
            author_age_msg.innerText = error.age
        }
        if (error.country) {
            const author_country_msg = document.getElementById('author-country-msg')
            author_country.classList.add('is-invalid')
            author_country_msg.innerText = error.country
        }
    }

    else {
        const csrf = getCsrf()

        const endpoint = `${API_ENDPOINT}create/author/`
        const request = new XMLHttpRequest()
        const params = { "name": author_name.value.trim(), "age": Number(author_age.value.trim()), "gender": author_gender.value, "country": author_country.value.trim() }


        request.open('POST', endpoint, true)
        // setting neccesary headers
        request.setRequestHeader('Content-type', 'application/json')
        request.setRequestHeader('X-CSRFToken', csrf)

        request.addEventListener('readystatechange', () => {
            if (request.readyState == 4) {
                if (request.status == 201) {
                    const success_msg = document.getElementById('author-success-msg')
                    makeValid()
                    getAuthors()
                    success_msg.classList.remove('hidden')
                    setTimeout(() => { success_msg.classList.add('hidden') }, 5000)
                }
                else {
                    const danger_msg = document.getElementById('author-danger-msg')

                    danger_msg.classList.remove('hidden')
                    setTimeout(() => { danger_msg.classList.add('hidden') }, 5000)
                }
            }
        })
        request.send(JSON.stringify(params))


    }

}


const getAuthors = () => {
    const csrf = getCsrf()

    const endpoint = `${API_ENDPOINT, ENDPOINT}authors/`
    const request = new XMLHttpRequest()
    const selected_gender = {male: male_checkbox.checked, female: female_checkbox.checked, others: others_checkbox.checked}
    const params = {author: author_search_field.value.trim(), min_age: age_filter_min_input.value.trim(), max_age: age_filter_max_input.value.trim(), gender: selected_gender}

    request.open('GET', `${endpoint}?params=${JSON.stringify(params)}`, true)

    request.addEventListener('readystatechange', () => {
        if (request.readyState == 4 && request.status == 200) {
            setAuthorData(JSON.parse(request.responseText))
            // setCardDetails(JSON.parse(request.responseText))

        }
    })

    request.send()
}

// event listeners
add_author_btn.addEventListener('click', submitAuthorDetails)

author_search_btn.addEventListener('click', getAuthors)

age_filter_btn.addEventListener('click', getAuthors)

genders.forEach(gender => {
    gender.addEventListener('change', getAuthors)
})


csv_alert.querySelector('button').addEventListener('click', () => {
    csv_alert.classList.add('d-none')
})

authors_to_csv_btn.addEventListener('click', () => toCSV('authors-csv', 'authors-csv-download'))
// getAuthors()