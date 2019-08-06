module.exports = {
    collection: 'offers',
    icon: 'mdi-account-check-outline',
    plural: 'Offers',
    singular: 'Offer',
    fields: {
        department: {
            type: 'entity',
            entity: 'department',
            label: 'Department',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        course: {
            type: 'entity',
            entity: 'course',
            label: 'Course',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        year: {
            type: 'number',
            label: 'Year',
            rules: ['required', 'integer', 'positive'],
            view: ['filter', 'list', 'edit']
        },
        classSize: {
            type: 'number',
            label: 'Class Size',
            rules: ['required', 'integer', 'positive'],
            view: ['filter', 'list', 'edit']
        },
        enrolledCount: {
            type: 'number',
            label: 'Enrolled Count',
            readonly: 2,
            cal: { order: 1, fc: 'item.enrolled.length' },
            view: ['filter', 'list', 'edit']
        },
        availablePlaces: {
            type: 'number',
            label: 'Available Places',
            readonly: 2,
            cal: { order: 2, fc: 'item.classSize - item.enrolledCount' },
            view: ['filter', 'list', 'edit']
        },
        enrolled: {
            type: 'list',
            label: 'Enrolled',
            fields: {
                student: {
                    type: 'entity',
                    entity: 'student',
                    label: 'Student',
                    rules: [
                        'required'
                    ],
                    view: ['edit']
                },
                enrolDate: {
                    type: 'datetime',
                    label: 'Enrol Date',
                    readonly: 2,
                    default: 'new Date',
                    view: ['edit']
                }
            },
            view: ['edit']
        },
    },
}