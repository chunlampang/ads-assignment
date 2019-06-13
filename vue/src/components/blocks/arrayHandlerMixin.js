export default {
    props: {
        fields: {
            type: Array,
            required: true,
            validator: function (value) {
                for (let i = 0, ln = value.length; i < ln; i++) {
                    let item = value[i];
                    if (!item.label || !item.name)
                        return false;
                    if(!item.type)
                        item.type = '10';
                }
                return true;
            }
        },
        value: {
            type: Array,
            required: true
        }
    }
}