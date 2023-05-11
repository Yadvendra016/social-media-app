import bcrypt from 'bcrypt';

//  function to hash password
export const hashPassword = (password) => {
    return new Promise((resolve,reject) =>{ // it will either success or failure
        bcrypt.genSalt(12, (err, salt) =>{
            if(err){
                reject(err);
            }
            bcrypt.hash(password, salt, (err,hash) =>{
                if(err){
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

// when user wants to login then compare the password
export const comparePassword = async (password, hashed) =>{
    return await bcrypt.compare(password,hashed);     // true/false
};