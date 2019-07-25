export default class Course {

    static apiPath = '/courses';
    static plural = 'Courses';
    static singular = 'Course';
    static fields = {
        _id: {
            type: 'string',
            label: 'Course ID',
            rules: [
                v => !!v || 'Course ID is required.'
            ]
        },
        title: {
            type: 'string',
            label: 'Title',
            rules: [
                v => !!v || 'Title is required.'
            ]
        },
        level: {
            type: 'number',
            label: 'Level',
            rules: [
                v => !!v || 'Level is required.',
                v => Number.isInteger(v) || 'Level should be an integer.',
            ]
        }
    };

    constructor() {
        this._id = '';
        this.deptName = '';
        this.location = '';
    }
}