const _defaultSubscriptionResolve = payload => payload

export const subscriptionCreator = ({
  name,
  resolve = _defaultSubscriptionResolve
}) => ({
  subscribe: (_, __, { pubsub } = {}) => pubsub.asyncIterator([name]),
  resolve
})
