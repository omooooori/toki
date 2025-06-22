import { userResolvers } from './userResolvers';
import { diaryResolvers } from './diaryResolvers';
import { photoResolvers } from './photoResolvers';
import { locationVisitResolvers } from './locationVisitResolvers';
import { calendarEventResolvers } from './calendarEventResolvers';
import { scalarResolvers } from './scalarResolvers';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...diaryResolvers.Query,
    ...photoResolvers.Query,
    ...locationVisitResolvers.Query,
    ...calendarEventResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...diaryResolvers.Mutation,
    ...photoResolvers.Mutation,
    ...locationVisitResolvers.Mutation,
    ...calendarEventResolvers.Mutation,
  },
  Diary: diaryResolvers.Diary,
  ...scalarResolvers,
}; 