const express = require('express');
const FormClaim = require('../models/formClaim');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();


// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


router.get('/formClaims',async (req,res)=>{
    try{
        const forms=await FormClaim.find();
        res.status(201).json({success:true,data:forms})
    }catch (error){
        res.status(404).send(error)
    }
})

//update with id
router.patch('/formClaim/:id/status', async (req, res) => {
    try {
        const formClaimId = req.params.id;
        const { status } = req.body;

        // Validate status
        if (!['PENDING', 'APPROVED', 'REJECTED', 'RESOLVED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updatedFormClaim = await FormClaim.findByIdAndUpdate(formClaimId, { status }, { new: true });
        const form=await FormClaim.findById(formClaimId);
        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `Updated the status of you'r form to : ${status}`,
            text: `
                The form has been Updated:

                Name: ${form.name}
                Email: ${form.email}
                Description: ${form.description}
                Phone: ${form.phone}
                Address: ${form.adress}
                Form Type: ${form.formType}
                Status: ${status}
            `
        };

         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(404).json({ success: false, message: 'Form claim not found' });
            }
            res.status(200).json({ success: true, data: updatedFormClaim });
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});


//get with id
router.get('/:id',async (req,res)=>{
    try{
        const {id} = req.params
        const form=await FormClaim.findById(id);
        res.status(201).json({success:true,data:form})
    }catch (error){
        res.status(404).send(error)
    }
})




router.post('/addFormClaim', async (req, res) => {
    try {
        const { name, email, description, phone, adress, formType, status } = req.body;

        // Validate formType
        if (!['CLAIM', 'REQUEST'].includes(formType)) {
            return res.status(400).json({ success: false, message: 'Invalid formType' });
        }

        let newForm = new FormClaim({
            name,
            email,
            description,
            phone,
            adress,
            formType,
            status
        
        });

        const savedForm = await newForm.save();

        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New ${formType} Form Submitted`,
            text: `
                A new form has been submitted:

                Name: ${name}
                Email: ${email}
                Description: ${description}
                Phone: ${phone}
                Address: ${adress}
                Form Type: ${formType}
                Status: ${status}
            `
        };

         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Error sending email' });
            }
            res.status(201).json({ success: true, data: savedForm });
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
