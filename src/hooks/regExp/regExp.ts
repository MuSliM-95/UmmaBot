
 const rgx = (str: string): string[] | undefined => {
  
    if (str === undefined) {
        return undefined
    }
    const match = str.split(/[, ]+/)
    const result = match.map(e => {
        return e.split("").map((el, index) => {
            return el = index === 0 ? el.toUpperCase() : el
        }).join("")

    })

    if (result) {
        return result
    } else {
        return []
    }

}

export default rgx