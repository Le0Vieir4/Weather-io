import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || '',
      scope: ['user:email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { emails, username, photos, displayName, name } = profile;

    // GitHub provides avatar_url in _json (access via type assertion)
    const avatarUrl = (profile as any)._json?.avatar_url || photos?.[0]?.value || '';

    // Use the name object from profile if available, or parse displayName
    const givenName = name?.givenName || displayName?.split(' ')[0] || username || '';
    const familyName = name?.familyName || displayName?.split(' ').slice(1).join(' ') || '';

    // Construct the user object
    const user = {
      email: emails?.[0]?.value || '',
      username: username || displayName || '',
      picture: avatarUrl,
      provider: 'github',
      name: {
        givenName,
        familyName,
      },
    };

    return user;
  }
}
