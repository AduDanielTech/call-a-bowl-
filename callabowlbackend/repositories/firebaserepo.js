const admin = require('firebase-admin');

const serviceAccount = require('./ignore/website-cd6ce-firebase-adminsdk-qbvxq-fdc8191376.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://website-cd6ce-default-rtdb.firebaseio.com",
});

class Repository {
  constructor(collectionName) {
    if (!collectionName) {
      throw new Error('Creating a repository requires a collection name');
    }
    this.collectionName = collectionName;
    this.collectionRef = admin.database().ref(collectionName);
  }

  async create(attrs) {
    // Create a new record in Firebase
    const newRecordRef = this.collectionRef.push(attrs);
    const newRecordSnapshot = await newRecordRef.once('value');
    return newRecordSnapshot.val();
  }

  async getAll() {
    console.log('hi');
    // Fetch data from Firebase
    const recordsSnapshot = await this.collectionRef.once('value');
    return recordsSnapshot.val() || {};
  }




  async delete(id) {
   const  records = await this.getAll();
   console.log(id);
    const filteredRecords =  Object.values(records).filter(record => record.MENU !== id); 
    console.log(filteredRecords);
    await this.collectionRef.set(filteredRecords);
    
  
  }


  


  /* async update(id, attrs) {
    // Update a record in Firebase
    const recordRef = this.collectionRef.child(id);
    await recordRef.update(attrs);


  } */
    async update(id, attrs) {
      const records = await this.getAll();
      const record = Object.values(records).find(record => record.MENU === id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }
      Object.assign(record, attrs);
      await this.collectionRef.set(records);
    }

  // Implement caching for other methods like getOne, getOneTitle, and getOneBy
  async getOne(id) {
    // Fetch data from Firebase
    const recordRef = this.collectionRef.child(id);
    const recordSnapshot = await recordRef.once('value');
    return recordSnapshot.val();
  }

  async getOneTitle(title) {
    // Fetch data from Firebase and filter by title
    const records = await this.getAll();
    return records.filter(record =>
      record.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  async getOneBy(filters) {
    // Fetch data from Firebase
    const records = await this.getAll();

    return Object.values(records).find(record => {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
          break;
        }
      }
      return found;
    });
  }
}

module.exports = Repository;
