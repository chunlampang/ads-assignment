exports.aggregateStringOptions = async function (collection, filter, query) {
    let field = this.parseString('field', query.field);
    let size = this.parsePositiveInteger('size', query.size);

    let options = [
        { $match: filter },
        {
            $group: {
                _id: null,
                value: { $addToSet: "$" + field }
            }
        },
        { $unwind: '$value' },
        { $sort: { value: 1 } },
        { $limit: size }
    ];

    let result = await collection.aggregate(options).toArray();
    for (let item of result) {
        delete item._id;
    }
    return {
        data: result
    };
};

exports.aggregateList = async function (collection, options = [], query = {}) {
    let { fields, page, sort } = query;

    if (fields) {
        const projectOptions = {};
        for (let field of this.parseArray('fields', fields)) {
            projectOptions[field] = true;
        }
        options.push({
            $project: projectOptions
        });
    }

    //sorting
    if (sort) {
        const sortOptions = {};
        for (let field of this.parseArray('sort', sort)) {
            if (!field)
                continue;

            let asc;
            if (field[0] === '-') {
                asc = -1;//desc
                field = field.substr(1);
            } else
                asc = 1;//asc

            sortOptions[field] = asc;
        }

        options.push({
            $sort: sortOptions
        });
    }


    options.push({
        $group: {
            _id: null,
            total: { $sum: 1 },
            data: { $push: '$$ROOT' }
        }
    });

    //paging
    if (page && page.size) {
        let size = this.parsePositiveInteger('page.size', page.size);
        if (size) {
            let number = parseInt(page.number) || 1;
            options.push({
                $project: {
                    total: 1,
                    data: {
                        $slice: ['$data', (number - 1) * size, size]
                    }
                }
            });
        }
    }

    let result = await collection.aggregate(options).toArray();
    if (result.length === 0) {
        return {
            meta: { total: 0 },
            data: []
        };
    }
    return {
        meta: { total: result[0].total },
        data: result[0].data
    };
}

exports.parseString = function (title, val) {
    if (typeof val === 'string')
        return val;
    throw new Error(title + ' mush be a String.');
}

exports.parseArray = function (title, val) {
    if (Array.isArray(val))
        return val;
    if (typeof val === 'string')
        return val.split(',').map(item => item.trim());
    throw new Error(title + ' mush be an Array or Comma-Separated String.');
}

exports.parseDate = function (title, val) {
    let date = new Date(val);
    if (!isNaN(date))
        return date;
    throw new Error(title + ' mush be a Date.');
}

exports.parseNumber = function (title, val) {
    let num = Number(val);
    if (!isNaN(num))
        return num;
    throw new Error(title + ' mush be a Number.');
}

exports.parseInteger = function (title, val) {
    let num = Number(val);
    if (Number.isInteger(num))
        return num;
    throw new Error(title + ' mush be an Integer.');
}

exports.parsePositiveInteger = function (title, val) {
    let num = Number(val);
    if (Number.isInteger(num) && num >= 0)
        return num;
    throw new Error(title + ' mush be a Positive Integer.');
}