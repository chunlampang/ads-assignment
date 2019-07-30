module.exports = {
    apiPath: '/courses',
    plural: 'Courses',
    singular: 'Course',
    fields: {
        _id: {
            type: 'string',
            label: 'Course ID',
            readonly: 1,
            rules: ['required']
        },
        title: {
            type: 'string',
            label: 'Title',
            rules: ['required']
        },
        level: {
            type: 'number',
            label: 'Level',
            rules: ['required', 'integer',]
        }
    }
}