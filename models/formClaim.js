const mongoose = require('mongoose');

const formClaimSchema = mongoose.Schema({
    name: String,
    email: String,
    description: String,
    phone: Number,
    adress: String,
    formType: {
        type: String,
        enum: ['CLAIM', 'REQUEST'],
        required: true
    },
    status: {
        type: String,
        enum: ['APPROVED', 'PENDING','REJECTED','RESOLVED'],
        default: 'PENDING'
    }
});

const FormClaim = mongoose.model("FormClaim", formClaimSchema);
module.exports = FormClaim;
