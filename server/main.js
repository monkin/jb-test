import { Meteor } from 'meteor/meteor';

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

});
