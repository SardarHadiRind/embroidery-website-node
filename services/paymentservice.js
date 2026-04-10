const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');

class PaymentService {
    constructor() {
        // EasyPaisa Configuration
        this.easypaisaConfig = {
            merchantId: process.env.EASYPAISA_MERCHANT_ID,
            apiKey: process.env.EASYPAISA_API_KEY,
            integritySalt: process.env.EASYPAISA_INTEGRITY_SALT,
            apiUrl: process.env.NODE_ENV === 'production' 
                ? 'https://easypay.easypaisa.com.pk/easypay/Index'
                : 'https://sandbox.easypaisa.com.pk/testapi/'
        };

        // JazzCash Configuration
        this.jazzcashConfig = {
            merchantId: process.env.JAZZCASH_MERCHANT_ID,
            password: process.env.JAZZCASH_PASSWORD,
            integritySalt: process.env.JAZZCASH_INTEGRITY_SALT,
            apiUrl: process.env.NODE_ENV === 'production'
                ? 'https://payments.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction'
                : 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction'
        };
    }

    // Generate secure hash for JazzCash
    generateJazzCashHash(data) {
        const sortedKeys = Object.keys(data).sort();
        let message = '';
        sortedKeys.forEach(key => {
            if (key !== 'pp_SecureHash') {
                message += `${key}=${data[key]}&`;
            }
        });
        message += this.jazzcashConfig.integritySalt;
        return crypto.createHash('sha256').update(message).digest('hex').toUpperCase();
    }

    // Generate secure hash for EasyPaisa
    generateEasyPaisaHash(data) {
        const sortedKeys = Object.keys(data).sort();
        let message = '';
        sortedKeys.forEach(key => {
            if (key !== 'secureHash') {
                message += `${key}=${data[key]}&`;
            }
        });
        message += this.easypaisaConfig.integritySalt;
        return crypto.createHash('sha256').update(message).digest('hex');
    }

    // Create JazzCash payment request
    async createJazzCashPayment(orderData) {
        const dateTimeString = moment().format('YYYYMMDDHHmmss');
        
        const payload = {
            pp_Version: "1.1",
            pp_TxnType: "MWALLET",
            pp_Language: "EN",
            pp_MerchantID: this.jazzcashConfig.merchantId,
            pp_Password: this.jazzcashConfig.password,
            pp_TxnRefNo: orderData.orderId,
            pp_Amount: orderData.amount.toString(),
            pp_TxnDateTime: dateTimeString,
            pp_BillReference: orderData.orderId,
            pp_Description: orderData.description || "Embroidery Store Purchase",
            pp_ReturnURL: `${process.env.FRONTEND_URL}/payment-callback.html`,
            pp_SecureHash: ""
        };

        payload.pp_SecureHash = this.generateJazzCashHash(payload);

        try {
            const response = await axios.post(this.jazzcashConfig.apiUrl, 
                new URLSearchParams(payload).toString(),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            return response.data;
        } catch (error) {
            console.error('JazzCash Error:', error.message);
            throw new Error('JazzCash payment failed');
        }
    }

    // Create EasyPaisa payment request
    async createEasyPaisaPayment(orderData) {
        const payload = {
            storeId: this.easypaisaConfig.merchantId,
            transactionId: orderData.orderId,
            amount: orderData.amount,
            mobileNumber: orderData.mobileNumber,
            email: orderData.email,
            description: orderData.description || "Embroidery Store Purchase",
            successUrl: `${process.env.FRONTEND_URL}/payment-success.html`,
            failureUrl: `${process.env.FRONTEND_URL}/payment-failed.html`
        };

        payload.secureHash = this.generateEasyPaisaHash(payload);

        try {
            const response = await axios.post(`${this.easypaisaConfig.apiUrl}/createTransaction`, payload);
            return response.data;
        } catch (error) {
            console.error('EasyPaisa Error:', error.message);
            throw new Error('EasyPaisa payment failed');
        }
    }

    // Verify payment callback
    verifyPaymentCallback(paymentData, gateway) {
        if (gateway === 'jazzcash') {
            const receivedHash = paymentData.pp_SecureHash;
            delete paymentData.pp_SecureHash;
            const calculatedHash = this.generateJazzCashHash(paymentData);
            return calculatedHash === receivedHash;
        } else if (gateway === 'easypaisa') {
            const receivedHash = paymentData.secureHash;
            delete paymentData.secureHash;
            const calculatedHash = this.generateEasyPaisaHash(paymentData);
            return calculatedHash === receivedHash;
        }
        return false;
    }
}

module.exports = new PaymentService();