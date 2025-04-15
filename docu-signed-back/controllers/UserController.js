const userService = require("../services/userService");

const userController = {
  async register(req, res) {
    try {
      const newUser = await userService.register(req.body);

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const token = await userService.login(email, password);

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = userController;
