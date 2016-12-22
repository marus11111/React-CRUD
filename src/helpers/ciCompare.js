//case insensitive comparison of strings

export default (...args) => {
    for (let i=0; i<args.length-1; i++) {
        if (args[i].toUpperCase() === args[i+1].toUpperCase()) continue;
        else return false;
    }
    return true;
}