const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collection1_Schema = new Schema({ _id: String , id: String, client: String, createdAt:Date, imei: String, ref: String, updatedAt: Date });
const collection2_Schema = new Schema({ _id: String , tag: String, case:String, imei:String, model:String, timezone: String, info_serial_no:Number, output:String, socket:String, device:String, client:String, speed:Number, gps:Array, battery:Number, createdAt:Date });

const app = express();
// const DB_CONNECTION_KEY = 'mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net';

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;


app.post('/', async (req, res) => {
    console.log("POST Connected...");
    const { url } = req.body;
    const { first_collection } = req.query;
    const { second_collection } = req.headers;
    var latest_devices = [];
    
    // const Devices = mongoose.Connection.collection(first_collection);
    await mongoose.connect(
        url,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, async () => {
            try {
                console.log("MONGODB Connected...");
                // var Model = mongoose.model('Question', new mongoose.Schema({ id: [String] }), first_collection);
                // mongoose.model(first_collection, new Schema({ imei: String, sim: String, id: Number }), first_collection);
                const collection1 = mongoose.model('collection1', collection1_Schema, first_collection);
                // collection1.find({}, function(err, data) { console.log(err, data, data.length); }); 
                await collection1.find({}, function(err, data) { latest_devices = (data) }).sort({ $natural:-1 }).limit(30);
                console.log(latest_devices[0]._id);
                console.log(latest_devices[0].id);
                console.log(latest_devices[0].client);
                console.log(latest_devices[0].createdAt);
                console.log(latest_devices[0].imei);
                console.log(latest_devices[0].ref);
                console.log(latest_devices[0].updatedAt);

                // console.log(latest_devices[1].id);
                // console.log(latest_devices[1].client);
                // console.log(latest_devices[1].createdAt);
                // console.log(latest_devices[1].imei);
                // console.log(latest_devices[1].ref);
                // console.log(latest_devices[1].updatedAt);

                res.send(latest_devices);
                
                // var answer = [];
                // var collection2 = mongoose.model('collection2', collection2_Schema, second_collection);
                // await collection2.find({  }, function(err, data) { answer = (data); }).sort({$natural:-1}).limit(10);

                // console.log(answer[0]);
                // for(device of latest_devices){
                //     var dummy = [] 
                //     await collection2.find({ device: device.id }, function(err, data) { dummy.push(data); console.log(data) }).sort({$natural:-1});  
                //     answer.push(dummy);
                //     console.log(`-----------> ${device.id}`);
                // }
                // res.send(answer);
                
            }
            catch (e) {
                console.log(e)
                res.send("Error In Fetching Data...")
            }
        }
    );
        
    // res.send(latest_devices)
    // res.send(`${first_collection} , ${url} , ${second_collection}`);
})

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));