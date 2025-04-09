const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserDTO = require("../dtos/UserDTO");
const userRepository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");

const userService = {
  //registracija
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    //hesiranje lozinke-8 salt rounds -koliko puta ce se lozinka procesirati tokom hesiranja
    const hashedPassword = await bcrypt.hash(userData.password, 8);

    const newUser = new User({
      // ...userData,
      // password: hashedPassword,
      // createdAt: new Date(),
      //...userData,hesirana lozinka
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      createdAt: new Date(),
    });
    // return await userRepository.create(newUser);
    const createdUser = await userRepository.create(newUser);

    return new UserDTO(
      createdUser.id,
      createdUser.email,
      createdUser.password,
      createdUser.firstName,
      createdUser.lastName,
      createdUser.gender,
      createdUser.createdAt
    );
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    console.log("User password: ", user.password); // Proveri šta je pohranjeno u bazi

    //poredjenje hesirane lozinke sa vec postojecom
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password input");
    }

    //generisanje jwt tokena
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return token;
  },
};
module.exports = userService;
