import gql from 'graphql-tag';

export default gql`
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
  ) on FIELD_DEFINITION | OBJECT | INTERFACE

  directive @client on FIELD

  enum ACTION_FEATURE_ACTION {
    READ_CONTENT
    READ_EVENT
    OPEN_URL
    OPEN_NODE
    OPEN_CHANNEL
  }

  type ActionBarAction {
    id: ID!
    icon: String
    title: String
    action: ACTION_FEATURE_ACTION
    relatedNode: Node
  }

  type ActionBarFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    actions: [ActionBarAction]
  }

  type ActionListAction {
    id: ID!
    title: String
    subtitle: String
    image: ImageMedia
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
  }

  type ActionListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    actions: [ActionListAction]
    primaryAction: FeatureAction
  }

  input AnalyticsDeviceInfo {
    platform: AnalyticsPlatform
    deviceId: String
    deviceModel: String
    osVersion: String
    appVersion: String
  }

  input AnalyticsIdentifyInput {
    traits: [AnalyticsMetaField]
    anonymousId: String!
    deviceInfo: AnalyticsDeviceInfo
  }

  input AnalyticsMetaField {
    field: String!
    value: AnalyticsValue
  }

  enum AnalyticsPlatform {
    iOS
    Android
  }

  type AnalyticsResult {
    success: Boolean
  }

  input AnalyticsTrackInput {
    eventName: String!
    properties: [AnalyticsMetaField]
    anonymousId: String
    deviceInfo: AnalyticsDeviceInfo
  }

  scalar AnalyticsValue

  type AudioMedia implements Media {
    name: String
    key: String
    sources: [AudioMediaSource]
  }

  type AudioMediaSource implements MediaSource {
    uri: String
  }

  interface AudioNode {
    audios: [AudioMedia]
  }

  type AuthenticatedUser {
    id: ID!
    profile: Person
    rock: RockPersonDetails
    rockToken: String @deprecated(reason: "Use rock.authCookie instead")
  }

  type Authentication {
    user: AuthenticatedUser
    token: String
  }

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  type Campus implements Node {
    id: ID!
    name: String
    street1: String
    street2: String
    city: String
    state: String
    postalCode: String
    latitude: Float
    longitude: Float
    image: ImageMediaSource
    distanceFromLocation(location: CampusLocationInput): Float
    events: [Event]
  }

  input CampusLocationInput {
    latitude: Float
    longitude: Float
  }

  interface Card {
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    summary: String
  }

  type CardListItem {
    id: ID!
    hasAction: Boolean
    actionIcon: String
    labelText: String
    summary: String
    coverImage: ImageMedia
    title(hyphenated: Boolean): String
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
  }

  """
  A rgb color string
  """
  scalar Color

  type ContentChannel implements Node {
    id: ID!
    name: String
    description: String
    childContentChannels: [ContentChannel]
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    iconName: String
  }

  interface ContentChildNode {
    parentChannel: ContentChannel
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
  }

  interface ContentItem {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    isLiked: Boolean
    likedCount: Int
    sharing: SharableContentItem
  }

  type ContentItemsConnection {
    edges: [ContentItemsConnectionEdge]
    totalCount: Int
    pageInfo: PaginationInfo
  }

  type ContentItemsConnectionEdge {
    node: ContentItem
    cursor: String
  }

  input ContentItemsConnectionInput {
    first: Int
    after: String
  }

  interface ContentNode {
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    htmlContent: String
  }

  interface ContentParentNode {
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
  }

  type ContentSeriesContentItem implements ContentItem & Node & ContentNode & Card & VideoNode & AudioNode & ContentChildNode & ContentParentNode & ThemedNode & ProgressNode & LikableNode & ShareableNode & FeaturesNode {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    percentComplete: Float
    upNext: ContentItem
    scriptures: [Scripture]
    isLiked: Boolean
    likedCount: Int
    sharing: SharableContentItem
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  type Device implements Node {
    id: ID!
    pushId: String!
    notificationsEnabled: Boolean!
  }

  type DevotionalContentItem implements ContentItem & Node & ContentNode & Card & VideoNode & AudioNode & ContentChildNode & ContentParentNode & ThemedNode & ScriptureNode & LikableNode & ShareableNode {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    scriptures: [Scripture]
    isLiked: Boolean
    likedCount: Int
    sharing: SharableContentItem
  }

  type Event implements Node {
    id: ID!
    name: String
    description: String
    location: String
    start: String
    end: String
    image: ImageMedia
  }

  interface Feature {
    id: ID!
    order: Int
  }

  type FeatureAction {
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
    title: String
  }

  type FeatureFeed implements Node {
    id: ID!
    features: [Feature]
  }

  interface FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  enum GENDER {
    Male
    Female
    Unknown
  }

  type Group implements Node {
    id: ID!
    name: String
    leader: Person @deprecated(reason: "No longer used, use 'leaders' instead")
    leaders: [Person]
    members: [Person]
  }

  enum GROUP_TYPE {
    Serving
    Community
    Family
  }

  type HeroListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    actions: [ActionListAction]
    heroCard: CardListItem
    primaryAction: FeatureAction
  }

  type HorizontalCardListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    cards: [CardListItem]
    primaryAction: FeatureAction
  }

  type ImageMedia implements Media {
    name: String
    key: String
    sources: [ImageMediaSource]
  }

  type ImageMediaSource implements MediaSource {
    uri: String
  }

  enum InteractionAction {
    VIEW
    COMPLETE
    PRAY
  }

  input InteractionDataField {
    field: String!
    value: InteractionValue
  }

  type InteractionResult {
    success: Boolean
    node: Node
  }

  scalar InteractionValue

  interface LikableNode {
    isLiked: Boolean
    likedCount: Int
  }

  enum LIKE_OPERATION {
    Like
    Unlike
  }

  input LikeEntityInput {
    nodeId: ID!
    operation: LIKE_OPERATION!
  }

  interface LiveNode {
    liveStream: LiveStream
  }

  type LiveStream {
    isLive: Boolean
    eventStartTime: String
    media: VideoMedia
    webViewUrl: String
    contentItem: ContentItem
  }

  interface Media {
    name: String
    key: String
    sources: [MediaSource]
  }

  type MediaContentItem implements ContentItem & Node & ContentNode & Card & VideoNode & AudioNode & ContentChildNode & ContentParentNode & ThemedNode & ScriptureNode & LikableNode & ShareableNode {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    scriptures: [Scripture]
    isLiked: Boolean
    likedCount: Int
    sharing: SharableContentItem
  }

  enum MediaInputType {
    IMAGE
    VIDEO
    AUDIO
  }

  interface MediaSource {
    uri: String
  }

  type Mutation {
    _placeholder: Boolean
    updateLikeEntity(input: LikeEntityInput!): ContentItem
      @deprecated(reason: "Use the more general updateLikeNode instead")
    updateLikeNode(input: LikeEntityInput!): Node
    updateProfileField(input: UpdateProfileInput!): Person
    updateProfileFields(input: [UpdateProfileInput]!): Person
    uploadProfileImage(file: Upload!, size: Int!): Person
    authenticate(identity: String!, password: String!): Authentication
    changePassword(password: String!): Authentication
    registerPerson(
      email: String!
      password: String!
      userProfile: [UpdateProfileInput]
    ): Authentication
    requestSmsLoginPin(phoneNumber: String!): SmsPinResult
    authenticateWithSms(phoneNumber: String!, pin: String!): Authentication
    registerWithSms(
      phoneNumber: String!
      pin: String!
      userProfile: [UpdateProfileInput]
    ): Authentication
    interactWithNode(
      action: InteractionAction!
      nodeId: ID!
      data: [InteractionDataField]
    ): InteractionResult
    identifySelf(input: AnalyticsIdentifyInput!): AnalyticsResult
    trackEvent(input: AnalyticsTrackInput!): AnalyticsResult
    updateUserPushSettings(input: PushSettingsInput!): Person
    updateUserCampus(campusId: String!): Person
    addPrayer(text: String!, isAnonymous: Boolean): PrayerRequest
  }

  interface Node {
    id: ID!
  }

  type PaginationInfo {
    startCursor: String
    endCursor: String
  }

  type Pass implements Node {
    id: ID!
    type: PassType
    description: String
    logo: ImageMediaSource
    thumbnail: ImageMediaSource
    barcode: ImageMediaSource
    primaryFields: [PassField]
    secondaryFields: [PassField]
    backgroundColor: Color
    foregroundColor: Color
    labelColor: Color
    logoText: String
    passkitFileUrl: String
  }

  type PassField {
    key: String!
    label: String
    value: String!
    textAlignment: PassFieldTextAlignment
  }

  enum PassFieldTextAlignment {
    LEFT
    CENTER
    RIGHT
    NATURAL
  }

  enum PassType {
    GENERIC
  }

  type Person implements Node {
    id: ID!
    firstName: String
    lastName: String
    nickName: String
    email: String
    gender: GENDER
    birthDate: String
    photo: ImageMediaSource
    devices: [Device]
    campus: Campus
    groups(type: GROUP_TYPE, asLeader: Boolean): [Group]
  }

  type PrayerListFeature implements Feature & Node {
    id: ID!
    order: Int
    isCard: Boolean
    title: String
    subtitle: String
    prayers: [PrayerRequest]
  }

  type PrayerRequest implements Node {
    id: ID!
    text: String!
    requestor: Person
    isAnonymous: Boolean
    isPrayed: Boolean
  }

  interface ProgressNode {
    percentComplete: Float
    upNext: ContentItem
  }

  input PushSettingsInput {
    enabled: Boolean
    pushProviderUserId: String
  }

  type Query {
    _placeholder: Boolean
    node(id: ID!): Node
    likedContent(first: Int, after: String): ContentItemsConnection
    contentChannels: [ContentChannel]
    campaigns: ContentItemsConnection
    userFeed(first: Int, after: String): ContentItemsConnection
    personaFeed(first: Int, after: String): ContentItemsConnection
    currentUser: AuthenticatedUser
    userExists(identity: String): USER_AUTH_STATUS
    liveStream: LiveStream
      @deprecated(reason: "Use liveStreams, there may be multiple.")
    liveStreams: [LiveStream]
    scripture(query: String!, version: VERSION): Scripture
      @deprecated(reason: "Use 'scriptures' instead.")
    scriptures(query: String!, version: VERSION): [Scripture]
    userPass: Pass
    search(query: String!, first: Int, after: String): SearchResultsConnection
    campuses(location: CampusLocationInput): [Campus]
    userFeedFeatures: [Feature]
      @deprecated(reason: "Use homeFeedFeatures or discoverFeedFeatures")
    homeFeedFeatures(campusId: ID): FeatureFeed
    discoverFeedFeatures: FeatureFeed
  }

  type RockPersonDetails {
    authToken: String
    authCookie: String
  }

  type Scripture implements Node {
    id: ID!
    html: String
    reference: String
    copyright: String
    version: String
  }

  type ScriptureFeature implements Feature & Node {
    id: ID!
    order: Int
    scriptures: [Scripture]
    sharing: SharableFeature
  }

  interface ScriptureNode {
    scriptures: [Scripture]
  }

  type SearchResult {
    cursor: String
    title: String
    summary: String
    coverImage: ImageMedia
    node: Node
  }

  type SearchResultsConnection {
    edges: [SearchResult]
    pageInfo: PaginationInfo
  }

  interface Sharable {
    message: String
    title: String
    url: String @deprecated(reason: "Not supported on the interface")
  }

  type SharableContentItem implements Sharable {
    message: String
    title: String
    url: String
  }

  type SharableFeature implements Sharable {
    message: String
    title: String
    url: String @deprecated(reason: "Not supported on a feature")
  }

  interface ShareableNode {
    sharing: SharableContentItem
  }

  type SmsPinResult {
    success: Boolean
    userAuthStatus: USER_AUTH_STATUS
  }

  type TextFeature implements Feature & Node {
    id: ID!
    order: Int
    body: String
    sharing: SharableFeature
  }

  type Theme {
    type: ThemeType
    colors: ThemeColors
  }

  type ThemeColors {
    primary: Color
    secondary: Color
    screen: Color
    paper: Color
    alert: Color
  }

  interface ThemedNode {
    theme: Theme
  }

  enum ThemeType {
    LIGHT
    DARK
  }

  type UniversalContentItem implements ContentItem & Node & ContentNode & Card & VideoNode & AudioNode & ContentChildNode & ContentParentNode & ThemedNode & LikableNode & ShareableNode {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    isLiked: Boolean
    likedCount: Int
    sharing: SharableContentItem
  }

  enum UPDATEABLE_PROFILE_FIELDS {
    FirstName
    LastName
    Email
    NickName
    Gender
    BirthDate
  }

  input UpdateProfileInput {
    field: UPDATEABLE_PROFILE_FIELDS!
    value: String!
  }

  """
  The Upload scalar type represents a file upload.
  """
  scalar Upload

  type Url implements Node {
    url: String
    id: ID!
  }

  enum USER_AUTH_STATUS {
    NONE
    NEW_APP_USER
    EXISTING_APP_USER
  }

  enum VERSION {
    WEB
    KJV
  }

  type VerticalCardListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    isFeatured: Boolean
    cards: [CardListItem]
  }

  type VideoMedia implements Media {
    name: String
    key: String
    sources: [VideoMediaSource]
    embedHtml: String
  }

  type VideoMediaSource implements MediaSource {
    uri: String
  }

  interface VideoNode {
    videos: [VideoMedia]
  }

  type WebviewFeature implements Feature & Node {
    id: ID!
    order: Int
    linkText: String
    title: String
    url: String
  }

  type WeekendContentItem implements ContentItem & Node & ContentNode & Card & VideoNode & AudioNode & ContentChildNode & ContentParentNode & ThemedNode & LikableNode & LiveNode & ShareableNode & FeaturesNode {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    isLiked: Boolean
    likedCount: Int
    liveStream: LiveStream
    sharing: SharableContentItem
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }
`;
