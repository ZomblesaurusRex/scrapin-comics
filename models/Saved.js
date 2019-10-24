var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedSchema = new Schema({
    articleImg: {
        type: String,
        required: true
    },
    // `title` is required and of type String
    articleDetails: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    articleLink: {
        type: String,
        required: true
    },
    
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;