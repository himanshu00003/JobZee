import mongoose from"mongoose";
import validator from"validator";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3, "Name must contain 3 characters!"],
        maxLength:[30, "Name cannot exceed 30 characters!"],
    },
    email:{
        type:String,
        required:[true, "Please provide your email"],
        validate:[validator.isEmail,"Please provide a valid Email"],

    },
    phone:{
        type:Number,
        required:[true,"Please provide your phone Number"]

    },
    password:{
        type:String,
        required:[true, "Please provide your password"],
        minLength:[8, "Password must contain at least 8 characters!"],
        maxLength:[32, "Password cannot exceed 32 characters!"],
        select:false
    },
    role:{
        type:String,
        required:[true, "Please provide your role"],
        enum:["Job Seeker", "Employer"],

    },
    createdAt:{
        type:Date,
        default:Date.now,

    },

});

// //Hashing the passsword

// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// //Comparing password

// userSchema.methods.comparePassword= async function(enteredPassword){
//     console.log(this.password)
//     return await bcrypt.compare (enteredPassword,this.password);
// };

//Generating jwtToken for Authorization

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{

        expiresIn:process.env.JWT_EXPIRE,
    })

}

export const User=mongoose.model("User",userSchema);

