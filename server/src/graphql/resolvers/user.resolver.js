export default {
  Query: {
    users: async (_, params, {models: {User}}) => {
      return await User.find({})
    },
    user: async (_, params, {models: {User}}) => {
      return await User.findOne(params)
    }
  },

  Mutation: {
    deleteUser: async (_, params, {models: {User}}) => {
      const user = await User.findOneAndDelete(params)
      if (user) return `User removed ${params._id}`
      throw new Error(`This user doesnt exist ${params._id}`)
    },
    insertUser: async (_, params, {models: {User}}) => {
      const user = await User.findOne({
        email: params.email
      })

      if (!user) return await User.create(params)
      throw new Error(`User exist with email ${params.email}`)
    }
  }
}