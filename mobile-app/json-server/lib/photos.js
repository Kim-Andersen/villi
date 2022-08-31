require ('dotenv').config();
const https = require('https');
const request = require('sync-request');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve, normalize } = require('path');
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const JSON_FILE_PATH = normalize(resolve(__dirname,'photos.json'));

let photos;
if (existsSync(JSON_FILE_PATH)) {
  photos = JSON.parse(readFileSync(JSON_FILE_PATH));
  console.log(`Using ${photos.length} cached photos.`);
} else {
  console.log('Fetching photos from Unsplash API...');
  const params = new URLSearchParams({ 
    client_id: UNSPLASH_API_KEY,
    per_page: 30,
    orientation: 'squarish',
    query: 'produce people'
    });
  const res = request('GET', `https://api.unsplash.com/search/photos?${params}`);
  const json = JSON.parse(res.getBody('utf8'))
  photos = json.results.map(x => x.urls.small_s3);
  console.log('photos', photos);
  writeFileSync(JSON_FILE_PATH, JSON.stringify(photos, null, 2), 'utf-8');
}
module.exports = photos;