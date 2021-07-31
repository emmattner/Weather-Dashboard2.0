var APIKey = "999765913b2b7cf6debaba7129671cd8";

const k2c_temp = (k) => Math.round(k - 273.15);
const mps2kts = (mps) => Math.round(mps * 1.94384);
const dt2date = function (dt) {
    let d = new Date(dt * 1000)
    const months =  ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`
}

