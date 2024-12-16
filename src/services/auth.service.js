const { User } = require('../models/index');

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        const error = new Error('User not found');
        error.status = 401;
        throw error
      }

      return user;
    } catch (error) {
      throw error
    }
  }
}