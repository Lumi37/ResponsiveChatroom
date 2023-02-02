
import { MongoClient } from 'mongodb'


const mongoURL = 'mongodb://10.0.0.46:27017'
export const client = new MongoClient(mongoURL)
const dbName = 'test'

export async function main(){  
    await client.connect()
    console.log('Connected successfully to server');
    const db = client.db(dbName)
    const collection = db.collection('documents')
    
    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    console.log('Inserted documents =>', insertResult);

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    const filteredDocs = await collection.find({ a: 3 }).toArray();
    console.log('Found documents filtered by { a: 3 } =>', filteredDocs);

    const updateOneResult = await collection.updateOne({ a: 2 }, { $set: { b: 2222 } });
    console.log('Updated (one) documents =>', updateOneResult);

    const updateManyResult = await collection.updateMany({ a: 3 }, { $set: { b: 1 } });
    console.log('Updated (many) documents =>', updateManyResult);

    const deleteResultOne = await collection.deleteOne({ a: 1 });
    console.log('Deleted (one) documents =>', deleteResultOne);
    
    const deleteResultMany = await collection.deleteMany({ a: 3 });
    console.log('Deleted (many) documents =>', deleteResultMany);

    const updateAnotherOneResult = await collection.updateOne({ a: 2 }, { $set: { c: 222222 , k:292929} });
    console.log('Updated (one) documents =>', updateAnotherOneResult);
    
    const updateAnotherOneResult2 = await collection.updateOne({ a: 2 }, { $unset: { c: ""} });
    console.log('Updated (one) documents =>', updateAnotherOneResult2);

    const indexName = await collection.createIndex({ a: 1 });
    console.log('index name =', indexName);
    return 'done.'
}