import mongoose from 'mongoose';

const { Schema } = mongoose; // Ajoutez cette ligne

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contentId: {
        type: Schema.Types.ObjectId,
        required: true,
        
        // Ajoutez une référence au modèle de Post ou de Comment selon le cas
    },
    contentType: {
        type: String,
        enum: ['post', 'comment'],
        required: true,
    },
    // Ajoutez d'autres champs si nécessaire
});

const Like = mongoose.model('Like', likeSchema);
export default Like;
