const mongoose = require("mongoose");

const SavedSubstitutionSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
    required: true,
    trim: true
  },
  substitutionText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedSubstitution", SavedSubstitutionSchema);
