const mongoose=require('mongoose')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true 
  },

  password: {
    type: String,
    required:function (){
      return this.authProvider === "local";
    }
  },
  authProvider:{
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  googleId:{
    type: String,
    default: null
  },
  
  picture:{
    type:String
  },
  stats: 
  {
      totalCreated: { type: Number, default: 0 },
      totalUpdated: { type: Number, default: 0 },
      totalDeleted: { type: Number, default: 0 },
    },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
