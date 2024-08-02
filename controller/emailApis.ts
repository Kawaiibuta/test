import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/ses-transport";
import fs from "fs"
import ApiError from "../entities/ApiError";
export function sendEmail(from: string, to: string, subject: string, html: string) {
    console.log( process.env.GMAIL_USER, process.env.GMAIL_PASSWORD)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const mailOptions: MailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new ApiError(500, error.name, error.message)
        } else {
            console.log('Email sent: ' + info.response);

        }
    });
}
// Function to load an HTML file as a string
export function loadHtmlFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}