class User {
  constructor({ id, email, password, firstName, lastName, gender, createdAt }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.createdAt = createdAt;
    // this.validate();
  }

  validate() {
    if (!this.email || this.email.trim() === "") {
      throw new Error("email is required");
    }
    if (!this.password || this.password.length < 6) {
      throw new Error(
        "password is required and must have at least 6 characters"
      );
    }
    // if (this.gender && !User.genders.includes(this.gender.toLowerCase())) {
    if (this.gender && !User.genderEnum[this.gender]) {
      throw new Error("invalid gender");
    }
  }

  // static get genders(){
  //     return['m','f','o']; //male,female,other
  // }
  static get genderEnum() {
    //ili samo gender
    return {
      MALE: "m",
      FEMALE: "f",
      OTHER: "o",
    };
  }
}

module.exports = User;
