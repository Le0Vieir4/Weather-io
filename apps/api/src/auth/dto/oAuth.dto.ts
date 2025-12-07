export interface OauthUserDto {
  email: string;
  username: string;
  picture?: string;
  provider: string; // 'google' or 'github'
  name: {
    givenName: string;
    familyName: string;
  };
}
