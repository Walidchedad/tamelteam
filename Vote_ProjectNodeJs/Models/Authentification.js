const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


class Authentification {

    static async register(username,email,password){
      return new Promise((reject,resolve)=>{
        db.query('select * from users where email = ?',[email],(err,result) =>{
            if(err){
                console.log(err);
                reject(err)
            }
            if(result.length > 0){
                console.log('email already registed');
                
            }

        })
      });
       

    }
}