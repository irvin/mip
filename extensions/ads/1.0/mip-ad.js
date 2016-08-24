// __inline('./mip-ad.js');
// __inline('./mip-ad-baidu.js');
// 


/**
 * 广告插件
 * 
 * @author wangpei07@baidu.com
 * @version 1.0
 * @copyright 2016 Baidu.com, Inc. All Rights Reserved
 */
require.config({
    paths: {
        "extensions/ads/1.0/mip-ad-comm": "https://mipcache.bdstatic.com/static/v1.0/ads/mip-ad-comm",
        "extensions/ads/1.0/mip-ad-baidu": "https://mipcache.bdstatic.com/static/v1.0/ads/mip-ad-baidu",
        "extensions/ads/1.0/mip-ad-qwang": "https://mipcache.bdstatic.com/static/v1.0/ads/mip-ad-qwang"
    }
});

require.config({
    paths: {
        "extensions/ads/1.0/mip-ad-comm": "/dist/extensions/ads/1.0/mip-ad-comm",
        "extensions/ads/1.0/mip-ad-baidu": "/dist/extensions/ads/1.0/mip-ad-baidu",
        "extensions/ads/1.0/mip-ad-qwang": "/dist/extensions/ads/1.0/mip-ad-qwang"
    }
});

define(function (){
    var customElement = require('customElement').create();
    
    /**
     * render
     *
     */
    function render () {
        var _element = this.element;
        var _this = _element;
        if (_element.isRender) {
            return;
        }

        _element.isRender = true;

        var type = _element.getAttribute('type');
        var adFile = 'extensions/ads/1.0/mip-' + type;
        require([adFile], function(mipAd) {
            mipAd.render(_this);
        });
    }

    


    /**
     * 初始化
     *
     */
    customElement.prototype.init = function() {
        this.build = render;
    };
    return customElement;
});

require(['mip-ad'], function (mipAdComm) {
    // 引入组件需要的css文件，选填
    MIP.css.mipAd = __inline('./mip-ad.less');
    //注册组件
    MIP.registerMipElement('mip-ad', mipAdComm, MIP.css.mipAd);
    MIP.registerMipElement('mip-embed', mipAdComm, MIP.css.mipAd);
});
