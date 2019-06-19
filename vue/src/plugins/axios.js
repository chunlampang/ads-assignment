import axios from "axios";
import qs from "qs";

//allows nested params
axios.interceptors.request.use(config => {
    window.console.log(config);

    config.paramsSerializer = params => {
        return qs.stringify(params, {
            arrayFormat: "brackets",
            encode: false
        });
    };

    return config;
});