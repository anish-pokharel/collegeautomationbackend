const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const ExcelData = require('../models/examModel');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
    for (const row of data) {
      if (!row.name || !row.age) {
        return res.status(400).json({ message: 'Error: Each row must contain a name and age.' });
      }
    }

    await ExcelData.insertMany(data);

    fs.writeFileSync('output.json', JSON.stringify(data));
    
    res.json({ message: 'File uploaded successfully', data });
  } catch (err) {
    console.error('Error uploading file:', err); // Enhanced error logging
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
});

module.exports = router;
