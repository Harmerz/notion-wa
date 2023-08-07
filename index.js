const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function queryDatabase(databaseId) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        "filter": {
                "property": "Status",
                "status": {
                    "equals": 'Not Started'
                }
        }
      });  
        return response.results;
    } catch (error){
        console.log(error.body);
    }
}

queryDatabase(databaseId)
    .then(result => {
        console.log(result);
    });