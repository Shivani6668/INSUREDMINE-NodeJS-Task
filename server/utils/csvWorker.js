import { parentPort, workerData } from 'worker_threads';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

dotenv.config();

import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Account from '../models/Account.js';
import LOB from '../models/LOB.js';
import Carrier from '../models/Carrier.js';
import Policy from '../models/Policy.js';

const MONGO = process.env.MONGO_URI;

const parseDate = (str) => {
  if (!str) return null;
  const cleaned = String(str).trim().replace(/"/g, '');

  const formats = ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY', 'D-MMM-YYYY'];
  for (const fmt of formats) {
    const d = dayjs(cleaned, fmt, true); 
    if (d.isValid()) return d.toDate();
  }

  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
};

const connect = async () => await mongoose.connect(MONGO, { autoIndex: false });
const disconnect = async () => { try { await mongoose.disconnect(); } catch(e) {} };

const readCSV = (filePath) => new Promise((resolve, reject) => {
  const results = [];
  fsSync.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => resolve(results))
    .on('error', reject);
});

const readXLSX = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: null });
};

const processRows = async (rows) => {
  const batchSize = 100;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    await Promise.all(batch.map(async (row) => {
      const agent = await Agent.findOneAndUpdate(
        { name: row.agent },
        { name: row.agent },
        { upsert: true, new: true }
      );

      const user = await User.findOneAndUpdate(
        { email: row.email },
        {
          firstname: row.firstname,
          dob: parseDate(row.dob),
          address: row.address,
          phone: row.phone,
          state: row.state,
          zip: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType
        },
        { upsert: true, new: true }
      );

      const account = await Account.findOneAndUpdate(
        { name: row.account_name },
        { name: row.account_name },
        { upsert: true, new: true }
      );

      const lob = await LOB.findOneAndUpdate(
        { category_name: row.category_name },
        { category_name: row.category_name },
        { upsert: true, new: true }
      );

      const carrier = await Carrier.findOneAndUpdate(
        { company_name: row.company_name },
        { company_name: row.company_name },
        { upsert: true, new: true }
      );

      await Policy.create({
        policy_number: row.policy_number,
        policy_start_date: parseDate(row.policy_start_date),
        policy_end_date: parseDate(row.policy_end_date),
        policy_category: lob._id,
        company: carrier._id,
        user: user._id,
      });

    }));

    console.log(`Processed ${i + batch.length}/${rows.length}`);
  }
};

(async () => {
  const filePath = workerData.filePath;

  try {
    await connect();

    const ext = path.extname(filePath).toLowerCase();
    let rows = [];

    if (ext === '.csv') {
      rows = await readCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      rows = readXLSX(filePath);
    } else {
      throw new Error('Unsupported file type. Use CSV or XLSX.');
    }

    if (!rows.length) throw new Error('No data found in file.');

    await processRows(rows);

    try { await fs.unlink(filePath); } catch (e) { console.warn('Failed to delete file:', e.message); }

    parentPort.postMessage('Upload Completed');

  } catch (err) {
    console.error('Worker error:', err);
    parentPort.postMessage(`Error: ${err.message}`);
  } finally {
    await disconnect();
  }
})();
