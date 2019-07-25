import BaseModel from './BaseModel';

export default class Department extends BaseModel {

    static apiPath = '/departments';
    static plural = 'Departments';
    static singular = 'Department';
    static fields = {
        _id: {
            type: 'string',
            label: 'Dept ID',
            readonly: 1,
            rules: [
                v => !!v || 'Dept ID is required'
            ]
        },
        deptName: {
            type: 'string',
            label: 'Dept Name',
            rules: [
                v => !!v || 'Dept Name is required'
            ]
        },
        location: {
            type: 'string',
            label: 'Location',
            rules: [
                v => !!v || 'Location is required'
            ]
        }
    };

    constructor() {
        super();
    }
}