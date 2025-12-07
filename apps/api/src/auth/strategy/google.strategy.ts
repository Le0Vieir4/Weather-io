import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['email', 'profile'],
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
      provider: 'google',
      name: {
        givenName,
        familyName,
      },
    };
    return user;
  }
}
