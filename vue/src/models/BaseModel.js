export default class BaseModel {
    constructor() {
        let fields = this.constructor.fields;
        for (let field in fields) {
            this[field] = fields.default === undefined ? null : fields.default;
        }
    }
}