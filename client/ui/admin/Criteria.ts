
import * as md5 from "md5";

export interface Criteria {
    _id: string;
    name: string;
}

export namespace Criteria {
    export const collection = new Mongo.Collection<Criteria>("criteria");
    export async function create(name: string) {
        return new Promise<Criteria>((resolve, reject) => {
            let item = { _id: md5(name), name };
            collection.insert(item, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(item);
                }
            });
        });
    }

}