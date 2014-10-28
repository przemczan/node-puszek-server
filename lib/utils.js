module.exports = {
    arrayUnique: function(_array) {
        var o = {}, i, l = _array.length, r = [];
        for (i = 0; i < l; i += 1) o[_array[i]] = _array[i];
        for (i in o) r.push(o[i]);
        return r;
    }
};