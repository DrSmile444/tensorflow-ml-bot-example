import type { JWTInput } from 'google-auth-library';
import { auth } from 'google-auth-library';
import type { sheets_v4 } from 'googleapis';
import { google } from 'googleapis';

import { environmentConfig } from '../config';

export class GoogleClientService {
  sheets: sheets_v4.Sheets;

  constructor() {
    const KEYS = JSON.parse(environmentConfig.GOOGLE_SHEET_API_KEYS) as JWTInput;
    const client = auth.fromJSON(KEYS);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    google.options({ auth: client });

    this.sheets = google.sheets('v4');
  }
}

export const googleClientService = new GoogleClientService();
