export default class Course {

    static apiPath = '/courses';
    static plural = 'Courses';
    static singular = 'Course';
    static fields = {
        _id: {
            type: String,
            label: 'Course ID',
            rules: [
                v => !!v || 'Course ID is required.'
            ]
        },
        title: {
            type: String,
            label: 'Title',
            rules: [
                v => !!v || 'Title is required.'
            ]
        },
        level: {
            type: Number,
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