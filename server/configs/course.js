module.exports = {
    fields: {
        courseId: {
            type: 'string',
            label: 'Course ID',
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
        key: 'courseId',
        label: 'title'
    }
}