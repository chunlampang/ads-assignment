module.exports = {
    collection: 'students',
    icon: 'mdi-account-multiple',
    plural: 'Students',
    singular: 'Student',
    fields: {
        _id: {
            type: 'string',
            label: 'Stu ID',
            readonly: 1,
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        stuName: {
            type: 'string',
            label: 'Stu Name',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        dOB: {
            type: 'date',
            label: 'Date of Birth',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        }
    },
    desc: {
        key: '_id',
        label: 'stuName'
    },
    refs: {
        enrolled: {
            label: 'Enrolled',
            entity: 'offer',
            field: 'enrolled.student'
        }
    }
}