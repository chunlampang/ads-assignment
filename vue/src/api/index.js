import axios from "axios";
import qs from "qs";

export default {
    install(Vue) {
        Vue.prototype.$api = this;
    },
    async sendRequest(method, path, params) {
        let out;
        try {
            let response = await axios.request({
                baseURL: 'http://localhost/api',
                paramsSerializer: handleNestedParams,
                url: path,
                method, params
            });
            console.log(path, response);

            out = response.data;
        } catch (err) {
            let response = err.response;
            if (!response)
                out = { error: 'Network Error. Please try again later.' };
            else if (response && response.status >= 400 && response.status < 500)
                out = { error: response.data.error };
            else
                out = { error: err.message };
        } finally {
            return out;
        }
    },
    getDepartments({ page, sort } = {}) {
        if (!sort)
            sort = '-_id';
        return this.sendRequest('get', '/departments', { page, sort });
    },
    /**
     * Find Student by name for e)
     * @param {*} filter { stuName }
     * @param {Object} options { page, sort }
     */
    getStudents(filter, { page, sort } = {}) {
        if (!sort)
            sort = '-_id';
        return this.sendRequest('get', '/students', { filter, page, sort });
    },
    /**
     * a) Find the titles of courses offered by the CS department in 2016.
     * e) List the courses offered by the CS department that the student Chan Tai Man has enrolled in 2016.
     * @param {*} filter { department, year, student }
     * @param {Object} options { page, sort }
     */
    async getCoursesTitle(filter, { page, sort } = {}) {
        if (!sort)
            sort = '-_id';
        return this.sendRequest('get', '/offers', {
            filter,
            join: ['course'],
            fields: ['year', 'department', '_join.course'],
            page, sort
        });
    },
    /**
     * b) List the information of courses offered by the CS or IS departments in 2016.
     * c) Find the information of the course which is the most popular course enrolled by students.
     * @param {Object} filter { department, year }
     * @param {Object} options { page, sort }
     */
    async getJoinedOffers(filter, { page, sort } = {}) {
        if (!sort)
            sort = '-_id';
        return this.sendRequest('get', '/offers', {
            filter,
            join: ['course', 'department'],
            page, sort
        });
    },
    /**
     * d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
     * @param {Object} filter { department, year }
     * @param {Object} options { page, sort }
     */
    async getOffers(filter, { page, sort } = {}) {
        if (!sort)
            sort = '-_id';
        return this.sendRequest('get', '/offers', {
            filter,
            page, sort
        });
    },

    async insert(path, data) {
        return this.sendRequest('post', path, data);
    },
    async update(path, id, data) {
        return this.sendRequest('put', path + '/' + id, data);
    },
    async delete(path, id) {
        return this.sendRequest('delete', path + '/' + id);
    },
    async get(path, id) {
        return this.sendRequest('get', path + '/' + id);
    },
    async query(path, params) {
        return this.sendRequest('get', path, params);
    },
};

function handleNestedParams(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
}