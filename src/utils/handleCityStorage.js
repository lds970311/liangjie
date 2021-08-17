const CURRENT_CITY = "currentCity"

export const getCityInfo = () => {
    return JSON.parse(localStorage.getItem(CURRENT_CITY)
    )
}

export const setCityInfo = (newValue) => {
    localStorage.setItem(CURRENT_CITY, JSON.stringify(newValue))
}