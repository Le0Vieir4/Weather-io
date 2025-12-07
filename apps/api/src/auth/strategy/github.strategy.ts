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

  validate(profile: Profile) {
    const { emails, username, photos, displayName } = profile;

    // Extract name from displayName or use username as fallback
    const nameParts = displayName?.split(' ') || [username || ''];
    const givenName = nameParts[0] || username || '';
    const familyName = nameParts.slice(1).join(' ') || '';

    // Construct the user object
    const user = {
      email: emails?.[0]?.value || '',
      username: username || displayName || '',
      picture: photos?.[0]?.value || '',
      provider: 'github',
      name: {
        givenName,
        familyName,
      },
    };

    return user;
  }
}
