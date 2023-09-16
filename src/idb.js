/*
    Moshe Dego 315044511
    Omri Elbaz 315006635
*/

const idb = {
  db: null,
  dbName: 'costsDB',
  objectStoreName: 'costs',

  //function to open the indexedDB db
  openCostsDB: async () => {
    if (!idb.db) {
      //open a connection to db
      const request = indexedDB.open(idb.dbName);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(idb.objectStoreName)) {
          db.createObjectStore(idb.objectStoreName, { keyPath: 'id', autoIncrement: true });
        }
      };

      //when request return we resolve/reject based to the result
      idb.db = await new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        }
        request.onerror = () => reject(request.error);
      });
    }

    return idb.db;
  },

  //function to add a new cost item to the db
  addCost: async (costItem) => {
    // start a read-only transaction
    const transaction = idb.db.transaction([idb.objectStoreName], 'readwrite');
    const store = transaction.objectStore(idb.objectStoreName);

    return new Promise((resolve, reject) => {
      const request = store.add(costItem);

      //handler for request success
      request.onsuccess = () => {
        resolve(true);
      };

      //handler for request error
      request.onerror = () => {
        reject(false);
      };
    });
  },

  // function to retrieve all existing cost items from the database
  getAllCosts: async () => {
    // Start a read-only transaction
    const transaction = idb.db.transaction([idb.objectStoreName], 'readonly');
    const store = transaction.objectStore(idb.objectStoreName);
    const results = [];

    return new Promise((resolve, reject) => {
      //handler for transaction request success
      transaction.oncomplete = () => {
        resolve(results);
      };

      //handler for transaction request error
      transaction.onerror = (event) => {
        reject(event.target.error);
      };

      // Open a cursor to iterate through the object store records
      const cursorRequest = store.openCursor();

      //handler for cursor request success
      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // Add the value to the results array and then continue to the next record
          results.push(cursor.value);
          cursor.continue();
        }
      };

      //handler for cursor request error
      cursorRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },
};

export default idb;
