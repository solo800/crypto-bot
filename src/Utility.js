class Utility {
    constructor () {
        this.getType = this.getType.bind(this);
        this.checkType = this.checkType.bind(this);
        this.checkTypeFull = this.checkTypeFull.bind(this);
        this.parseJSON = this.parseJSON.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    // Type, return the type of the passed in object
    getType (arg) {
        return Object.prototype.toString.call(arg);
    }

    // Check Type, return true or false if the type string passed in is similar to the type of the passed in object
    checkType (arg, type) {
        if ('[object String]' !== this.getType(type)) {
            return false;
        }

        // slice(8) removes "[object " from the type string
        return -1 < this.getType(arg).slice(8).toLowerCase().indexOf(type.toLowerCase());
    }

    checkTypeFull (arg, type) {
        if ('[object String]' !== this.getType(type)) {
            return false;
        }

        return this.getType(arg) === type || this.getType(arg).toLowerCase() === type.toLowerCase();
    }

    // Date helpers
    formatDate (format, dateObj) {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const twoDigitMonth = 10 > parseInt(month) ? `0${month}` : month;
        const date = dateObj.getDate();
        const twoDigitDate = 10 > parseInt(date) ? `0${date}` : date;

        switch (format) {
            case 'yyyy/mm/dd':
                return `${year}/${twoDigitMonth}/${twoDigitDate}`;
                break;
            case 'yyyy-mm-dd':
                return `${year}-${twoDigitMonth}-${twoDigitDate}`;
                break;
        }
    }

    // Parse JSON or return an empty object
    parseJSON (str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.warn('error parsing json', e);
            return {};
        }
    };
}

module.exports = Utility;