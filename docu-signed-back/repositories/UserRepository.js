const User = require("../models/User");

const userRepository = {
  async create(userData) {
    const user = await User.create(userData);
    return user;
  },

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  },
  async findById(id) {
    const user = await User.findByPk(id);
    return user;
  },
};

module.exports = userRepository;
