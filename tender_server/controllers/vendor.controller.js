const express = require('express')
const vendorModel = require('../models/vendor.model')
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const user = process.env.Nodemailer_user
const pass = process.env.Nodemailer_pass
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/

const signUp = (req, res) => {
    let { businessName, ownerName, email, password } = req.body

    // sanitize inputs: trim strings
    if (typeof businessName === 'string') businessName = businessName.trim()
    if (typeof ownerName === 'string') ownerName = ownerName.trim()
    if (typeof email === 'string') email = email.trim().toLowerCase()

    if (!password || !passwordRegex.test(password)) {
        return res.send({ status: false, message: "Password too weak! Must be at least 9 characters and include uppercase, lowercase, number and special character." })
    }

    let form = new vendorModel({ businessName, ownerName, email, password })

    // To check if email already exists:
    vendorModel.findOne({ email })
        .then((existing) => {
            if (existing) {
                res.send({ status: false, message: "Email already in use. Kindly register with a new one." })
            }

            // Otherwise
            form.save().then(() => {
                console.log("Saved successfully.")


                // NODEMAILER:
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: user,
                        pass: pass
                    }
                })
                const mailOptions = {
                    from: 'Tender <officialkingsocrates@gmail.com>',
                    to: email,
                    subject: 'Welcome to Tender',
                    html: `<!doctype html>
<html>
<head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Tender</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
        <tr>
            <td align="center">
                <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background-color:#ffffff;">
                    <tr>
                        <td style="padding:40px 16px;">
                            <!-- Logo -->
                            <div style="text-align:center;margin-bottom:30px;">
                                <img src="https://i.postimg.cc/sD6xpkvt/New-Tender.png" alt="Tender" width="200" style="display:block;margin:0 auto;height:auto;" />
                            </div>

                            <!-- Main content block -->
                            <div style="border:1px solid #eee;padding:30px;border-radius:8px;background-color:#ffffff;color:#111;">
                                <h1 style="color:#111;font-size:24px;margin:0 0 12px 0;">Hello ${ownerName || ''}, welcome to Tender!</h1>

                                <p style="line-height:1.6;">
                                    By joining Tender as a vendor, you’ve taken the first step toward getting your products in front of the right people. Upload your products, polish your listings, and let your store take shape. Visibility starts here!
                                </p>

                                <p style="line-height:1.6;"><strong>What’s coming?</strong><br/>We’re actively building new features to help vendors grow: better discovery, smarter tools, and more opportunities to reach customers as Tender expands.</p>

                                <p style="line-height:1.6;"><strong>Spread the word ↓</strong><br/>Share Tender with people close to you while you get set up. Early momentum matters, and every product you upload strengthens the marketplace.</p>

                                <p style="line-height:1.6;"><strong>From here on:</strong><br/>Once your products are live, they’re ready to be discovered as the world finds Tender.</p>
                                <p style="line-height:1.6;">Thank you for trusting us early. We’re glad you’re building with us.</p>

                                <p style="margin-top:18px;"><strong>→ The Tender Team</strong></p>
                            </div>

                            <!-- Footer -->
                            <div style="text-align:center;color:#888;font-size:12px;margin-top:30px;">
                                &copy; 2025 Tender Marketplace. All rights reserved.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
                }

                transporter.sendMail(mailOptions)
                    .then((response) => {
                        console.log('Welcome email sent:', response)
                    })
                    .catch((err) => {
                        console.log('Welcome email error:', err)
                    })

                res.send({ status: true, message: "Request is successful." })
            }).catch((err) => {
                console.error('SignUp error:', err)
                // Duplicate key (unique) error from MongoDB
                if (err && err.code === 11000) {
                    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'value'
                    return res.status(409).send({ status: false, message: `${field} already exists.` })
                }
                // Mongoose validation error
                if (err && err.name === 'ValidationError') {
                    return res.status(400).send({ status: false, message: err.message })
                }
                // Generic server error
                res.status(500).send({ status: false, message: 'Server error.' })
            })
        })
        .then((vendor) => {
            if (vendor) res.send({ status: true, message: "Vendor account created." });
        })
        .catch((err) => res.send({ status: false, message: err.message }));
}

const signIn = (req, res) => {
    let { password } = req.body
    // sanitize email for lookup
    const email = req.body.email && typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : req.body.email
    vendorModel.findOne({ email })
        .then((vendor) => {

            // VALIDATE PASSWORD
            if (vendor) {
                vendor.validatePassword(password, (err, same) => {
                    if (!same) {
                        res.send({ status: false, message: "Wrong credentials, please try again." })
                    } else {
                        let token = jwt.sign({ vendorId: vendor._id, role: "vendor" }, process.env.JWTsecret, { expiresIn: "1h" })
                        console.log(token)
                        res.send({ status: true, message: "Sign in successful", token })
                    }
                })
            } else {
                console.log("User does not exist")
                res.send({ status: false, message: "User does not exist." })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = { signUp, signIn }