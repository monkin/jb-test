
export interface Marks {
    _id?: string;
    from: string
    to: string;
    criterion: string;
    mark: number;
}

export namespace Marks {
    export const collection = new Mongo.Collection<Marks>("marks");
    export function subscribe(options: { from?: string, to?: string }) {
        return Meteor.subscribe("marks", options);
    }
}

export interface Summary {
    _id?: string;
    user: string;
    criterion: string;
    sum: number;
    count: number;
}

export namespace Summary {
    export const collection = new Mongo.Collection<Summary>("summary");
    export function subscribe() {
        return Meteor.subscribe("summary");
    }
}