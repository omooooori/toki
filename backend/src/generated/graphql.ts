import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User } from './src/models/User';
import { Diary } from './src/models/Diary';
import { Photo } from './src/models/Photo';
import { LocationVisit } from './src/models/LocationVisit';
import { CalendarEvent } from './src/models/CalendarEvent';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: Date; output: Date; }
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  startTime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type Diary = {
  __typename?: 'Diary';
  date: Scalars['Date']['output'];
  editedText?: Maybe<Scalars['String']['output']>;
  generatedText: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  photos: Array<Photo>;
  userId: Scalars['ID']['output'];
};

export type LocationVisit = {
  __typename?: 'LocationVisit';
  address?: Maybe<Scalars['String']['output']>;
  durationMinutes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  placeName?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  visitedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCalendarEvent: CalendarEvent;
  createDiary: Diary;
  createLocationVisit: LocationVisit;
  createPhoto: Photo;
  createUser: User;
  deleteCalendarEvent: Scalars['Boolean']['output'];
  deleteDiary: Scalars['Boolean']['output'];
  deleteLocationVisit: Scalars['Boolean']['output'];
  deletePhoto: Scalars['Boolean']['output'];
  updateCalendarEvent: CalendarEvent;
  updateDiary: Diary;
  updateLocationVisit: LocationVisit;
  updatePhoto: Photo;
  updateUser: User;
};


export type MutationCreateCalendarEventArgs = {
  endTime: Scalars['DateTime']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateDiaryArgs = {
  date: Scalars['Date']['input'];
  editedText?: InputMaybe<Scalars['String']['input']>;
  generatedText: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateLocationVisitArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  durationMinutes?: InputMaybe<Scalars['Int']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  placeName?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
  visitedAt: Scalars['DateTime']['input'];
};


export type MutationCreatePhotoArgs = {
  imageUrl: Scalars['String']['input'];
  relatedLocationId?: InputMaybe<Scalars['ID']['input']>;
  takenAt: Scalars['DateTime']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteCalendarEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDiaryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLocationVisitArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePhotoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCalendarEventArgs = {
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateDiaryArgs = {
  editedText?: InputMaybe<Scalars['String']['input']>;
  generatedText?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateLocationVisitArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  durationMinutes?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  placeName?: InputMaybe<Scalars['String']['input']>;
  visitedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type MutationUpdatePhotoArgs = {
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  relatedLocationId?: InputMaybe<Scalars['ID']['input']>;
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Photo = {
  __typename?: 'Photo';
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  relatedLocationId?: Maybe<Scalars['ID']['output']>;
  takenAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  getCalendarEvents: Array<CalendarEvent>;
  getDiaries: Array<Diary>;
  getDiary?: Maybe<Diary>;
  getLocationVisits: Array<LocationVisit>;
  getPhotos: Array<Photo>;
  getUser?: Maybe<User>;
};


export type QueryGetCalendarEventsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetDiariesArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetDiaryArgs = {
  date: Scalars['Date']['input'];
};


export type QueryGetLocationVisitsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetPhotosArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CalendarEvent: ResolverTypeWrapper<CalendarEvent>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Diary: ResolverTypeWrapper<Diary>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LocationVisit: ResolverTypeWrapper<LocationVisit>;
  Mutation: ResolverTypeWrapper<{}>;
  Photo: ResolverTypeWrapper<Photo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CalendarEvent: CalendarEvent;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  Diary: Diary;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LocationVisit: LocationVisit;
  Mutation: {};
  Photo: Photo;
  Query: {};
  String: Scalars['String']['output'];
  User: User;
};

export type CalendarEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['CalendarEvent'] = ResolversParentTypes['CalendarEvent']> = {
  endTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DiaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Diary'] = ResolversParentTypes['Diary']> = {
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  editedText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  generatedText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['Photo']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationVisitResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationVisit'] = ResolversParentTypes['LocationVisit']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  durationMinutes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  placeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  visitedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCalendarEvent?: Resolver<ResolversTypes['CalendarEvent'], ParentType, ContextType, RequireFields<MutationCreateCalendarEventArgs, 'endTime' | 'startTime' | 'title' | 'userId'>>;
  createDiary?: Resolver<ResolversTypes['Diary'], ParentType, ContextType, RequireFields<MutationCreateDiaryArgs, 'date' | 'generatedText' | 'userId'>>;
  createLocationVisit?: Resolver<ResolversTypes['LocationVisit'], ParentType, ContextType, RequireFields<MutationCreateLocationVisitArgs, 'latitude' | 'longitude' | 'userId' | 'visitedAt'>>;
  createPhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationCreatePhotoArgs, 'imageUrl' | 'takenAt' | 'userId'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'name'>>;
  deleteCalendarEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCalendarEventArgs, 'id'>>;
  deleteDiary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDiaryArgs, 'id'>>;
  deleteLocationVisit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteLocationVisitArgs, 'id'>>;
  deletePhoto?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePhotoArgs, 'id'>>;
  updateCalendarEvent?: Resolver<ResolversTypes['CalendarEvent'], ParentType, ContextType, RequireFields<MutationUpdateCalendarEventArgs, 'id'>>;
  updateDiary?: Resolver<ResolversTypes['Diary'], ParentType, ContextType, RequireFields<MutationUpdateDiaryArgs, 'id'>>;
  updateLocationVisit?: Resolver<ResolversTypes['LocationVisit'], ParentType, ContextType, RequireFields<MutationUpdateLocationVisitArgs, 'id'>>;
  updatePhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationUpdatePhotoArgs, 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id'>>;
};

export type PhotoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Photo'] = ResolversParentTypes['Photo']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  relatedLocationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  takenAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCalendarEvents?: Resolver<Array<ResolversTypes['CalendarEvent']>, ParentType, ContextType, RequireFields<QueryGetCalendarEventsArgs, 'userId'>>;
  getDiaries?: Resolver<Array<ResolversTypes['Diary']>, ParentType, ContextType, RequireFields<QueryGetDiariesArgs, 'userId'>>;
  getDiary?: Resolver<Maybe<ResolversTypes['Diary']>, ParentType, ContextType, RequireFields<QueryGetDiaryArgs, 'date'>>;
  getLocationVisits?: Resolver<Array<ResolversTypes['LocationVisit']>, ParentType, ContextType, RequireFields<QueryGetLocationVisitsArgs, 'userId'>>;
  getPhotos?: Resolver<Array<ResolversTypes['Photo']>, ParentType, ContextType, RequireFields<QueryGetPhotosArgs, 'userId'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CalendarEvent?: CalendarEventResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Diary?: DiaryResolvers<ContextType>;
  LocationVisit?: LocationVisitResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Photo?: PhotoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

