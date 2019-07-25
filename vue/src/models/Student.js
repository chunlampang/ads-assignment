export default class Student {

    static apiPath = '/students';
    static plural = 'Students';
    static singular = 'Student';
    static fields = {
        _id: {
            type: 'string',
            label: 'Stu ID',
            rules: [
                v => !!v || 'Stu ID is required'
            ]
        },
        stuName: {
            type: 'string',
            label: 'Stu Name',
            rules: [
                v => !!v || 'Stu Name is required'
            ]
        },
        dOB: {
            type: 'date',
            label: 'Date of Birth',
            rules: [
                v => !!v || 'Date of Birth is required'
            ]
        }
    };

    constructor() {
        this._id = '';
        this.stuName = '';
        this.dOB = '';
    }
}