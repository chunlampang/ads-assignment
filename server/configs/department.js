module.exports = {
    collection: 'departments',
    icon: 'mdi-home-modern',
    plural: 'Departments',
    singular: 'Department',
    fields: {
        deptId: {
            type: 'string',
            label: 'Dept ID',
            rules: ['required'],
            view: ['list', 'edit', 'title']
        },
        deptName: {
            type: 'string',
            label: 'Dept Name',
            rules: ['required'],
            view: ['list', 'edit', 'title']
        },
        location: {
            type: 'string',
            label: 'Location',
            rules: ['required'],
            view: ['list', 'edit']
        },
        courses: {
            type: 'list',
            label: 'Courses',
            view: ['edit'],
            indexs: [['course']],
            fields: {
                course: {
                    type: 'fieldset',
                    fieldset: 'course',
                    label: 'Course',
                    rules: ['required'],
                    view: ['list', 'edit']
                }
            }
        }
    },
    desc: {
        key: 'deptId',
        label: 'deptName'
    },
    references: {
        offers: {
            label: 'Offers',
            entity: 'offer',
            field: 'department',
            view: 'dept'
        }
    }
}