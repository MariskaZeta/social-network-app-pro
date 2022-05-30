const { User, Thought } = require("../models");

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
    .select("-__v")
    .sort({ _id: -1 })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({
      path: "thoughts",
      select: "-__v"
    })
    .populate({
      path: "friends",
      select: "-__v"
    })
    .then(dbUserData => {
      // if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({ message: "No User found with this id." });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // creating a new user
  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
  },

  // update a user by Id
 updateUser({ params, body }, res) {
  User.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No User found with this id!" });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
},

// delete a User by id
deleteUser( { params }, res) {
  Thought.deleteMany({ _id: params.id } )
  .then(() => {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id." });
        return;
      }
      res.json(dbUserData);
    });
  })
  .catch(err => res.json(err));
},

  // add a friend
addFriend({ params }, res) {
  // using $push to add a new friend to a user
  User.findOneAndUpdate(
      { _id: params.userId },
      { $push: {friends:params.friendId } },
      { new: true }
  )
  .then((dbUserData) => {
    if (!dbUserData) {
      res.status(404).json({ message: "No user found with this id." });
      return;
    }
    res.json(dbUserData);
  })
  .catch((err) => res.status(400).json(err));
},

// delete a friend by id
deleteFriend({ params }, res) {
  // using $pull to remove the friend from the user
  User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId  } },
    { new: true }
  )
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id." });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
  }
};

module.exports = userController;
