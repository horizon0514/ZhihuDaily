var util = {
/**
   * 基于fetch的get方法
   * @method post
   * @param {string} url
   * @param {function} callback 请求成功回调
   */
  ajax:function(params){
    var url       = params.url,
        postData  = params.data,
        method    = params.method || 'get',
        headers   = params.headers,
        success   = params.success || function(){},
        failure   = params.failure || function(){};
    var opts = {
      method:method,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    };
    method=='post' ? opts.body=JSON.stringify(postData) : null;
    opts.headers = Object.assign(opts.headers,headers);

    fetch(url,opts)
      .then((response) => response.text())
      .then((responseText) => {
        success(JSON.parse(responseText));
      })
      .catch(function(err){
        failure(err);
      });
  }, 
}

module.exports = util;