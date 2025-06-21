import { resolvers } from '../resolvers';

describe('Resolvers', () => {
  describe('Query', () => {
    it('should return hello message', () => {
      const result = resolvers.Query.hello();
      expect(result).toBe('Hello from Toki API!');
    });

    it('should return health status', () => {
      const result = resolvers.Query.health();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });

  describe('Mutation', () => {
    it('should echo message', () => {
      const message = 'test message';
      const result = resolvers.Mutation.echo(null, { message });
      expect(result).toBe(`Echo: ${message}`);
    });
  });
}); 