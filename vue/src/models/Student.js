import BaseModel from './BaseModel';

export default class Student extends BaseModel {

    static apiPath = '/students';
    static plural = 'Students';
    static singular = 'Student';
    static fields = {
        _id: {
            type: 'string',
            label: 'Stu ID',
            readonly: 1,
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
        super();
    }
}