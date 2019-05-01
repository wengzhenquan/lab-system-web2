/**
 * 封装http请求
 * @param url
 * @param method
 * @param data
 * @returns {Promise}
 */
export function http(url, UrlQuery, data, method,successCallBack,errorCallBack) {
    if (UrlQuery) {
        let paramsArray = [];
        //encodeURIComponent
        Object.keys(UrlQuery).forEach(key => paramsArray.push(key + '=' + UrlQuery[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    data = data || {};
    method = method || 'POST';
    // headers ? (headers = Object.assign(headers, baseConfig.BaseHeaders)) : (headers = baseConfig.BaseHeaders);
    // console.log('Headers' + JSON.stringify(headers));
    return new Promise((resolve, reject) => {
        this.$axios({
            url: url,
            method: method,
            data: data,
            timeout: 15000
        }).then((res) => {
            resolve(res);
            successCallBack(res);
            // console.log(res);
        }).catch((err) => {
            reject(err);
            // errorCallBack(err)
            // console.log(e);
        });
    })
}
