import { MongoClient } from 'mongodb';

async function main() {
  const uri =
    'mongodb+srv://polymath:alli12345@learningmongodb.yswyeam.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('connected to database successfully');
    // await listDatabases(client);
    // await createListing(client, {
    //   name: 'John Doe',
    //   summary:
    //     'I dont have this database and collection, I am testing to see if it works',
    //   bedrooms: 1,
    //   bathrooms: 1,
    // });
    // await createMultiipleListings(client, [
    //   {
    //     name: 'new boy',
    //     summary: 'this is a summary',
    //     beds: 2,
    //   },
    //   {
    //     name: 'guy',
    //     summary: 'learning mongodb',
    //     beds: 12,
    //     property_type: 'Apartment',
    //   },
    //   {
    //     app_name: 'Zulfah',
    //     message: 'This is a message',
    //   },
    // ]);
    // await findOneListingByName(client, 'Makai Hideaway');
    // await findListingsWithMinumuBedroomsBathroomsAndMostRecentReviews(client, {
    //   minimumNumberOfBathrooms: 2,
    //   minimumNumberOfBedrooms: 4,
    //   maximumNumberOfResults: 8,
    // });
    // await UpdateListingByName(client, 'Makai Hideaway', {
    //   bedrooms: 12,
    //   bathrooms: 12.0,
    // });
    // await upsertListingByName(client, 'Umar Olarinde', {
    //   name: 'Umar Olarinde',
    //   bedrooms: 12,
    //   bathrooms: 1,
    // });
    // await updateAllListingsToHavePropertyType(client);
    // await deleteListingByName(client, 'Umar Olarinde');
    await deleteListingScrapedBeforeDate(client, new Date('2019-02-15'));
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .findOne({ name: nameOfListing });
  if (result) {
    console.log(
      `Found a listing in the collection with the name ${nameOfListing}`
    );
    console.log(result);
  } else {
    console.log(`No listing found with the name ${nameOfListing}`);
  }
}
async function createListing(client, newListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertOne(newListing);
  console.log(`New listing created for the following id ${result.insertedId}`);
}

async function createMultiipleListings(client, newListings) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertMany(newListings);
  console.log(`${result.insertedCount} created with the following ids:`);
  console.log(result.insertedIds);
}
async function findListingsWithMinumuBedroomsBathroomsAndMostRecentReviews(
  client,
  {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER,
  } = {}
) {
  const cursor = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .find({
      bedrooms: { $gte: minimumNumberOfBedrooms },
      bathrooms: { $gte: minimumNumberOfBathrooms },
    })
    .sort({ last_review: -1 })
    .limit(maximumNumberOfResults);

  const results = await cursor.toArray();
  if (results.length > 0) {
    console.log(
      `Found listing with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`
    );
    results.forEach((result, i) => {
      const date = new Date(result.last_review).toDateString();
      console.log();
      console.log(`${i + 1}. name: ${result.name}`);
      console.log(`      _id: ${result._id}`);
      console.log(`      bedrooms: ${result.bedrooms}`);
      console.log(`      bathrooms: ${result.bathrooms}`);
      console.log(`      most recent review date: ${date}`);
    });
  } else {
    console.log('No listings found');
  }
}

async function UpdateListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .updateOne({ name: nameOfListing }, { $set: updatedListing });
  console.log(`${result.matchedCount} documents(s) matched the query criteria`);
  console.log(`${result.modifiedCount} documents(s) was/were updated`);
}
async function upsertListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .updateOne(
      { name: nameOfListing },
      { $set: updatedListing },
      { upsert: true }
    );
  console.log(`${result.matchedCount} documents(s) matched the query criteria`);
  if (result.upsertedCount > 0) {
    console.log(`One document was inserted with the id ${result.upsertedId}`);
  } else {
    console.log(`${result.modifiedCount} documents(s) was/were updated`);
  }
}
async function updateAllListingsToHavePropertyType(client) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .updateMany(
      { property_type: { $exists: false } },
      { $set: { property_type: 'unknown' } }
    );
  console.log(`${result.matchedCount} documents(s) matched the query criteria`);
  console.log(`${result.modifiedCount} documents(s) was/were updated`);
}
async function deleteListingByName(client, nameOfListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .deleteOne({ name: nameOfListing });
  console.log(`${result.deletedCount} document(s) was/were deleted`);
}
async function deleteListingScrapedBeforeDate(client, date) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .deleteMany({ last_scraped: { $lt: date } });
  console.log(`${result.deletedCount} document(s) was/were deleted`);
}
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  // console.log(databasesList);
  console.log('Databases: ');
  databasesList.databases.forEach((db) => console.log(`- ${db.name}`));
}
