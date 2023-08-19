const dotenv = require('dotenv')
const { Client } = require('@notionhq/client')
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const databaseIdTeam = process.env.NOTION_DATABASE_ID_TEAM

async function queryDatabase(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        status: {
          equals: 'Not Started' || 'On Progress',
        },
      },
    })
    return response.results
  } catch (error) {
    console.log(error.body)
  }
}

const express = require('express')

const app = express()

app.listen(4000, () => console.log('Server listening at port 4000'))
// [ ' Harmerz' ]
// [ ' Marsa Sahasrakirana' ]
// [ ' azfar.azdi.arfakhsyad@gmail.com' ]
// [ ' Harmerz' ]
// [ ' Laksita Kirana' ]
// [ ' Davin Adiwidya' ]
app.get('/', (req, res) => {
  let pesan = 'Hallo Haikal, your task this week is: %0A'
  queryDatabase(databaseIdTeam).then((result) => {
    console.log(result)
    result.forEach((page, index) => {
      let name = page?.properties?.Name?.title[0]?.plain_text
      let startDate = page?.properties?.Date?.date?.start
      let endDate = page?.properties?.Date?.date?.end
      let status = page?.properties?.Status?.status?.name
      let description = page?.properties?.Catatan?.rich_text[0]?.plain_text
      let tag = page?.properties?.Tags?.multi_select?.map((tag) => ' ' + tag?.name)
      let Person = page?.properties?.Person?.people?.map((person) => ' ' + person?.name)
      let list = name
      if (endDate) {
        const date = new Date(endDate).toString().split(' ')
        list += ' (Deadline: ' + date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3] + ')'
      } else if (startDate) {
        const date = new Date(startDate)
        list += ' (Deadline: ' + date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3] + ')'
      }
      if (status) {
        let stat = ''
        if (status == 'Not started') {
          stat = 'Belum Dikerjakan'
        } else if (status == 'In progress') {
          stat = 'Sedang Dikerjakan'
        }
        list += ' (Status: ' + stat + ')'
      }
      if (description) {
        list += ' (Description: ' + description + ')'
      }
      if (tag && tag.length > 0) {
        list += ' (Tag:' + tag + ')'
      }
      if (name) {
        pesan = pesan + (index + 1) + '. ' + list + '%0A'
      }
    })
    console.log(pesan)
    res.send(result)
  })
})

app.get('/kirimteam', (req, res) => {
  let pesanHaikal = 'Hallo Haikal, your unfinished task is: %0A'
  let pesanAdi = 'Hallo Adi, your unfinished task is: %0A'
  let pesanAzfar = 'Hallo Azfar, your unfinished task is: %0A'
  let pesanLaksita = 'Hallo Laksita, your unfinished task is: %0A'
  let pesanMarsa = 'Hallo Marsa, your unfinished task is: %0A'
  queryDatabase(databaseIdTeam).then((result) => {
    result.forEach((page) => {
      let name = page?.properties?.Name?.title[0]?.plain_text
      let startDate = page?.properties?.Date?.date?.start
      let endDate = page?.properties?.Date?.date?.end
      let status = page?.properties?.Status?.status?.name
      let description = page?.properties?.Catatan?.rich_text[0]?.plain_text
      let tag = page?.properties?.Tags?.multi_select?.map((tag) => ' ' + tag?.name)
      let Person = page?.properties?.Person?.people?.map((person) => ' ' + person?.name)
      let list = name
      console.log(Person)
      if (endDate) {
        const date = new Date(endDate).toString().split(' ')
        list += ' (Deadline: ' + date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3] + ')'
      } else if (startDate) {
        const date = new Date(startDate).toString().split(' ')
        list += ' (Deadline: ' + date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3] + ')'
      }
      if (status) {
        let stat = ''
        if (status == 'Not started') {
          stat = 'Belum Dikerjakan'
        } else if (status == 'In progress') {
          stat = 'Sedang Dikerjakan'
        }
        list += ' (Status: ' + stat + ')'
      }
      if (description) {
        list += ' (Description: ' + description + ')'
      }
      if (tag && tag.length > 0) {
        list += ' (Tag:' + tag + ')'
      }
      if (name) {
        if (Person.includes(' Harmerz')) {
          pesanHaikal = pesanHaikal + (pesanHaikal.match(/%0A/g) || []).length + '. ' + list + '%0A'
        }
        if (Person.includes(' Davin Adiwidya')) {
          pesanAdi = pesanAdi + (pesanAdi.match(/%0A/g) || []).length + '. ' + list + '%0A'
        }
        if (Person.includes(' Marsa Sahasrakirana')) {
          pesanMarsa = pesanMarsa + (pesanMarsa.match(/%0A/g) || []).length + '. ' + list + '%0A'
        }
        if (Person.includes(' Laksita Kirana')) {
          pesanLaksita =
            pesanLaksita + (pesanLaksita.match(/%0A/g) || []).length + '. ' + list + '%0A'
        }
        if (Person.includes(' azfar.azdi.arfakhsyad@gmail.com')) {
          pesanAzfar = pesanAzfar + (pesanAzfar.match(/%0A/g) || []).length + '. ' + list + '%0A'
        }
      }
    })
    if ((pesanHaikal.match(/%0A/g) || []).length > 1) {
      // Harmerz
      axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=62895367597379&text=${pesanHaikal}&apikey=4512480`,
      )
    }
    if ((pesanAdi.match(/%0A/g) || []).length > 1) {
      // Adi
      axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=6282302088911&text=${pesanAdi}&apikey=8851278`,
      )
    }
    if ((pesanAzfar.match(/%0A/g) || []).length > 1) {
      // Azfar
      axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=6282228317397&text=${pesanAzfar}&apikey=6456496`,
      )
    }
    if ((pesanLaksita.match(/%0A/g) || []).length > 1) {
      // Laksita
      axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=62895378119815&text=${pesanLaksita}&apikey=6857261`,
      )
    }
    if ((pesanMarsa.match(/%0A/g) || []).length > 1) {
      // Marsa
      axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=6287738834114&text=${pesanMarsa}&apikey=7317012`,
      )
    }
    res.send([pesanHaikal, pesanAdi, pesanAzfar, pesanLaksita, pesanMarsa])
  })
})

app.get('/cekdeadlineteam', (req, res) => {
  let pesanHaikal = 'Hallo Haikal, *Tommorow Deadline* task is: %0A'
  let pesanAdi = 'Hallo Adi, *Tommorow Deadline* task is: %0A'
  let pesanAzfar = 'Hallo Azfar, *Tommorow Deadline* task is: %0A'
  let pesanLaksita = 'Hallo Laksita, *Tommorow Deadline* task is: %0A'
  let pesanMarsa = 'Hallo Marsa, *Tommorow Deadline* task is: %0A'
  queryDatabase(databaseIdTeam).then(async (result) => {
    result.forEach((page, index) => {
      let name = page?.properties?.Name?.title[0]?.plain_text
      let startDate = page?.properties?.Date?.date?.start
      let endDate = page?.properties?.Date?.date?.end
      let status = page?.properties?.Status?.status?.name
      let description = page?.properties?.Catatan?.rich_text[0]?.plain_text
      let tag = page?.properties?.Tags?.multi_select?.map((tag) => ' ' + tag?.name)
      let Person = page?.properties?.Person?.people?.map((person) => ' ' + person?.name)
      let list = name
      const ThisDate = new Date()
      const date = new Date(endDate ?? startDate)
      let diffTime = date.getTime() - ThisDate.getTime()
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays == 1) {
        list += ' (Deadline: Besok Banget)'
        if (status) {
          let stat = ''
          if (status == 'Not started') {
            stat = 'Belum Dikerjakan'
          } else if (status == 'In progress') {
            stat = 'Sedang Dikerjakan'
          }
          list += ' (Status: ' + stat + ')'
        }
        if (description) {
          list += ' (Description: ' + description + ')'
        }
        if (tag && tag.length > 0) {
          list += ' (Tag:' + tag + ')'
        }
        if (name) {
          if (Person.includes(' Harmerz')) {
            pesanHaikal =
              pesanHaikal + (pesanHaikal.match(/%0A/g) || []).length + '. ' + list + '%0A'
          }
          if (Person.includes(' Davin Adiwidya')) {
            pesanAdi = pesanAdi + (pesanAdi.match(/%0A/g) || []).length + '. ' + list + '%0A'
          }
          if (Person.includes(' Marsa Sahasrakirana')) {
            pesanMarsa = pesanMarsa + (pesanMarsa.match(/%0A/g) || []).length + '. ' + list + '%0A'
          }
          if (Person.includes(' Laksita Kirana')) {
            pesanLaksita =
              pesanLaksita + (pesanLaksita.match(/%0A/g) || []).length + '. ' + list + '%0A'
          }
          if (Person.includes(' azfar.azdi.arfakhsyad@gmail.com')) {
            pesanAzfar = pesanAzfar + (pesanAzfar.match(/%0A/g) || []).length + '. ' + list + '%0A'
          }
        }
      }
    })
    if ((pesanHaikal.match(/%0A/g) || []).length > 1) {
      // Harmerz
      await axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=62895367597379&text=${pesanHaikal}&apikey=4512480`,
      )
    }
    if ((pesanAdi.match(/%0A/g) || []).length > 1) {
      // Adi
      await axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=6282302088911&text=${pesanAdi}&apikey=8851278`,
      )
    }
    if ((pesanAzfar.match(/%0A/g) || []).length > 1) {
      // Azfar
      await axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=6282228317397&text=${pesanAzfar}&apikey=6456496`,
      )
    }
    if ((pesanLaksita.match(/%0A/g) || []).length > 1) {
      // Laksita
      await axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=62895378119815&text=${pesanLaksita}&apikey=6857261`,
      )
    }
    if ((pesanMarsa.match(/%0A/g) || []).length > 1) {
      // Marsa
      await axios.post(
        `https://api.callmebot.com/whatsapp.php?phone=6287738834114&text=${pesanMarsa}&apikey=7317012`,
      )
    }
    res.send([pesanAdi, pesanAzfar, pesanHaikal, pesanLaksita, pesanMarsa])
  })
})

app.get('/kirim', (req, res) => {
  let pesan = 'Hallo Haikal, your *Personal Task* is: %0A'
  queryDatabase(databaseId).then((result) => {
    result.forEach((page, index) => {
      let name = page?.properties?.Name?.title[0]?.plain_text
      let startDate = page?.properties?.Date?.date?.start
      let endDate = page?.properties?.Date?.date?.end
      let status = page?.properties?.Status?.status?.name
      let description = page?.properties?.Catatan?.rich_text[0]?.plain_text
      let tag = page?.properties?.Tags?.multi_select?.map((tag) => ' ' + tag?.name)
      let list = name
      if (endDate) {
        list += ' (Deadline: ' + endDate + ')'
      } else if (startDate) {
        list += ' (Deadline: ' + startDate + ')'
      }
      if (status) {
        if (status == 'Not Started') {
          status = 'Belum Dikerjakan'
        } else if (status == 'On Progress') {
          status = 'Sedang Dikerjakan'
        }
      }
      if (description) {
        list += ' (Description: ' + description + ')'
      }
      if (tag) {
        list += ' (Tag:' + tag + ')'
      }
      if (name) {
        pesan = pesan + (index + 1) + '. ' + list + '%0A'
      }
    })
    axios.post(
      `https://api.callmebot.com/whatsapp.php?phone=62895367597379&text=${pesan}&apikey=4512480`,
    )
    res.send(pesan)
  })
})
const schedule = require('node-schedule')
const { default: axios } = require('axios')

schedule.scheduleJob('* * * * 1', function () {
  let pesan = '[Weekly] %0A Hallo Haikal, your task this week is: %0A'
  queryDatabase(databaseId).then((result) => {
    result.forEach((page, index) => {
      let name = page?.properties?.Name?.title[0]?.plain_text
      let startDate = page?.properties?.Date?.date?.start
      let endDate = page?.properties?.Date?.date?.end
      let status = page?.properties?.Status?.status?.name
      let description = page?.properties?.Catatan?.rich_text[0]?.plain_text
      let tag = page?.properties?.Tags?.multi_select?.map((tag) => ' ' + tag?.name)
      let list = name
      if (endDate) {
        list += ' (Deadline: ' + endDate + ')'
      } else if (startDate) {
        list += ' (Deadline: ' + startDate + ')'
      }
      if (status) {
        if (status == 'Not Started') {
          status = 'Belum Dikerjakan'
        } else if (status == 'On Progress') {
          status = 'Sedang Dikerjakan'
        }
      }
      if (description) {
        list += ' (Description: ' + description + ')'
      }
      if (tag) {
        list += ' (Tag:' + tag + ')'
      }
      if (name) {
        pesan = pesan + (index + 1) + '. ' + list + '%0A'
      }
    })
    axios.post(
      `https://api.callmebot.com/whatsapp.php?phone=62895367597379&text=${pesan}&apikey=4512480`,
    )
  })
})

schedule.scheduleJob('*/45 * * * *', function () {
  console.log('Scheduler is running')
  let pesan = '[Setiap 45 Menit] %0A Hallo Haikal, your task this Day is: %0A'
  queryDatabase(databaseId).then((result) => {
    result.forEach((page, index) => {
      let name = page?.properties?.Name?.title[0]?.plain_text
      let startDate = page?.properties?.Date?.date?.start
      let endDate = page?.properties?.Date?.date?.end
      let status = page?.properties?.Status?.status?.name
      let description = page?.properties?.Catatan?.rich_text[0]?.plain_text
      let tag = page?.properties?.Tags?.multi_select?.map((tag) => ' ' + tag?.name)
      let list = name
      if (endDate) {
        list += ' (Deadline: ' + endDate + ')'
      } else if (startDate) {
        list += ' (Deadline: ' + startDate + ')'
      }
      if (status) {
        if (status == 'Not Started') {
          status = 'Belum Dikerjakan'
        } else if (status == 'On Progress') {
          status = 'Sedang Dikerjakan'
        }
      }
      if (description) {
        list += ' (Description: ' + description + ')'
      }
      if (tag) {
        list += ' (Tag:' + tag + ')'
      }
      if (name) {
        pesan = pesan + (index + 1) + '. ' + list + '%0A'
      }
    })
    axios.post(
      `https://api.callmebot.com/whatsapp.php?phone=62895367597379&text=${pesan}&apikey=4512480`,
    )
  })
})
