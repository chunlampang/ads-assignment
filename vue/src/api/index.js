import axios from "axios";

export default {
    install(Vue) {
        Vue.prototype.$api = this;
    },
    async getCourses({ department, year }) {
        try {
            let response = await axios.get('/courses', { department, year });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
};