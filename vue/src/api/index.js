import axios from "axios";
import qs from "qs";

export default {
    install(Vue) {
        Vue.prototype.$api = this;
    },
    //for v-select, v-combobox, v-autoComplete item-text
    getOptionItemText(entity) {
        if (!entity.desc) return "_id";
        if (entity.desc.key && entity.desc.label)
            return item => item[entity.desc.key] + ' - ' + item[entity.desc.label];
        if (entity.desc.key)
            return item => item[entity.desc.key];
        if (entity.desc.label)
            return item => item[entity.desc.label];
    },
    async getConfigs() {
        return await this.sendRequest('get', '/configs');
    },
    async sendRequest(method, path, data) {
        let out;
        try {
            const options = {
                baseURL: 'http://localhost/api',
                paramsSerializer: handleNestedParams,
                url: path,
                method
            };
            if (method === 'get')
                options.params = data;
            else
                options.data = data;

            let response = await axios.request(options);
            console.log(method, path, response);

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
    /**
     * for popular course
     * @param {Object} filter { department, year }
     * @param {Object} options { page, sort }
     */
    async getJoinedOffers(filter, { page, sort } = {}) {
        if (!sort)
            sort = '-_id';
        return this.sendRequest('get', '/offers', {
            filter,
            join: ['department'],
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