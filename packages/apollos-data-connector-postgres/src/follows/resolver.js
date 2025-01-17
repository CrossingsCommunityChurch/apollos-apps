const resolvers = {
  Mutation: {
    requestFollow: (root, args, { dataSources: { Follow } }) =>
      Follow.requestFollow(args),
    acceptFollowRequest: (root, args, { dataSources: { Follow } }) =>
      Follow.acceptFollowRequest(args),
    ignoreFollowRequest: (root, args, { dataSources: { Follow } }) =>
      Follow.ignoreFollowRequest(args),
    unfollowPerson: (root, args, { dataSources: { Follow } }) =>
      Follow.unfollowPerson(args),
  },
  Person: {
    currentUserFollowing: (root, args, { dataSources: { Follow } }) =>
      Follow.getCurrentUserFollowingPerson(root),
    followingCurrentUser: (root, args, { dataSources: { Follow } }) =>
      Follow.getPersonFollowingCurrentUser(root),
  },
  Query: {
    followRequests: (root, args, { dataSources: { Follow } }) =>
      Follow.followRequests(args),
  },
  Follow: {
    id: ({ apollosId }) => apollosId,
  },
};

export default resolvers;
