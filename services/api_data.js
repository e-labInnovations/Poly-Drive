const axios = require('axios');
const utilities = require('./utilities.js');
require('dotenv').config();


var cardData = {
    views : 0,
    downloads : 0,
    files : 0,
    contributers : 0
}
var contributers = [];

const fetchData = async () => {
    console.log("calling api");
    
    return await axios.get(process.env.API_KEY)
    .then(function (response) {
        // handle success
        cardData.views = response.data.data.infoData.views;
        cardData.downloads = response.data.data.infoData.downloads;
        cardData.contributers = response.data.data.contributers.length;
        contributers = response.data.data.contributers;
        cardData.files = getFilesCount(response.data.data.data);
        return response.data.data.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        return null;
    });
}

var data = fetchData();

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
        
        let modifiedCardData = {
          views : utilities.intToString(cardData.views),
          downloads : utilities.intToString(cardData.downloads),
          files : utilities.intToString(cardData.files),
          contributers : utilities.intToString(cardData.contributers)
        };
        
        return {
            data,
            dipartments,
            'cardData' : modifiedCardData
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

const updateDownloadsCount = () => {
  cardData.downloads = cardData.downloads + 1;
}

const updateViewsCount = () => {
  cardData.views = cardData.views + 1;
  if(cardData.views%10 == 0) {
    console.log('views count updated to the server');
  }
}


module.exports = {
    getHomeData,
    getFolderData,
    updateDownloadsCount,
    updateViewsCount
}