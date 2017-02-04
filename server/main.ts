/// <reference path="../node_modules/@types/meteor/index.d.ts"/>

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

});
