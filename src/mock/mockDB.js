// Mock database to mirror Firebase Firestore structure
const mockImageDB = {
  // Collection of images
  images: {
    'img1': {
      id: 'img1',
      data: {
        imageUrl: 'https://via.placeholder.com/150',
        packId: 1,
        points: 10,
        createdAt: new Date().toISOString(),
      }
    },
    'img2': {
      id: 'img2',
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ds',
        packId: 1,
        points: 5,
        createdAt: new Date().toISOString(),
      }
    },
    'img3': {
      id: 'img3',
      data: {
        imageUrl: 'https://via.placeholder.com/300',
        packId: 1,
        points: 2,
        createdAt: new Date().toISOString(),
      }
    }
  },

  // Collection reference methods (mimicking Firestore)
  collection: function(collectionName) {
    return {
      doc: (id) => this.doc(collectionName, id),
      where: (field, operator, value) => this.where(collectionName, field, operator, value),
      get: () => this.getCollection(collectionName),
      add: (data) => this.add(collectionName, data),
    };
  },

  // Document reference methods
  doc: function(collection, id) {
    return {
      get: () => this.getDoc(collection, id),
      set: (data) => this.setDoc(collection, id, data),
      update: (data) => this.updateDoc(collection, id, data),
      delete: () => this.deleteDoc(collection, id),
    };
  },

  // Query methods
  where: function(collection, field, operator, value) {
    return {
      get: () => {
        return new Promise((resolve) => {
          const results = Object.entries(this[collection])
            .filter(([_, doc]) => {
              const fieldValue = doc.data[field];
              switch(operator) {
                case '==': return fieldValue === value;
                case '>': return fieldValue > value;
                case '<': return fieldValue < value;
                default: return false;
              }
            })
            .map(([id, doc]) => ({
              id,
              data: () => doc.data
            }));
          resolve({ docs: results });
        });
      }
    };
  },

  // Implementation methods
  getCollection: function(collection) {
    return new Promise((resolve) => {
      const docs = Object.entries(this[collection]).map(([id, doc]) => ({
        id,
        data: () => doc.data
      }));
      resolve({ docs });
    });
  },

  getDoc: function(collection, id) {
    return new Promise((resolve, reject) => {
      const doc = this[collection][id];
      if (doc) {
        resolve({
          exists: true,
          id,
          data: () => doc.data
        });
      } else {
        resolve({
          exists: false,
          id,
          data: () => null
        });
      }
    });
  },

  setDoc: function(collection, id, data) {
    return new Promise((resolve) => {
      this[collection][id] = {
        id,
        data: {
          ...data,
          createdAt: new Date().toISOString(),
        }
      };
      resolve();
    });
  },

  add: function(collection, data) {
    return new Promise((resolve) => {
      const id = 'doc' + (Object.keys(this[collection]).length + 1);
      this[collection][id] = {
        id,
        data: {
          ...data,
          createdAt: new Date().toISOString(),
        }
      };
      resolve({ id });
    });
  },
};

export default mockImageDB;
