class User{
    constructor({id,email,password,firstName,lastName,gender,createdAt}){
        this.id=id;
        this.email=email;
        this.password=password;
        this.firstName=firstName;
        this.lastName=lastName;
        this.gender=gender;
        this.createdAt=createdAt;
        this.validate();
    }

    validate(){
        if(!this.email || this.email.trim()===''){
            throw new Error('email is required');
        }
        if(!this.password || this.password.length<6){
            throw new Error('password is required and must have at least 6 characters');
        }
        if(this.gender && !User.genders.includes(this.gender.toLowerCase())){
            throw new Error('invalid gender');
        }

    }

    static get genders(){
        return['m','f','o']; //male,female,other
    }
}

module.exports=User;