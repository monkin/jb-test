
import { Validator } from "jsonschema";

export interface Mark {
    _id?: string;
    from: string
    to: string;
    criterion: string;
    mark: number;
}

const schema = {
    type: "object",
    properties: {
        from: { type: "string" },
        to: { type: "string" },
        criterion: { type: "string" },
        mark: { type: "integer", minimum: 1, maximum: 4 }
    }
};

export namespace Mark {
    export function isMark(value: any): value is Mark {
        let validation = new Validator().validate(value, schema);
        return validation.valid && value.from !== value.to;
    }
}