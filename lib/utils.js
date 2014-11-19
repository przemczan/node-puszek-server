module.exports = {
    /**
     *
     * @param _array
     * @returns {Array}
     */
    arrayUnique: function(_array) {
        var o = {}, i, l = _array.length, r = [];
        for (i = 0; i < l; i += 1) o[_array[i]] = _array[i];
        for (i in o) r.push(o[i]);
        return r;
    },

    /**
     *
     * @param _path
     */
    parseUrlPath: function(_path) {
        _path = _path.replace(/^[\/ ]+|[\/ ]+$/g, '');

        var result = {
                segments: _path.split('/'),
                named: {}
            },
            segment;

        for (var i in result.segments) {
            segment = result.segments[i].split(':', 2);
            if (segment.length > 1) {
                result.named[segment[0]] = segment[1];
            }
        }

        return result;
    },

    /**
     *
     * @param _array
     * @param _callback
     */
    each: function(_array, _callback) {
        for (key in _array) {
            if (_array.hasOwnProperty(key) && /^0$|^[1-9]\d*$/.test(key) && key <= 4294967294) {
                _callback(_array[key], key);
            }
        }
    }
};
