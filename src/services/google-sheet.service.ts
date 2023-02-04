import type { sheets_v4 } from 'googleapis';

import type { GoogleClientService } from './google-client.service';
import { googleClientService } from './google-client.service';

export class GoogleSheetService {
  sheets: sheets_v4.Sheets;

  constructor(googleClient: GoogleClientService) {
    this.sheets = googleClient.sheets;
  }

  getSheet(spreadsheetId: string, sheetName: string, range: string) {
    return this.sheets.spreadsheets.values
      .get({
        spreadsheetId,
        range: `${sheetName}!${range}`,
      })
      .then((result) => (result.data.values || []).map((row) => row[0] as string));
  }
}

export const googleSheetService = new GoogleSheetService(googleClientService);
