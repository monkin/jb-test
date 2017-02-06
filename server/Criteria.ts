
/// <reference types="@types/meteor"/>

function isAdmin() {
    let user = Accounts.user();
    return !!(user && user.profile && user.profile.isAdmin);
}

Meteor.startup(() => {
    let criteria = new Mongo.Collection<{ _id: string, name: string }>("criteria");
    Meteor.publish("criteria", function () {
        if (this.userId) {
            return criteria.find({});
        } else {
            throw new Error("Access denied");
        }
    });

    criteria.allow({
        insert: isAdmin,
        update: isAdmin,
        remove: isAdmin
    });
});
