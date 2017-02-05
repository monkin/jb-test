
/// <reference types="@types/meteor"/>

function isAdmin() {
    let user = Accounts.user();
    return !!(user && user.profile && user.profile.isAdmin);
}

Meteor.startup(() => {
    let criteria = new Mongo.Collection<{ _id: string, name: string }>("criteria");
    Meteor.publish("criteria", () => criteria.find({}));

    criteria.allow({
        insert: isAdmin,
        update: isAdmin,
        remove: isAdmin
    });

});
