import { Injectable, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SpreadsheetService implements OnModuleInit {
    private sheetsClient;

    async onModuleInit() {
        await this.initializeGoogleSheets();
    }

    async initializeGoogleSheets() {
        const keyFile = {
            "type": "service_account",
            "project_id": "melodic-gamma-450901-c4",
            "private_key_id": "1d4c7d57480eebcf985bc80cb7054cbf56556c9b",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0DrIitMjWOXnr\n8iKvvUsjGUQs1cltR9JzscMPDNYgtFU06gu1CQjRz1OnP3IwVBMTiatRuIYF5VJl\n5NQ5velT8K3itVw4PDL/p9vFe7OhBZ7MJtIp8LGoB+skXPBzC5YpFJmfcMSQrX3u\nMbk4EMXMl7hg5gJCvv1nRdc5ShGy2rqtrxDsbOVqQeMx4FAtB9U7EENc3s6eAEDI\nDE10rLESm/fq+CrSllpXB/rm/YXy9e5rsVvwsbP+nS6F26cEockjFZLJz07Uvj92\nxoBnqNnYybou3+ghcP0XYqZnBC/vNhEj85V2Bu1IUExW6ykEV5F2TuNAq8WlfQKV\nCTKRZ0JHAgMBAAECggEAHfpcZN7d7pzUfxi/TFcjIrgwMO7J1yygDgHIohbXB8w+\na3g+yWi0U9+a4+ZHqA2MvNys7gbfeYJ8Ei7juVa0eZ9BXtTR182zXVFLNo6pPOPn\nU8Ia4j9gChksvc8jfA6vyi3TLfKOfNqwdBn0kTBps5iHFXWgvBAkYdoE7VWMViSW\nRyRU0TwuUzZU/bIucVji+nUnQgtaFOE68ibJ4DWYsWCNUg+yqBg7AQAvRKernSAM\nlSoFtsm38AA2rcPD3RctuWjt0lhFhoPHMxZeqzITTAu2oHkjLvwgyaxs16UwRh6b\nwI1I0vlHHxuFrqJKgakok5/QNPp0fdiuIDtO1SfJ4QKBgQDmrNUx0szqUOqnLGYt\nOo9N/DHANDMh4GwA5BphjvW2HT/VRLs1EkCBxl5jVG3ckIaqW+jKgkD3o3ZtDqSq\nyxyxi8W2nPXyPogQ1aYlBOH+Kdy/VWtFqdxXveGcqaOTuRaIZCRlWZO/OS9EpO9O\nCA1V52FX0fhO4y5/B1nhzCW9qQKBgQDH0z4Z990F891WbFJrkJaNRGcxK7TSajI6\n5lQl0x00stsAKWWwQx9DeaxasVo1kuYpZWuvfZAoWYVqiEDZEwyes6t5HuUYe2c9\nX9maDgfh/+BrekDCv2vb4S3MiLJubh0c4DGR/OYwCVehdeQN0hUIAIlh1ucrrI20\ngTdmiEGWbwKBgQC5kqM0oOSPQKd188cDbc/pqhCQEq5r+3KHyPncMDlF2AQJW3DL\nwjI49M/sUvjK704W8Te26tC/KDbWh2g7qokb4FkfjuhhiKLIAEjYETSJ1z2qg1p4\nQa1svOoqsWJSLh2Nfhq1mjm9JZD8RT/rY5ju2eS61MVRGXzHXq+VcjmOeQKBgGY6\nc/LlE3YQJJQqJqBRADSVYhWNvpxHKBtp6nLPZomnVtLmWtep/zyN6tcbFIOD+6wB\n7u2A11dNNSwjOMnVLQej832riJjVySNk/fYKZ43/UdiqWqdHNu7ubHfPFznXq50y\nNSnyr/CzVtmLbniDma7WV3JudyWoyXYnBSi3XJaRAoGAKvPLGNs/gVsiaxy/eI1A\nj/JUfplMsVF4ugDUtYYP2E9RCYXXtukejMhHboLcRjFbVLH6UC4PZb/Zl2AB8bG1\nQofzp80sxdKcpkLdCxnWzi96SGSfGx9ydVhYZA5Xav0ehW3OlL1yjZmvtRpqtbM5\nT5nhnQtdJi3S6EsnOc6aovg=\n-----END PRIVATE KEY-----\n",
            "client_email": "lkpd-722@melodic-gamma-450901-c4.iam.gserviceaccount.com",
            "client_id": "112148441649015497619",
            "universe_domain": "googleapis.com"
        };

        const auth = await google.auth.getClient({
            credentials: {
                client_email: keyFile.client_email,
                private_key: keyFile.private_key.replace(/\\n/g, '\n'), // Fixes newline issue
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheetsClient = google.sheets({ version: 'v4', auth: auth });
    }

    async getSheetData(spreadsheetId: string, range: string) {
        const response = await this.sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values;
    }

    async appendSheetData(spreadsheetId: string, range: string, values: any[][]) {
        const response = await this.sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: { values },
        });
        return response.data;
    }

    async setCellFormatting(spreadsheetId: string, range: string, formatting: any) {
        const keyFile = {
            "type": "service_account",
            "project_id": "melodic-gamma-450901-c4",
            "private_key_id": "1d4c7d57480eebcf985bc80cb7054cbf56556c9b",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0DrIitMjWOXnr\n8iKvvUsjGUQs1cltR9JzscMPDNYgtFU06gu1CQjRz1OnP3IwVBMTiatRuIYF5VJl\n5NQ5velT8K3itVw4PDL/p9vFe7OhBZ7MJtIp8LGoB+skXPBzC5YpFJmfcMSQrX3u\nMbk4EMXMl7hg5gJCvv1nRdc5ShGy2rqtrxDsbOVqQeMx4FAtB9U7EENc3s6eAEDI\nDE10rLESm/fq+CrSllpXB/rm/YXy9e5rsVvwsbP+nS6F26cEockjFZLJz07Uvj92\nxoBnqNnYybou3+ghcP0XYqZnBC/vNhEj85V2Bu1IUExW6ykEV5F2TuNAq8WlfQKV\nCTKRZ0JHAgMBAAECggEAHfpcZN7d7pzUfxi/TFcjIrgwMO7J1yygDgHIohbXB8w+\na3g+yWi0U9+a4+ZHqA2MvNys7gbfeYJ8Ei7juVa0eZ9BXtTR182zXVFLNo6pPOPn\nU8Ia4j9gChksvc8jfA6vyi3TLfKOfNqwdBn0kTBps5iHFXWgvBAkYdoE7VWMViSW\nRyRU0TwuUzZU/bIucVji+nUnQgtaFOE68ibJ4DWYsWCNUg+yqBg7AQAvRKernSAM\nlSoFtsm38AA2rcPD3RctuWjt0lhFhoPHMxZeqzITTAu2oHkjLvwgyaxs16UwRh6b\nwI1I0vlHHxuFrqJKgakok5/QNPp0fdiuIDtO1SfJ4QKBgQDmrNUx0szqUOqnLGYt\nOo9N/DHANDMh4GwA5BphjvW2HT/VRLs1EkCBxl5jVG3ckIaqW+jKgkD3o3ZtDqSq\nyxyxi8W2nPXyPogQ1aYlBOH+Kdy/VWtFqdxXveGcqaOTuRaIZCRlWZO/OS9EpO9O\nCA1V52FX0fhO4y5/B1nhzCW9qQKBgQDH0z4Z990F891WbFJrkJaNRGcxK7TSajI6\n5lQl0x00stsAKWWwQx9DeaxasVo1kuYpZWuvfZAoWYVqiEDZEwyes6t5HuUYe2c9\nX9maDgfh/+BrekDCv2vb4S3MiLJubh0c4DGR/OYwCVehdeQN0hUIAIlh1ucrrI20\ngTdmiEGWbwKBgQC5kqM0oOSPQKd188cDbc/pqhCQEq5r+3KHyPncMDlF2AQJW3DL\nwjI49M/sUvjK704W8Te26tC/KDbWh2g7qokb4FkfjuhhiKLIAEjYETSJ1z2qg1p4\nQa1svOoqsWJSLh2Nfhq1mjm9JZD8RT/rY5ju2eS61MVRGXzHXq+VcjmOeQKBgGY6\nc/LlE3YQJJQqJqBRADSVYhWNvpxHKBtp6nLPZomnVtLmWtep/zyN6tcbFIOD+6wB\n7u2A11dNNSwjOMnVLQej832riJjVySNk/fYKZ43/UdiqWqdHNu7ubHfPFznXq50y\nNSnyr/CzVtmLbniDma7WV3JudyWoyXYnBSi3XJaRAoGAKvPLGNs/gVsiaxy/eI1A\nj/JUfplMsVF4ugDUtYYP2E9RCYXXtukejMhHboLcRjFbVLH6UC4PZb/Zl2AB8bG1\nQofzp80sxdKcpkLdCxnWzi96SGSfGx9ydVhYZA5Xav0ehW3OlL1yjZmvtRpqtbM5\nT5nhnQtdJi3S6EsnOc6aovg=\n-----END PRIVATE KEY-----\n",
            "client_email": "lkpd-722@melodic-gamma-450901-c4.iam.gserviceaccount.com",
            "client_id": "112148441649015497619",
            "universe_domain": "googleapis.com"
        };

        const auth = await google.auth.getClient({
            credentials: {
                client_email: keyFile.client_email,
                private_key: keyFile.private_key.replace(/\\n/g, '\n'), // Fixes newline issue
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth: auth });

        const requests = [{
            repeatCell: {
                range: {
                    sheetId: await this.getSheetId(spreadsheetId, range.split('!')[0]),
                    startRowIndex: 0, // Apply to all rows
                    startColumnIndex: 6, // "Nilai Kuis" is column G (Index starts at 0)
                    endColumnIndex: 7
                },
                cell: {
                    userEnteredFormat: formatting
                },
                fields: 'userEnteredFormat(wrapStrategy)'
            }
        }];

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: { requests }
        });
    }

    private async getSheetId(spreadsheetId: string, sheetName: string): Promise<number> {
        const keyFile = {
            "type": "service_account",
            "project_id": "melodic-gamma-450901-c4",
            "private_key_id": "1d4c7d57480eebcf985bc80cb7054cbf56556c9b",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0DrIitMjWOXnr\n8iKvvUsjGUQs1cltR9JzscMPDNYgtFU06gu1CQjRz1OnP3IwVBMTiatRuIYF5VJl\n5NQ5velT8K3itVw4PDL/p9vFe7OhBZ7MJtIp8LGoB+skXPBzC5YpFJmfcMSQrX3u\nMbk4EMXMl7hg5gJCvv1nRdc5ShGy2rqtrxDsbOVqQeMx4FAtB9U7EENc3s6eAEDI\nDE10rLESm/fq+CrSllpXB/rm/YXy9e5rsVvwsbP+nS6F26cEockjFZLJz07Uvj92\nxoBnqNnYybou3+ghcP0XYqZnBC/vNhEj85V2Bu1IUExW6ykEV5F2TuNAq8WlfQKV\nCTKRZ0JHAgMBAAECggEAHfpcZN7d7pzUfxi/TFcjIrgwMO7J1yygDgHIohbXB8w+\na3g+yWi0U9+a4+ZHqA2MvNys7gbfeYJ8Ei7juVa0eZ9BXtTR182zXVFLNo6pPOPn\nU8Ia4j9gChksvc8jfA6vyi3TLfKOfNqwdBn0kTBps5iHFXWgvBAkYdoE7VWMViSW\nRyRU0TwuUzZU/bIucVji+nUnQgtaFOE68ibJ4DWYsWCNUg+yqBg7AQAvRKernSAM\nlSoFtsm38AA2rcPD3RctuWjt0lhFhoPHMxZeqzITTAu2oHkjLvwgyaxs16UwRh6b\nwI1I0vlHHxuFrqJKgakok5/QNPp0fdiuIDtO1SfJ4QKBgQDmrNUx0szqUOqnLGYt\nOo9N/DHANDMh4GwA5BphjvW2HT/VRLs1EkCBxl5jVG3ckIaqW+jKgkD3o3ZtDqSq\nyxyxi8W2nPXyPogQ1aYlBOH+Kdy/VWtFqdxXveGcqaOTuRaIZCRlWZO/OS9EpO9O\nCA1V52FX0fhO4y5/B1nhzCW9qQKBgQDH0z4Z990F891WbFJrkJaNRGcxK7TSajI6\n5lQl0x00stsAKWWwQx9DeaxasVo1kuYpZWuvfZAoWYVqiEDZEwyes6t5HuUYe2c9\nX9maDgfh/+BrekDCv2vb4S3MiLJubh0c4DGR/OYwCVehdeQN0hUIAIlh1ucrrI20\ngTdmiEGWbwKBgQC5kqM0oOSPQKd188cDbc/pqhCQEq5r+3KHyPncMDlF2AQJW3DL\nwjI49M/sUvjK704W8Te26tC/KDbWh2g7qokb4FkfjuhhiKLIAEjYETSJ1z2qg1p4\nQa1svOoqsWJSLh2Nfhq1mjm9JZD8RT/rY5ju2eS61MVRGXzHXq+VcjmOeQKBgGY6\nc/LlE3YQJJQqJqBRADSVYhWNvpxHKBtp6nLPZomnVtLmWtep/zyN6tcbFIOD+6wB\n7u2A11dNNSwjOMnVLQej832riJjVySNk/fYKZ43/UdiqWqdHNu7ubHfPFznXq50y\nNSnyr/CzVtmLbniDma7WV3JudyWoyXYnBSi3XJaRAoGAKvPLGNs/gVsiaxy/eI1A\nj/JUfplMsVF4ugDUtYYP2E9RCYXXtukejMhHboLcRjFbVLH6UC4PZb/Zl2AB8bG1\nQofzp80sxdKcpkLdCxnWzi96SGSfGx9ydVhYZA5Xav0ehW3OlL1yjZmvtRpqtbM5\nT5nhnQtdJi3S6EsnOc6aovg=\n-----END PRIVATE KEY-----\n",
            "client_email": "lkpd-722@melodic-gamma-450901-c4.iam.gserviceaccount.com",
            "client_id": "112148441649015497619",
            "universe_domain": "googleapis.com"
        };

        const auth = await google.auth.getClient({
            credentials: {
                client_email: keyFile.client_email,
                private_key: keyFile.private_key.replace(/\\n/g, '\n'), // Fixes newline issue
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth: auth });
        const response = await sheets.spreadsheets.get({ spreadsheetId });

        const sheet = response.data.sheets?.find(s => s.properties?.title === sheetName);
        if (!sheet || !sheet.properties?.sheetId) throw new Error(`Sheet ${sheetName} not found`);

        return sheet.properties.sheetId;
    }

    async createOrUpdateSheet(spreadsheetId: string, sheetTitle: string) {
        try {
            const sheetInfo = await this.sheetsClient.spreadsheets.get({ spreadsheetId });
            console.log("sheetInfo =>", sheetInfo.data.sheets);

            const sheet = sheetInfo.data.sheets?.find(sheet => sheet.properties?.title === sheetTitle);

            if (sheet && sheet.properties?.sheetId) {
                console.log(`Sheet "${sheetTitle}" already exists. Clearing contents instead.`);

                // Step 1: Clear the existing sheet instead of deleting it
                await this.sheetsClient.spreadsheets.values.clear({
                    spreadsheetId,
                    range: `${sheetTitle}!A1:Z1000`, // Adjust range as needed
                });

                return { message: `Sheet "${sheetTitle}" cleared successfully.` };
            }

            // Step 2: If the sheet doesn't exist, create it
            const response = await this.sheetsClient.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: { title: sheetTitle },
                        },
                    }],
                },
            });

            console.log(`Sheet "${sheetTitle}" created successfully!`);
            return response.data;
        } catch (error) {
            console.error(`Error creating/updating sheet "${sheetTitle}":`, error.message);
            throw new Error(`Failed to create/update sheet: ${sheetTitle}`);
        }
    }

}