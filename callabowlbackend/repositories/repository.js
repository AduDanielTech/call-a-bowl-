const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

module.exports = class Repository{
    constructor(filename) {
        if (!filename) {
          throw new Error('Creating a repository requires a filename');
        }
    
        this.filename = filename;
        try {
          fs.accessSync(this.filename);
        } catch (err) {
          fs.writeFileSync(this.filename, '[]');
        }
      }
    async create (attrs ) {
        attrs.id = this.randomId()
        const records = await this.getAll()
        records.push(attrs)
        await this.writeAll(records);
        return attrs;
        }




      async getAll() {
        try {
          return JSON.parse(
            await fs.promises.readFile(this.filename, {
              encoding: 'utf8'
            })
          );
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    
      async getAllUsers() {
        try {
          return JSON.parse(
            await fs.promises.readFile(this.filename, {
              encoding: 'utf8'
            })
          ).users
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    
     
    
      async writeAll(records) {
        await fs.promises.writeFile(
          this.filename,
          JSON.stringify(records, null, 2)
        );
      }
    
      randomId() {
        return crypto.randomBytes(4).toString('hex');
      } 
    
      
      async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
      }
      async getOneTitle(title) {
        const records = await this.getAll();
        let array = []
        
          array = records.filter(record => record.title.toLowerCase().includes(title.toLowerCase()))
        
        return array
      }

      async deleteProduct(itemName, CATEGORY) {
        const records = await this.getAll();
        const indexToDelete = records.MENU.findIndex(record => (
          record.MENU === itemName && record.CATEGORY === CATEGORY
        ));
      
        if (indexToDelete !== -1) {
          records.MENU.splice(indexToDelete, 1);
          await this.writeAll(records);
        }
      }
      
      async deleteSpecial(itemName, CATEGORY) {
        const records = await this.getAll();
        console.log('hi');
        const indexToDelete = records.Landing_Page.SPECIAL_ORDER.findIndex((record) => (
          record.MENU === itemName && record.CATEGORY === CATEGORY
        ));
      
        if (indexToDelete !== -1) {
          records.Landing_Page.SPECIAL_ORDER.splice(indexToDelete, 1); // Updated this line
          await this.writeAll(records);
        }
      }
      
      
      


      async delete(id,) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record =>( record.id !== id)); 
        await this.writeAll(filteredRecords);
      }
    
      async updateProduct(prevMENU, prevCATEGORY, attrs) {
        const records = await this.getAll();
        
        const recordIndex = records.MENU.findIndex(record => (
          record.MENU === prevMENU && record.CATEGORY === prevCATEGORY
        ));
      
        if (recordIndex === -1) {
          throw new Error(`Record with MENU "${prevMENU}" and CATEGORY "${prevCATEGORY}" not found`);
        }
      
        records.MENU[recordIndex] = { ...records.MENU[recordIndex], ...attrs };
        /* */
        await this.writeAll(records);
      }
      
      async updateSpecial(prevMENU, prevCATEGORY, attrs) {
        const records = await this.getAll();
        
        const recordIndex = records.Landing_Page.SPECIAL_ORDER.findIndex(record => (
          record.MENU === prevMENU && record.CATEGORY === prevCATEGORY
        ));
      console.log(recordIndex);
        if (recordIndex === -1) {
          throw new Error(`Record with MENU "${prevMENU}" and CATEGORY "${prevCATEGORY}" not found`);
        }
      
        records.Landing_Page.SPECIAL_ORDER[recordIndex] = { ...records.Landing_Page.SPECIAL_ORDER[recordIndex], ...attrs };
        
        await this.writeAll(records);
      }
      

        async update(id, attrs) {
          const records = await this.getAll();
          const record = records.find(record => record.id === id);
      
          if (!record) {
            throw new Error(`Record with id ${id} not found`);
          }
          Object.assign(record, attrs);
          await this.writeAll(records);
        }
    
      async getOneBy(filters) {
        const records = await this.getAll();
    
        for (let record of records) {
          let found = true;
          
          for (let key in filters) {
            if (record[key] !== filters[key]) {
              found = false;
            }
          }
    
          if (found) {
            return record;
          }
        }
      }
}