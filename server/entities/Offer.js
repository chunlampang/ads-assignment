module.exports = {

    apiPath: '/offers',
    plural: 'Offers',
    singular: 'Offer',
    fields: {
        department: {
            type: 'entity',
            entity: 'Department',
            label: 'Department',
            rules: [
                'required'
            ]
        },
        course: {
            type: 'entity',
            entity: 'Course',
            label: 'Course',
            rules: [
                'required'
            ]
        },
        year: {
            type: 'number',
            label: 'Year',
            rules: [
                'required',
                'integer'
            ]
        },
        classSize: {
            type: 'number',
            label: 'Class Size',
            rules: [
                'required',
                'integer'
            ]
        },
        enrolled: {
            type: 'objects',
            label: 'Enrolled',
            fields: {
                student: {
                    type: 'entity',
                    entity: 'Student',
                    label: 'Student',
                    rules: [
                        'required'
                    ]
                },
                enrolDate: {
                    type: 'datetime',
                    label: 'Enrol Date',
                    readonly: true,
                    default: 'new Date'
                }
            }
        },
        enrolledCount: {
            type: 'number',
            label: 'Enrolled Count',
            readonly: true,
            cal: { order: 1, fc: 'item.enrolled.length' }
        },
        availablePlaces: {
            type: 'number',
            label: 'Available Places',
            readonly: true,
            cal: { order: 2, fc: 'item.classSize - item.enrolledCount' }
        },
    },
}