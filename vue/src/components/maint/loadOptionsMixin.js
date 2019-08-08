export default {
    inject: {
        entities: {},
        options: { default: {} },
        optionsRequests: { default: [] }
    },
    methods: {
        async initOptions(fields) {
            for (let fieldName in fields) {
                const field = fields[fieldName];
                if (field.type === "entity" || field.type === "entities") {
                    if (!this.options[field.entity]) {
                        this.options[field.entity] = [];
                        this.optionsRequests.push(this.loadOptions(field.entity));
                    }
                }
            }
            await Promise.all(this.optionsRequests);
        },
        async loadOptions(entityName) {
            const result = await this.$api.query(
                "/" + this.entities[entityName].collection
            );
            this.options[entityName] = result.data;
        },
    }
}