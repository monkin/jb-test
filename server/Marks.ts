
/// <reference types="@types/meteor"/>
/// <reference types="@types/node"/>

import { Validator } from "jsonschema";
import "es6-shim";

interface Mark {
    _id?: string;
    from: string
    to: string;
    criterion: string;
    mark: number;
}

const markSchema = {
    type: "object",
    properties: {
        from: { type: "string" },
        to: { type: "string" },
        criterion: { type: "string" },
        mark: { type: "integer", minimum: 0, maximum: 4 }
    }
};

namespace Mark {
    export function isMark(value: any): value is Mark {
        let validation = new Validator().validate(value, markSchema);
        return validation.valid && value.from !== value.to;
    }
}

function isAdmin(userId?: string) {
    let user = Meteor.users.findOne(userId || Accounts.userId());
    return !!(user && user.profile && user.profile.isAdmin);
}

Meteor.startup(() => {

    let marks = new Mongo.Collection<Mark>("marks"),
        summary = new Mongo.Collection<{ _id?: string, user: string, criterion: string, sum: number, count: number }>("summary");
    marks.allow({ insert: () => false, update: () => false, remove: () => false });
    summary.allow({ insert: () => false, update: () => false, remove: () => false });

    Meteor.publish("marks", function (options: { from?: string, to?: string }) {
        let { from, to } = options;
        if (isAdmin(this.userId)) {
            return marks.find(Object.assign(from ? { from } : {}, to ? { to } : {}));
        } else {
            if (from && from === this.userId) {
                return marks.find(Object.assign({ from }, to ? { to } : {}));
            } else {
                throw new Error(`Access denied`);
            }
        }
    });

    Meteor.publish("summary", function () {
        if (isAdmin(this.userId)) {
            return summary.find({});
        } else {
            throw new Error(`Access denied`);
        }
    });

    Meteor.methods({
        putMark(mark) {
            if (Mark.isMark(mark)) {
                let fromUser = Meteor.users.findOne(mark.from),
                    toUser = Meteor.users.findOne(mark.to);
                
                if (!fromUser || !toUser) {
                    throw new Error(`User not found`);
                }
                if (fromUser.profile && fromUser.profile.isAdmin) {
                    throw new Error("Administrator can't put marks");
                }
                if (toUser.profile && toUser.profile.isAdmin) {
                    throw new Error("It's not possible to put mark for administrator");
                }
                if (mark.from !== Meteor.userId()) {
                    throw new Error("You can't put marks as another user");
                }
                if (fromUser._id === toUser._id) {
                    throw new Error("You can't put marks to yourself");
                }

                let oldMark = marks.findOne({ from: mark.from, to: mark.to, criterion: mark.criterion }),
                    summaryItem = summary.findOne({ user: mark.to, criterion: mark.criterion }),
                    incSum = 0,
                    incCount = 0;
                
                if (oldMark) {
                    incSum = mark.mark - oldMark.mark;

                    if (mark.mark !== 0) {
                        marks.update(oldMark._id as string, mark);
                    } else {
                        marks.remove(oldMark._id as string);
                        incCount = -1;
                    }
                } else {
                    incSum = mark.mark;
                    incCount = 1;
                    let id = marks.insert(mark);
                }

                if (summaryItem) {
                    summary.update(summaryItem._id as string, {
                        $inc: { sum: incSum, count: incCount }
                    });
                } else if (mark.mark !== 0) {
                    summary.insert({
                        user: mark.to,
                        criterion: mark.criterion,
                        count: 1,
                        sum: mark.mark
                    });
                }
            } else {
                throw new Error(`Invalid request parameters: ${JSON.stringify(mark)}`);
            }
        }
    });

});
