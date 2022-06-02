const { User, Thought } = require("../models");

const thoughtController = {
  // get all thoughts
  getAllThought(req, res) {
    Thought.find({})
    .populate({ path: "reactions", select: "-__v" })
    .select("-__v")
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // get thoughts by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({ path: "reactions", select: "-__v" })
    .select("-__v")
    .sort({ _id: -1 })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

// creating a new thought
createThought({ body }, res) {
  Thought.create(body)
  .then(({ _id }) => {
    return User.findOneAndUpdate(
      { _id: body.userId },
      { $push: { thoughts : body.thoughtText } },
      { new: true }
    );
  })
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thoughts found with this id."});
      return;
    }
     res.json(dbThoughtData);
  })
  .catch(err => res.json(err));
},

// update a thought by id
updateThought({ params, body }, res) {
  Thought.findOneAndUpdate(
    { _id: params.id },
    body,
    { new: true }
  )
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
},

deleteThought({ params }, res) {
  Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No user found with this Id." });
        return;
      }
      // if the id was found, then we remove the thought from the user
      return User.findOneAndUpdate(
        { _id: parmas.userId },
        { $pull: { thoughts: params.Id } },
        { new: true }
      )
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this Id." });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

// create a reaction
createReaction({ params, body }, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $addToSet: { reactions: body } },
    { new: true }
  )
  .populate({ path: "reactions", select: "-__v"})
  .select("-__v")
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thoughts found with this id." });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
},

// remove a reaction
deleteReaction(req, res) {
  // removing the reaction from the thought
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { new: true }
  )
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thought found with this id." });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
}
};

module.exports = thoughtController;
