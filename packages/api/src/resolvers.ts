export const resolvers = {
  Query: {
    hello: () => 'Hello from Toki API!',
    health: () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
  },
  Mutation: {
    echo: (_: any, { message }: { message: string }) => `Echo: ${message}`,
  },
}; 