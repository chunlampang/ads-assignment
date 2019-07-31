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
            view: ['list', 'edit']
        },
        title: {
            type: 'string',
            label: 'Title',
            rules: ['required'],
            view: ['list', 'edit']
        },
        level: {
            type: 'number',
            label: 'Level',
            rules: ['required', 'integer'],
            view: ['list', 'edit']
        }
    }
}