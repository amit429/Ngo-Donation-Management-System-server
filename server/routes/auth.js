const routes = require('express').Router();
require("../db/connection");
const Doner = require("../models/Donerschema");
const Ngo = require("../models/Ngoschema");
const Donation = require("../models/Donationschema");
const Request = require("../models/Requests");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const ngo_authenticate = require('../middleware/ngo_authenticate');

routes.get('/', (req, res) => {
    res.send('Ngo Donation Management System');
});

routes.post('/Doner-register', async (req, res) => {

    const {
        name,
        email,
        phone,
        dob,
        address,
        password,
        cpassword
    } = req.body;

    if (!name || !email || !phone || !password || !cpassword || !address || !dob) {
        return res.status(420).json({
            error: "Please fill the field properly"
        });
    }

    try {

        const userExist = await Doner.findOne({
            email: email
        });

        let date = dob.split("-");
        if(date[0] > 2003){
            return res.status(418).json({
                error: "You are not eligible to register"
            });
        }

        if (userExist) {
            return res.status(421).json({
                error: "Email already exist"
            });
        } else if (password != cpassword) {
            return res.status(422).json({
                error: "Password are not matching"
            });
        } else {
            const doner = new Doner({
                name,
                email,
                phone,
                address,
                dob,
                password,
                cpassword
            });

            await doner.save();

            res.status(201).json({
                message: "User registered successfully"
            });
        }

    } catch (err) {
        console.log(err);
    }

});

routes.post('/Ngo-Registration', async (req, res) => {

    const {
        name,
        email,
        phone,
        address,
        description,
        representative,
        type,
        password,
        cpassword
    } = req.body;

    if (!name || !email || !phone || !password || !cpassword || !address || !description || !representative || !type) {
        return res.status(420).json({
            error: "Please fill the field properly"
        });
    }

    try {

        const userExist = await Ngo.findOne({
            email: email
        });

        if (userExist) {
            return res.status(421).json({
                error: "NGO already exist"
            });
        } else if (password != cpassword) {
            return res.status(422).json({
                error: "Confirm Password and Password are not matching"
            });
        } else {
            const ngo = new Ngo({
                name,
                email,
                phone,
                address,
                description,
                representative,
                type,
                password,
                cpassword
            });

            await ngo.save();

            res.status(201).json({
                message: "User registered successfully"
            });
        }

    } catch (err) {
        console.log(err);
    }

});

routes.post('/donation', async (req, res) => {
    
    const {
        fullname,
        email,
        organization,
        donated
    } = req.body;

    if (!fullname || !organization || !donated || !email) {
        return res.status(420).json({
            error: "Please fill the field properly"
        });
    }

    try {

        const donation = new Donation({
            fullname,
            email,
            organization,
            donated
        });

        if(donated < 100){
            return res.status(420).json({
                error: "Minimum donation amount is 100"
            });
        }
    
        if(donated > 50000){
            return res.status(421).json({
                error: "Thank you for donating a very generous amount."
            });
        }

        await donation.save();

        res.status(201).json({
            message: "Donation done successfully"
        });

    } catch (err) {
        console.log(err);
    }
    
});

//signin routes

routes.post("/doner_sign-in", async(req,res)=>{
    try{
        const{email,password} = req.body;
        //console.log(Email,Password);

        if(!email || !password){
            return res.status(400).json({error:"Please fill all the fields"});
        }

        const donerLogin  = await Doner.findOne({email:email});
        //console.log(userLogin);
        
        if(donerLogin){
            const isMatch = await bcrypt.compare(password,donerLogin.password);
            
            //generating a token that is returned to the user from schema and stored in the database
            const token = await donerLogin.generateAuthToken();
            // console.log(token);
            
            //generating a cookie
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            });
            
            if(!isMatch){
                res.status(401).json({error:"Invalid Credentials"});
            }
            else{
                res.json({message:"User Signed In Successfully"});
            }
        }else{
            res.status(400).json({error:"Invalid Credentials"});
        }
    }
    catch(err){
        console.log(err);
    }
})

// creating request

routes.post('/addRequest', async (req, res) => {

    const {
        name,
        org_name,
        deadline,
        address,
        description,
        type,
        amount
    } = req.body;

    if (!name || !deadline || !org_name || !address || !description || !type || !amount) {
        return res.status(420).json({
            error: "Please fill the field properly"
        });
    }

    const d = new Date();
    let date = deadline.split("-");
    if(date[2] < d.getUTCMonth()){
        return res.status(418).json({
            error: "Deadline needs to be of 24 hours"
        });
    }

    try {

        const request = new Request({
            name,
            org_name,
            deadline,
            address,
            description,
            type,
            amount
        });

        await request.save();

        res.status(201).json({
            message: "Request created successfully"
        });

    } catch (err) {
        console.log(err);
    }

});

routes.post("/ngo_sign-in", async(req,res)=>{
    
    try{

        const{email,password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({error:"Please fill all the fields"});
        }

        const ngoLogin  = await Ngo.findOne({email : email});

        if(ngoLogin){

            const isMatch = await bcrypt.compare(password,ngoLogin.password);
            
            //generating a token that is returned to the user from schema and stored in the database
            const token = await ngoLogin.generateAuthToken();
            // console.log(token);
            
            //generating a cookie
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            }); 
            
            if(!isMatch){
                res.status(401).json({error:"Invalid Credentials"});
            }
            else{
                res.json({message:"User Signed In Successfully"});
            }
        }
        else{
            res.status(400).json({error:"Invalid Credentials"});
        }
    }
    catch(err){
        console.log(err);
    }
});

// Logout route
routes.get('/logout', (req, res) => {

    res.clearCookie('jwtoken', {
        path: '/'
    });
    res.status(200).send('User Logged Out');

});

//Check whether the user is authenticated or not routes
routes.get("/checkLogin" , authenticate , (req,res)=>{

    try{
        res.status(200).send(req.rootUser);

    }catch(err){
        console.log(err);
    }

}); //authenticate is a middleware

routes.get("/checkNgologin" , ngo_authenticate , (req,res)=>{

    try{
        res.status(200).send(req.rootUser);

    }catch(err){
        console.log(err);
    }

}); //ngo_authenticate is a middleware

// Get Requests

routes.get("/Ngo-list" , async (req, res) => {
    try{
        const ngoData = await Ngo.find({});
        res.send(ngoData);
    }catch(err){
        res.send(err);
    }
});

routes.get('/Userdonations', async (req, res) => {

    try {

        const donationData = await Donation.find({});
        res.send(donationData);
    }
    catch (err) {
        res.send(err);
    }

});

// get requests

routes.get('/requests', async (req, res) => {

    try {

        const requestData = await Request.find({});
        res.send(requestData);
    }
    catch (err) {
        res.send(err);
    }

});

routes.get('/search', async (req, res) => {
    try{
        const search = await Ngo.find({type : req.query.search});

        if(!search){
            return res.status(404).send();
        }else{
            res.status(200).send(search);
            //console.log(search);
        }
    }catch(err){
        res.send(err);
    }
});

//delete request

routes.delete('/delete-ngo/:id', async (req, res) => {

    try {
        const _id = req.params.id;
        const deleteNgo = await Ngo.findByIdAndDelete(_id);

        if (!req.params.id) {
            return res.status(400).send();
        }
        res.send(deleteNgo);
    } catch (err) {
        res.status(500).send(err);
    }

});

module.exports = routes;