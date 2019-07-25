import moment from 'moment';

export const datetimeFormat = 'YYYY/MM/DD HH:mm:ss';
export const dateFormat = 'YYYY/MM/DD';

export default {
    install(Vue, options) {
        Vue.prototype.$utils = this;
    },
    downloadFile(filename, data) {
        var blob = new Blob([data]);
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = window.URL || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);

            var elem = window.document.createElement('a');
            elem.href = downloadUrl;
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    },
    getItemById(itemList, id, idName = 'id') {
        for (let item of itemList) {
            if (item[idName] === id)
                return item;
        }
        return null;
    },
    getVarByDotNotation(obj, str) {
        return str.split('.').reduce((o, i) => o[i], obj);
    },
    datetimeToString(date) {
        if (!date)
            return "";
        return moment(date).format(datetimeFormat);
    },
    stringToDatetime(dateString) {
        if (!dateString)
            return null;
        return moment(dateString, datetimeFormat).toDate();
    },
    dateToString(date) {
        return moment(date).format(dateFormat);
    },
    stringToDate(dateString) {
        if (!dateString)
            return null;
        return moment(dateString, dateFormat).toDate();
    },
}