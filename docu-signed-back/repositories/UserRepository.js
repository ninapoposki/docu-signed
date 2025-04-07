const db=require('../db');
const  User=require('../models/User');

const UserRepository={
    async create(userData){
        //prosledjen objekat
        const{email,password,firstName,lastName,gender}=userData
   
        
        const result=await db.query(
            `INSERT INTO users (email,password,first_name,last_name,gender)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING *`,
            [email,password,firstName,lastName,gender]
        );

        return new User(result.rows[0]); //upisani red  kao objekat


    }
};