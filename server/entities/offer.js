module.exports = {
    collection: 'offers',
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
            type: 'entity',
            entity: 'course',
            label: 'Course',
            rules: ['required'],
            view: ['list', 'edit']
        },
        year: {
            type: 'number',
            label: 'Year',
            rules: ['required', 'integer'],
            view: ['list', 'edit']
        },
        classSize: {
            type: 'number',
            label: 'Class Size',
            rules: ['required', 'integer'],
            view: ['list', 'edit']
        },
        enrolled: {
            type: 'objects',
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
    },
}