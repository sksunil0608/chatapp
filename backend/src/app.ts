import express from "express";
import bodyParser from "body-parser";
import sequelize from "./util/db";
import cors from "cors";
// Models Import
import User from "./models/user";
import UserMessage from "./models/usermessage";
import Group from "./models/group";
import GroupMember from "./models/groupmember";
import GroupMessage from "./models/groupmessage";
import ContactList from "./models/contactlist";
//Routes Import
import userRoutes from "./routes/user";
import groupRoutes from "./routes/group"
import groupmessageRoutes from "./routes/groupmessage"
import contactlistRoutes from "./routes/contactlist"
import groupmemberRoutes from "./routes/groupmember"

const app = express()
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRoutes);
app.use(groupRoutes)
app.use(groupmessageRoutes)
app.use(contactlistRoutes)
app.use(groupmemberRoutes)
// User associations
User.hasMany(UserMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(UserMessage, { foreignKey: 'receiver_id', as: 'receivedMessages' });
User.hasMany(ContactList, { foreignKey: 'user_id', constraints: false });

// Group associations
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id' });
Group.hasMany(GroupMember, { foreignKey: 'group_id' });
Group.hasMany(GroupMessage, { foreignKey: 'group_id' });

// GroupMember associations
GroupMember.belongsTo(Group, { foreignKey: 'group_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id', as: 'User' });


// GroupMessage associations
GroupMessage.belongsTo(Group, { foreignKey: 'group_id' });
GroupMessage.belongsTo(User, { foreignKey: 'sender_id' });

// UserMessage associations
UserMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
UserMessage.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });


sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => console.log(err));
