import bcrypt from "bcrypt";
//function to hash the password
export const hashPassword=async(password)=>{
    try{
        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(password,saltRounds);
        return hashedPassword;
    }catch(error){
        console.log(error);
    }};

//function to compare passwords for authentication
export const comparePassword=async(password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword);
};