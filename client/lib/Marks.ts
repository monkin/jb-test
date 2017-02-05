
export interface Marks {
    _id?: string;
    from: string
    to: string;
    criterion: string;
    mark: number;
}

export namespace Marks {
    export const collection = new Mongo.Collection<Marks>("marks");
    export function subscribe(options: { from?: string, to?: string } = {}) {
        return Meteor.subscribe("marks", options);
    }
}