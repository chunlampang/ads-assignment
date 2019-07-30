module.exports = {
    apiPath: '/students',
    plural: 'Students',
    singular: 'Student',
    fields: {
        _id: {
            type: 'string',
            label: 'Stu ID',
            readonly: 1,
            rules: ['required']
        },
        stuName: {
            type: 'string',
            label: 'Stu Name',
            rules: ['required']
        },
        dOB: {
            type: 'date',
            label: 'Date of Birth',
            rules: ['required']
        }
    }
}