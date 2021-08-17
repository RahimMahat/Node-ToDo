module.exports.getDate = () => {
    let d = new Date();
    options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };
    let day = d.toLocaleDateString('en-US', options);
    return day;
}

module.exports.getDay = () => {
    let d = new Date();
    options = {
        weekday: 'long',
    };
    let day = d.toLocaleDateString('en-US', options);
    return day;
}