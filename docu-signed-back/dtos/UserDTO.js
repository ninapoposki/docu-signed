class UserDTO {
  constructor({ id, email, firstName, lastName, gender }) {
    this.id = id;
    this.email = email;
    // this.password = password;
    this.firstName = firstName;
    this.gender = gender;
  }

  static get genderEnum() {
    return {
      MALE: "m",
      FEMALE: "f",
      OTHER: "o",
    };
  }
}
module.exports = UserDTO;

//constants-za boje -sve iste
//assests-slicice
//components-za globalne
//
