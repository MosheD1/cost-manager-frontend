/*
    Moshe Dego 315044511
    Omri Elbaz 315006635
*/

const idb = {
  db: null,
  dbName: 'costsDB',
  dbVersion: 1,
  objectStoreName: 'costs',

  // function to open the indexedDB db
  openCostsDB: async () => {
    if (!idb.db) {
      const request = indexedDB.open(idb.dbName, idb.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(idb.objectStoreName)) {
          db.createObjectStore(idb.objectStoreName, { keyPath: 'id', autoIncrement: true });
        }
      };

      idb.db = await new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        }
        request.onerror = () => reject(request.error);
      });
    }

    return idb.db;
  },

  // function to add a new cost item to the db
  addCost: async (costItem) => {
    const db = await idb.openCostsDB();
    const transaction = db.transaction([idb.objectStoreName], 'readwrite');
    const store = transaction.objectStore(idb.objectStoreName);
    const promises = [];

    const clearRequest = store.clear();
    await new Promise((resolve, reject) => {
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    for (const item of costItem) {
      console.log(item);
      let request = store.add(item);

      const promise = new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log('sucess')
          resolve(true);
        }
        request.onerror = () => {
          console.log('failed', request.error);
          reject(request.error);
        }
      });

      promises.push(promise);
    }

    await Promise.allSettled(promises);
  },

  // function to retrieve all existing cost items from the database
  getAllCosts: async () => {
    const db = await idb.openCostsDB();
    const transaction = db.transaction([idb.objectStoreName], 'readonly');
    const store = transaction.objectStore(idb.objectStoreName);
    const results = [];

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('results', results);
        resolve(results);
      };

      transaction.onerror = (event) => {
        reject(event.target.error);
      };

      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        console.log(event.target.result, 'asd');
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        }
      };

      cursorRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  // function to get cost items by year and month
  getCostsByMonthYear: async (month, year) => {
    const db = await idb.openCostsDB();
    const transaction = db.transaction([idb.objectStoreName], 'readonly');
    const store = transaction.objectStore(idb.objectStoreName);

    const index = store.index('monthYear');
    const range = IDBKeyRange.only(`${month}-${year}`);
    const request = index.openCursor(range);

    const results = [];

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
};

export default idb;
