const express = require('express')
const XLSX = require('xlsx')
const upload = require('../multer/main')
const userfile = require('../models/userfile')
const path = require('path')
const mime = require('mime')
const xl = require('excel4node')
const fs = require('fs')

const router = new express.Router()

router.post('/fileupload', upload.single('fileupload'), async (req, res) => {

    const fileLocation = await req.file.path

    const workbook = await XLSX.readFile(fileLocation)

    const sheet_name_list = await workbook.SheetNames

    const obj = await XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])


    for (var i = 0; i < obj.length; i++) {
        var sheet = obj[i]

        const fileuploaddata = new userfile({
            name: sheet.name,
            email: sheet.email,
            phone: sheet.phone,
            age: sheet.age,
            employee_id: sheet.employee_id
        })

        await fileuploaddata.save()
    }


    await fs.unlink(fileLocation, () => {
        console.log('file removed')
    })
    res.status(200).send({ sucess: 'upload sucess' })

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.get('/writeexceldata', async (req, res) => {

   const value = await userfile.find({})

   const book = []
    value.forEach((fill) => {
        const data = ({
           _id: fill._id.toString(),
           name: fill.name,
           email: fill.email,
           phone: fill.phone,
           employee_id: fill.employee_id
       })
       book.push(data)
    })

    const ws = XLSX.utils.json_to_sheet(book)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'file')
    const filename = 'report.xlsx'
    XLSX.writeFile(wb, filename)
    res.download(filename, () => {
        fs.unlink(filename, () => {
            console.log('file removed!')
        })
    })
 

})


router.get('/downloadexcel', async (req, res, next) => {

    const headerColumns = ['Name', 'Email', 'Phone', 'Age', 'Employee_id']

    const wb = new xl.Workbook()

    const generatenames = () => {
        return Math.random().toString(36).substring(2, 7)
    }

    const ws = wb.addWorksheet(generatenames())


    let colindex = 1
    headerColumns.forEach((item) => {
        ws.cell(1, colindex++).date(new Date()).string(item)
    })

    const __Gennames =  generatenames() + '.xlsx'

    wb.write(`${__Gennames}`, async() => {
        
        const file = path.join(__dirname, `../../${__Gennames}`)
        // console.log(file)
    
        const fileName = path.basename(`${__Gennames}`)
        // console.log(fileName)
    
        const mimetype = mime.getType(fileName)
        // console.log(mimetype)
    
        res.setHeader('Content-Disposition', 'attachment;filename = ' + fileName)
        res.setHeader('Content-Type', mimetype)
        res.download(file, () => {
            fs.unlink(file, () => {
                console.log('file is deleted!')
            })
        })
    
    })


});


module.exports = router