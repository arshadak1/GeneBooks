export const ENDPOINT = window.location.origin
export const API_ENDPOINT = `${ENDPOINT}/api/`

export const TODAY = new Date()

const MONTHS = {
    1: 'Jan.',
    2: 'Feb.',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'Aug.',
    9: 'Sept.',
    10: 'Oct.',
    11: 'Nov.',
    12: 'Dec.'
}

function setAttributes(el, options) {
    Object.keys(options).forEach(function (attr) {
        el.setAttribute(attr, options[attr]);
    })
}


const elementCreation = (element, classes = [], attributes = {}, inner_text = '', inner_html = '') => {
    let new_element = document.createElement(element)
    new_element.classList.add(...classes)
    setAttributes(new_element, attributes)
    new_element.innerText = inner_text
    if (inner_html !== '') {
        new_element.innerHTML = inner_html
    }
    return new_element
}

export const letterSpaceValidation = (str) => {
    return /^[A-Za-z\s]*$/.test(str)
}

export const getCsrf = () => {
    var inputs = document.querySelectorAll('input')
    var csrf_token = ''
    for (let i = 0; i < inputs.length; ++i) {
        if (inputs[i].name === 'csrfmiddlewaretoken') {
            csrf_token = inputs[i].value
            break;
        }
    }
    return csrf_token
}

const createCard = (card_details) => {

    const col_div = elementCreation('div', ['col'])

    const card_div = elementCreation('div', ['card', 'h-100', 'border-top', 'border-0', 'shadow-sm', 'border-success'])
    const card_body_div = elementCreation('div', ['card-body'])

    const h5 = elementCreation('h5', ['card-title'], {}, card_details.heading)
    const p = elementCreation('p', ['card-text'], {}, '', card_details.detail)
    
    card_body_div.append(h5, p)
    card_div.appendChild(card_body_div)
    col_div.appendChild(card_div)

    return col_div
}

export const setCardDetails = (card_details) => {
    const card_div = document.getElementById('card-div')
    if (card_div) {
        const parent = card_div.parentNode
        parent.removeChild(card_div)
    }

    // row-cols-md-2 row-cols-lg-3 row-cols-xxl-4

    const new_card_div = elementCreation('div', ['row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-3', 'row-cols-xxl-4', 'g-4', 'mt-4'], { 'id': 'card-div' })


    card_details.forEach(detail => {
        let card = createCard(detail)
        new_card_div.appendChild(card)

    })

    document.getElementById('cards').appendChild(new_card_div)
}

export const toCSV = (url, download_url) => {
    const endpoint = `${ENDPOINT}/${url}/`
    const request = new XMLHttpRequest()

    request.open('GET', `${endpoint}`, true)
    request.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type")

    const csv_alert = document.getElementById('csv-alerts')


    request.addEventListener('readystatechange', () => {
        if (request.readyState == 4 && request.status == 200) {
            let message = ''
            let response = JSON.parse(request.responseText)
            if (response.converted) {
                csv_alert.classList.add('alert-success')
                csv_alert.classList.remove('alert-danger', 'd-none')
                message = `<strong>Success! </strong><a href="/${download_url}" class="text-primary text-decoration-none">Click here</a> if you wish to download the csv file.`
            }
            else {
                csv_alert.classList.add('alert-danger')
                csv_alert.classList.remove('alert-success', 'd-none')
                message = '<strong>Failed! </strong> Something went wrong! Try again!'
            }
            // setCardDetails(JSON.parse(request.responseText))
            csv_alert.querySelector('span').innerHTML = message


        }
    })

    request.send()
}

export const getFormattedDate = (date) => {
    // 1986-09-15 -> Sept. 15, 1986 
    let date_arr = date.split('-')
    return `${MONTHS[Number(date_arr[1])]} ${Number(date_arr[2])}, ${date_arr[0]}`
}