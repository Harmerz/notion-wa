const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function queryDatabase(databaseId) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        "filter": {
                "property": "Status",
                "status": {
                    "equals": 'Not Started' || 'On Progress'
                }
        }
      });  
        return response.results;
    } catch (error){
        console.log(error.body);
    }
}


export default function handler(req, res) {
    let pesan = 'Hallo Haikal, your task this week is: \n'
    queryDatabase(databaseId)
        .then(result => {
            result.forEach((page, index) => {
                let name = page?.properties?.Name?.title[0]?.plain_text;
                let startDate = page?.properties?.Date?.date?.start;
                let endDate = page?.properties?.Date?.date?.end;
                let status = page?.properties?.Status?.status?.name;
                let description = page?.properties?.Catatan?.rich_text[0]?.plain_text;
                let tag = page?.properties?.Tags?.multi_select?.map(tag => " " + tag?.name );
                let list = name;
                if (endDate) {
                    list += " (Deadline: " + endDate + ")";
                } else if (startDate) {
                    list += " (Deadline: " + startDate + ")";
                }
                if (status) {
                    if (status == 'Not Started') {
                        status = 'Belum Dikerjakan'
                    } else if (status == 'On Progress') {
                        status = 'Sedang Dikerjakan'
                    } 
                }
                if (description) {
                    list += " (Description: " + description + ")";
                }
                if (tag) {
                    list += " (Tag:" + tag + ")";
                }
                if (name) {
                    pesan = pesan + (index+1) + ". " + list + "\n";
                }
            }
            );
            client.messages
            .create({
                body: pesan,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+62895367597379'
            })
            .then(message => console.log(message.sid))
        
            res.send(pesan);
             
    });
}