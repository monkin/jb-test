
/// <reference types="@types/meteor"/>


Meteor.startup(() => {

    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'admin',
            email: 'admin@admin',
            password: '1',
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
    Meteor.publish("allUsers", function () {
        if (this.userId) {
            Meteor.users.find({ "profile.isAdmin": { $ne: true } });
        } else {
            throw new Error(`Access denied`);
        }
    });

    Meteor.methods({
        createUserWithoutLogin(options) {
            if (isAdmin()) {
                Accounts.createUser(options);
            } else {
                throw new Error(`Access denied`);
            }
        }
    });

});
