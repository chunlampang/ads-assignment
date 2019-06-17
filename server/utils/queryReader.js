/**
 * @param {Object} query {fields, sort, page}
 * @returns {Object} {projection, sort, skip, limit}
 */
exports.appendOptions = function (cursor, query = {}) {
    let { fields, page, sort } = query;

    if (fields) {
        const projectOptions = {};
        for (let field of this.parseArray('fields', fields)) {
            projectOptions[field] = true;
        }
        cursor.project(projectOptions);
    }
    //paging
    if (page && page.size) {
        let size = this.parseInteger('page.size', page.size);
        if (size) {
            let number = parseInt(page.number) || 1;
            cursor.skip((number - 1) * size)
                .limit(size);
        }
    }
    //sorting
    if (sort) {
        const sortOptions = [];
        for (let field of this.parseArray('sort', sort)) {
            if (!field)
                continue;

            let asc;
            if (field[0] === '-') {
                asc = -1;//desc
                field = field.substr(1);
            } else
                asc = 1;//asc

            sortOptions.push([field, asc]);
        }
        cursor.sort(sortOptions);
    }

    return cursor;
}

exports.parseArray = function (title, val) {
    if (Array.isArray(val))
        return val;
    if (typeof val === 'string')
        return val.split(',');
    throw new Error(title + ' mush be an Array or String.');
}

exports.parseInteger = function (title, val) {
    let num = Number(val);
    if(Number.isInteger(num))
        return num;
    throw new Error(title + ' mush be an Integer.');
}
