const mysql = require('mysql');
// Créer une connexion au serveur MySQL avec spécification du port
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database:'vote_project',
port: 3306 // Port par défaut pour MySQL
});
// Se connecter au serveur MySQL
db.connect((err) => {
if (err) {
console.error('Erreur de connexion à la base de données:',
err);
return; }
console.log('Connecté au serveur MySQL réussi.')});

module.exports = db