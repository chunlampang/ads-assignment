module.exports = {
    fields: {
        courseId: {
            type: 'string',
            label: 'Course ID',
            rules: ['required'],
            view: ['list', 'edit', 'title']
        },
        title: {
            type: 'string',
            label: 'Title',
            rules: ['required'],
            view: ['list', 'edit', 'title']
        },
        level: {
            type: 'number',
            label: 'Level',
            rules: ['required', 'integer', 'positive'],
            view: ['list', 'edit']
        }
    },
    desc: {
        key: 'courseId',
        label: 'title'
    }
}