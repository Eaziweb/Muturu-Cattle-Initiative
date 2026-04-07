const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://fayeye1ezekiel1:q7d0UH9hQoSepYE1@cluster0.pbne6tn.mongodb.net/"; // change to your DB name

async function fixDonationIndexes() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB ✅");

    const collection = mongoose.connection.db.collection("donations");

    // Drop the bad index if it exists
    try {
      await collection.dropIndex("flutterwaveReference_1");
      console.log("Dropped old index: flutterwaveReference_1");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("Old index not found, skipping...");
      } else {
        throw err;
      }
    }

    // Recreate indexes properly
    await collection.createIndex(
      { flutterwaveRef: 1 },
      { unique: true, sparse: true }
    );
    console.log("Created fixed index on flutterwaveRef ✅");

    await collection.createIndex(
      { flutterwaveId: 1 },
      { unique: true, sparse: true }
    );
    console.log("Created index on flutterwaveId ✅");

    await mongoose.disconnect();
    console.log("Disconnected ✅");
  } catch (err) {
    console.error("Error fixing indexes:", err);
    process.exit(1);
  }
}

fixDonationIndexes();


create the publication page and the jornal page and theri corresponsing admin pages.  you can upload publication and journal from  the admin with all the necssary details a publication should have. abstract etc  and then you can add the price for that publication.  before users can download publications , they have to pay through flutterwave , the payment is confirmed and then they can download it, an email message to send confrmation that they have paid can also be added. Same goes for the journal page, users have to pay. Add whatever necessary feautres that needs to be added, makle sure it wprks seamlessly . Admins can view nummber of dwnloads, etc. If logged in → show payment modal showing price

Payment gateway: Flutterwave, button

Payment

User completes payment

On payment success:

Generate a secure, time-limited download link that is sent to mail and also displayed on the website.  (e.g., 24 hours)

Store purchase record in the database

Download

User clicks link → file downloads securely

Optionally, allow re-downloads for a limited number of times. ensure it is secure. 