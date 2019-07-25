import BaseModel from './BaseModel';
import Department from './Department';
import Course from './Course';

export default class Offer extends BaseModel {

    static apiPath = '/offers';
    static plural = 'Offers';
    static singular = 'Offer';
    static fields = {
        department: {
            type: 'entity',
            entity: Department,
            label: 'Department',
            rules: [
                v => !!v || 'Department is required.'
            ]
        },
        course: {
            type: 'entity',
            entity: Course,
            label: 'Course',
            rules: [
                v => !!v || 'Course is required.'
            ]
        },
        year: {
            type: 'number',
            label: 'Year',
            rules: [
                v => !!v || 'Year is required.',
                v => Number.isInteger(v) || 'Year should be an integer.',
            ]
        },
        classSize: {
            type: 'number',
            label: 'Year',
            rules: [
                v => !!v || 'Year is required.',
                v => Number.isInteger(v) || 'Year should be an integer.',
            ]
        },
        enrolled: {
            type: 'objects',
            label: 'Year',
            rules: [
                v => !!v || 'Year is required.',
                v => Number.isInteger(v) || 'Year should be an integer.',
            ]
        },
        enrolledCount: {
            type: 'number',
            label: 'Enrolled Count',
            readonly: 2,
            cal: i => i.enrolled.length
        },
        availablePlaces: {
            type: 'number',
            label: 'Year',
            readonly: 2,
            cal: i => i.classSize - i.enrolled.length
        },
    };

    constructor() {
        super();
    }
}