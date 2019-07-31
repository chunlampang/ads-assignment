module.exports = {
    collection: 'departments',
    plural: 'Departments',
    singular: 'Department',
    fields: {
        deptId: {
            type: 'string',
            label: 'Dept ID',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        deptName: {
            type: 'string',
            label: 'Dept Name',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        },
        location: {
            type: 'string',
            label: 'Location',
            rules: ['required'],
            view: ['filter', 'list', 'edit']
        }
    }
}