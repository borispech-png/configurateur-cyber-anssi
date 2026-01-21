import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '../package.json');
const versionFilePath = path.join(__dirname, '../version.ts');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Get current date formatted as DD/MM/YYYY
const date = new Date();
const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

const content = `export const APP_VERSION = "${version}";
export const BUILD_DATE = "${formattedDate}";
`;

fs.writeFileSync(versionFilePath, content);

console.log(`Updated version.ts: v${version} - ${formattedDate}`);
