const db = require('../config/db');


class user{


    static async getUsers() {
        return new Promise((resolve, reject) => {
            console.log("Executing query...");  // Affiche avant d'exécuter la requête
            db.query("SELECT * FROM user", (err, result) => {
                if (err) {
                    console.error("Database error:", err);  // Affiche l'erreur si elle existe
                    reject(err); // Rejette la promesse en cas d'erreur
                } else {
                    console.log("Query result:", result);  // Affiche le résultat si la requête réussit
                    resolve(result); // Résout la promesse avec les résultats
                }
            });
        });
    }

    static async deleteUser(id)
    {
        return  new Promise((resolve,reject) =>{
            const sql = "DELETE FROM user where id = ?";
            db.query(sql,[id],(err,result)=>{
                if(err){
                    reject(false);
                }
                else{
                    resolve(true);
                }
            });
          })
       
    }
}

module.exports=user