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
            view: ['list', 'edit']
        },
        course: {
            type: 'fieldset',
            fieldset: 'course',
            label: 'Course',
            rules: ['required'],
            view: ['list', 'edit', 'title']
        },
        year: {
            type: 'number',
            label: 'Year',
            rules: ['required', 'integer', 'positive'],
            view: ['list', 'edit', 'title']
        },
        classSize: {
            type: 'number',
            label: 'Class Size',
            rules: ['required', 'integer', 'positive'],
            view: ['list', 'edit']
        },
        enrolledCount: {
            type: 'number',
            label: 'Enrolled Count',
            readonly: 2,
            cal: { order: 1, fc: 'item.enrolled.length' },
            view: ['list', 'edit']
        },
        availablePlaces: {
            type: 'number',
            label: 'Available Places',
            readonly: 2,
            cal: { order: 2, fc: 'item.classSize - item.enrolledCount' },
            view: ['list', 'edit']
        },
        enrolled: {
            type: 'list',
            label: 'Enrolled',
            view: ['edit'],
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
            }
        },
    },
}