module.exports = {
    apiPath: '/departments',
    plural: 'Departments',
    singular: 'Department',
    fields: {
        deptId: {
            type: 'string',
            label: 'Dept ID',
            rules: ['required']
        },
        deptName: {
            type: 'string',
            label: 'Dept Name',
            rules: ['required']
        },
        location: {
            type: 'string',
            label: 'Location',
            rules: ['required']
        }
    }
}