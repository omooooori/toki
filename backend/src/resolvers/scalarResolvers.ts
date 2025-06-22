import { GraphQLScalarType, Kind } from 'graphql';

export const scalarResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    
    serialize(value: any) {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    },
    
    parseValue(value: any) {
      return new Date(value);
    },
    
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type (YYYY-MM-DD format)',
    
    serialize(value: any) {
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      if (typeof value === 'string') {
        return value;
      }
      return value;
    },
    
    parseValue(value: any) {
      if (typeof value === 'string') {
        return value;
      }
      return value;
    },
    
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      return null;
    },
  }),
}; 