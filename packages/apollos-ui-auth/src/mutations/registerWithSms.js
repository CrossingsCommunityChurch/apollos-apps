import { gql } from '@apollo/client';

export default gql`
  mutation registerWithSms(
    $identity: String!
    $password: String!
    $userProfile: [UpdateProfileInput]
  ) {
    registerWithSms(
      phoneNumber: $identity
      pin: $password
      userProfile: $userProfile
    ) {
      token
      user {
        id
        profile {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
