const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const donerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}); 

// Hashing (Middleware)
donerSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bycrypt.hash(this.password, 12);
        this.cpassword = await bycrypt.hash(this.cpassword, 12);
    }
    next();
});

// Generate Token (Middleware)
donerSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
       // console.log(this.tokens);
        return token;
    }catch(err){
        console.log(err);
    }
};

const Doner = new mongoose.model('DONER' , donerSchema);

module.exports = Doner;