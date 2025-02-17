const Payment = require('../models/Payment');
const unirest = require('unirest');
const ngrok = require('ngrok');
const Session = require('../models/Session');
const dotenv = require("dotenv") ;
dotenv.config();
let tokken = "";

// Get the Daraja API credentials from the .env file
const consumerKey = process.env.consumerKey;
const consumerSecret = process.env.consumerSecret;

// Generate a timestamp with the following function (format: YYYYMMDDHHmmss)

const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// initialize ngrok using the following function

(async function() {
  console.log("Initializing Ngrok tunnel...");

  // Initialize ngrok using auth token and hostname
  const url = await ngrok.connect({
      proto: "http",
      // Your authtoken if you want your hostname to be the same everytime
      authtoken: process.env.ngrokauth,
      // Your hostname if you want your hostname to be the same everytime
      hostname: "",
      // Your app port
      addr: process.env.NgrokPORT || 6000,
  });

  console.log(`Listening on url ${url}`);
  console.log("Ngrok tunnel initialized!");
})();

// Get timestamp and encoded password for the Authorization API 

  let Timestampstring = generateTimestamp();
  let encodingpassword= `174379${process.env.passkey}${Timestampstring}`
  let base64PasswordEncoded = Buffer.from(encodingpassword).toString('base64');
  let CheckoutRequestID = "";
  let sessionid=0;
  let amount1=0;
  let phone=0;
  let user = 0;
// Initiate Payment
exports.initiatePayment = async (req, res) => {

    
    try {
        const { sessionId, amount, phoneNumber , userId} = req.body;
        let orderId = 1;
        sessionid = sessionId;
        amount1 = amount;
        phone = phoneNumber;
        user = userId;
       
      console.log(sessionId, amount, phoneNumber, orderId)
         // create callback url with ngrok
      const callback_url = await ngrok.connect( process.env.NgrokPORT || 6000);
      const api = ngrok.getApi();
      await api.listTunnels();
    
      //encode token
      const base64AuthEncoded = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'); //Base64 Encode (Consumer Key : Consumer Secret)
     
      //promise to generate token
      let getToken=()=>{

        return new Promise((resolve,reject)=>{
          // request is from the auth api
          unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
                    .headers({ 'Authorization': `Basic ${base64AuthEncoded}` })
                    .send()
                    .end(response => {
                      if (response.error) throw new Error(response.error);
                        resolve(response)
                    });
          })

        }

      //get token body
      getToken().then(response=>{
        //get token
        let jsonstring = response.body
        tokken = jsonstring.access_token;

        console.log(tokken,response.body)
        // this request is from the M-Pesa Express Api Simulate option
        unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
                        .headers({
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${tokken}`
                        })
                        .send(JSON.stringify({
                            "BusinessShortCode": 174379,
                            "Password": base64PasswordEncoded,
                            "Timestamp": Timestampstring,
                            "TransactionType": "CustomerPayBillOnline",
                            "Amount": 1,
                            "PartyA": phoneNumber,
                            "PartyB": 174379,
                            "PhoneNumber": phoneNumber,
                            "CallBackURL": `${callback_url}/payment-callback/${orderId}`,
                            "AccountReference": "CompanyXLTD",
                            "TransactionDesc": "Payment of X" 
                          }))
                        .end(response2 => {
                          if (response2.error) throw new Error(response2.error);
                          CheckoutRequestID=response2.body.CheckoutRequestID;

                        console.log("callback", CheckoutRequestID) 

                        res.status(200).json({ success: true, message: 'Payment initiated successfully.' })

                        });
      })


     
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment initiation failed.', error });
    }
};

// Payment Callback
exports.paymentCallback = async (req, res) => {
    try {
      const { sessionId, userId, amount } = req.body;  // Assuming these are sent in the request

         // Handle payment callback logic here
    // Verify the payment and update your application's records
    // Respond with a success message
    Timestampstring = generateTimestamp();
    encodingpassword= `174379${process.env.passkey}${Timestampstring}`
    base64PasswordEncoded = Buffer.from(encodingpassword).toString('base64');

    unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokken}`
        })
        .send(JSON.stringify({
            "BusinessShortCode": 174379,
            "Password": base64PasswordEncoded,
            "Timestamp": Timestampstring,
            "CheckoutRequestID": `${CheckoutRequestID}`,
        }))
        .end(async(response )=> {
          if (response.error) throw new Error(response.error);
          console.log(response.body);
           // Save payment record

           if(response.body.ResultDesc =='The service request is processed successfully.'){

              // Update session to reflect payment
              const session = await Session.findById(sessionId);
              if (session) {
              session.paid = true;  // Mark session as paid for the next 50 sessions
              await session.save();
              }  
              
              const payment = new Payment({
                sessionId: sessionid,
                userId: user,
                amount: amount1,
                status: 'Completed',
              });
    
            payment.save()   
            .then(() => res.status(200).json({ success: true, message: 'Payment initiated successfully.', data: response.body }))
            .catch((err) => res.status(500).json({ success: false, message: 'Failed to save payment record.', error: err }));
           }else
          
          res.status(500).json({ success: false, message: 'Failed to see callback.' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process payment callback.', error });
    }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const payments = await Payment.find({ sessionId });
        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve payment status.', error });
    }
};
