module.exports = {
    collection: 'courses',
    plural: 'Courses',
    singular: 'Course',
    fields: {
        _id: {
            type: 'string',
            label: 'Course ID',
            readonly: 1,
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        title: {
            type: 'string',
            label: 'Title',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        level: {
            type: 'number',
            label: 'Level',
            rules: ['required', 'integer', 'positive'],
            view: ['filter', 'list', 'edit']
        }
    },
    desc: {
        key: '_id',
        label: 'title'
    }
}