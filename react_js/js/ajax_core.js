var ajax_core = function() {
};

ajax_core.prototype = {

  __class_name: "ajax_core",

  objectToFormData: function(objectData) {
    var formData = new FormData();
    for (var key in objectData) {
      formData.append(key, objectData[key]);
    }
    return formData;
  },

  sendRequest: function(type, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 || xhr.status < 300) || xhr.status === 304) {
          callback(null, xhr.responseText);
        } else {
          callback('Error (' + xhr.status + ') : ' + xhr.statusText + ' : ' + xhr.responseText);
        }
      }
    };
    xhr.send(data);
  },

  get_JSON_res: function(url, callback) {
    ajax_core.prototype.sendRequest('GET', url, null, function(err, res) {
      if (err) {
        callback(err);
      } else {
        try {
          var parsed = JSON.parse(res);
        } catch (e) {
          callback(e);
        }

        callback(null, parsed);
      }
    });
  },

  getRequest: function(url, callback) {
    ajax_core.prototype.sendRequest('GET', url, null, callback);
  },

  postRequest: function(url, objectData, callback) {
    var formData = ajax_core.prototype.objectToFormData(objectData);
    ajax_core.prototype.sendRequest('POST', url, formData, callback);
  },

  putRequest: function(url, objectData, callback) {
    var formData = ajax_core.prototype.objectToFormData(objectData);
    ajax_core.prototype.sendRequest('PUT', url, formData, callback);
  },

  deleteRequest: function(url, callback) {
    ajax_core.prototype.sendRequest('DELETE', url, null, callback);
  }
};

export default ajax_core;