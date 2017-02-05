/// <reference path="../node_modules/@types/meteor/index.d.ts"/>

import { Mark } from "./Mark";

Meteor.startup(() => {

    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'admin',
            email: 'admin@admin',
            password: 'moulin',
            profile: {
                isAdmin: true
            }
        });
    }

    function isAdmin() {
        let user = Accounts.user();
        return !!(user && user.profile && user.profile.isAdmin);
    }

    Meteor.users.allow({
        insert: isAdmin,
        update: isAdmin,
        remove: isAdmin
    });

    Meteor.publish("userData", () => Meteor.users.find({_id: this.userId}));
    Meteor.publish("allUsers", () => Meteor.users.find({ "profile.isAdmin": { $ne: true } }));

    Meteor.methods({
        createUserWithoutLogin(options) {
            if (isAdmin()) {
                Accounts.createUser(options);
            } else {
                throw new Error(`Access denied`);
            }
        }
    });

    let criteria = new Mongo.Collection<{ _id: string, name: string }>("criteria");
    Meteor.publish("criteria", () => criteria.find({}));

    criteria.allow({
        insert: isAdmin,
        update: isAdmin,
        remove: isAdmin
    });

    let marks = new Mongo.Collection<Mark>("marks"),
        summary = new Mongo.Collection<{ _id?: string, user: string, criterion: string, sum: number, count: number }>("summary");
    marks.allow({ insert: () => false, update: () => false, remove: () => false });
    summary.allow({ insert: () => false, update: () => false, remove: () => false });

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

                let oldMark = marks.findOne({ from: mark.from, to: mark.from, criterion: mark.criterion }),
                    summaryItem = summary.findOne({ user: mark.to, criterion: mark.criterion }),
                    incSum = 0;
                
                if (oldMark) {
                    incSum = mark.mark - oldMark.mark;
                    marks.update(oldMark._id as string, mark);
                } else {
                    incSum = mark.mark;
                    marks.insert(mark);
                }

                if (summaryItem) {
                    summary.update(summaryItem._id as string, {
                        $inc: { sum: incSum }
                    });
                } else {
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
