module.exports = {
    collection: 'offers',
    icon: 'mdi-account-check-outline',
    plural: 'Offers',
    singular: 'Offer',
    fields: {
        course: {
            type: 'fieldset',
            fieldset: 'course',
            src: {
                type: 'course',
                entity: 'department',
                field: 'courses.course',
                key: 'courseId',
                itemkey: 'department'
            },
            label: 'Course',
            rules: ['required'],
            view: ['list', 'edit', 'title', 'dept']
        },
        year: {
            type: 'number',
            label: 'Year',
            rules: ['required', 'integer', 'positive'],
            view: ['list', 'edit', 'title', 'dept']
        },
        department: {
            type: 'entity',
            entity: 'department',
            label: 'Department',
            rules: ['required'],
            view: ['list', 'edit', 'title']
        },
        classSize: {
            type: 'number',
            label: 'Class Size',
            rules: ['required', 'integer', 'positive'],
            view: ['list', 'edit', 'dept']
        },
        enrolledCount: {
            type: 'number',
            label: 'Enrolled Count',
            readonly: 2,
            cal: { order: 1, fc: 'item.enrolled.length' },
            view: ['list', 'edit', 'dept']
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
                    rules: ['required'],
                    readonly: 1,
                    view: ['list', 'edit', 'title']
                },
                enrolDate: {
                    type: 'datetime',
                    label: 'Enrol Date',
                    rules: ['required'],
                    default: 'new Date',
                    view: ['list', 'edit']
                }
            }
        },
    },
}