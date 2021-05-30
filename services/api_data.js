const axios = require('axios');

const fetchData = async () => {
    console.log("calling api");
    
    return await axios.get('http://localhost:3000/api.json')
    .then(function (response) {
        // handle success
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        return null;
    });
}

var data = fetchData();
var cardData = {
    view : 0,
    downloads : 0,
    files : 0,
    contributers : 0
}

const getData = () => {
    if(data) {
        return data;
    } else {
        data = fetchData();
        return getData();
    }
}

const getFileDataById = (folderObj, id) => {
    var resultObj = null;
  function getObject(theObject) {
      var result = null;
      if(theObject instanceof Array) {
          for(var i = 0; i < theObject.length; i++) {
              result = getObject(theObject[i]);
          }
      } else {
          for(var prop in theObject) {
              //console.log(prop + ': ' + theObject[prop]);
              if(prop == 'id') {
                //console.log('ID: ' + theObject[prop]);
                  if(theObject[prop] === id) {
                    resultObj = theObject;
                      return theObject;
                  }
              }
              if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                  result = getObject(theObject[prop]);
          }
      }
      return result;
  }
  
  let r = getObject(folderObj);
  return resultObj;
}

const getFilesCount = (folderObj) => {
    var count = 0;
  function getObject(theObject) {
      var result = null;
      if(theObject instanceof Array) {
          for(var i = 0; i < theObject.length; i++) {
              result = getObject(theObject[i]);
          }
      } else {
          for(var prop in theObject) {
              if(prop == 'type') {
                  if(theObject[prop] === 'file') {
                    count++;
                  }
              }
              if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                  result = getObject(theObject[prop]);
          }
      }
      return result;
  }
  
  let r = getObject(folderObj);
  return count;
}

const getHomeData = () => {
    return getData().then(data => {
        const dipartments = data.children.filter(child => child.type == 'folder').map(child => {
            return {
                name: child.name,
                id: child.id
                }
        });
        
        cardData.files = getFilesCount(data);
        return {
            data,
            dipartments,
            cardData
        }
    })
}

const getFolderData = (folderId) => {
    return getData().then(data => {
        const dipartments = data.children.filter(child => child.type == 'folder').map(child => {
            return {
                name: child.name,
                id: child.id
                }
        });
        
        const folderData = getFileDataById(data, folderId);
        return {
            data: folderData,
            dipartments : dipartments
        }
    })
}


module.exports = {
    getHomeData,
    getFolderData
}