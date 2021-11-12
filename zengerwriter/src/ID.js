
function CreateID() {

    // Create ID from date
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    }
    return (Math.floor(Date.now() / 1000));

}

function PreciseID() {

    // Create ID from date (ms instead of s, to make it difficult to have the same ID between two items)
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    }
    return (Math.floor(Date.now()));

}

function RandomID() {

    return Math.random();

}

export { CreateID, PreciseID, RandomID }
