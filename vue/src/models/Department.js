export default class Department {

    static apiPath = '/departments';
    static plural = 'Departments';
    static singular = 'Department';
    static fields = {
        _id: {
            type: String,
            label: 'Dept ID',
            rules: [
                v => !!v || 'Dept ID is required'
            ]
        },
        deptName: {
            type: String,
            label: 'Dept Name',
            rules: [
                v => !!v || 'Dept Name is required'
            ]
        },
        location: {
            type: String,
            label: 'Location',
            rules: [
                v => !!v || 'Location is required'
            ]
        }
    };

    constructor() {
        this._id = '';
        this.deptName = '';
        this.location = '';
    }
}