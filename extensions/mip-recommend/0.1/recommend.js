/**
 * @file 推荐
 *
 * fork from http://gitlab.baidu.com/MIP/mibhtml/raw/master/src/static/js/dom/recommend.js
 */


define(function() {

    // 此处判断iframe用了较为tricky的逻辑，后续需要通过父页面message来确认
    var inIframe = (window.parent !== window);

    var _ = require('./util');

    /**
    * 推荐模块
    */
    function render(data) {
        //相关推荐
        var recommendData = data.recommend ? data.recommend : data;

        if (recommendData && recommendData.length) {

            var logClass = inIframe ? '' : 'MIP_LOG_BTN';

            $.each(recommendData, function(i, item) {
                $(".recommends").append(
                    '<div ' + (item.head ? 'data-head="' + item.head + '"' : '') + ' class="' + logClass + ' recommends-box' + (!i ? ' recommends-box-first' : '') + '" data-click=\'{"action":"recommend", "order":"' + i + '", "href":"' + item.url + '", "type": "sf"}\'>'+
                    '<a class="recommends-href" href='+ item.url + '>' +
                    '<div class="recommends-title">' + item.title + '</div>' +
                    '<div class="recommends-info">' +
                    '<span>' + _.timeSince(item.time) + '</span>' +
                    '<span class="recommends-provider">' + item.provider + '</span></div></a></div>'
                );
            });

            //重设高度兼容手百
            // $(".recommends").css("height", "100%");

        }
        else {
            $(".recommends").append(''
                + '<p class="recommends-empty">'
                + '暂无相关资讯'
                + '</p>'
            );
        }

        // 更多
        var recommendMore = data.recommend_more;

        if (recommendMore) {

            var url = _.addParam(recommendMore.url, {from: 'recmd'});


            $(".recommends").addClass('recommends-more').append(''
                + '<div class="recommends-more-line">'
                + '<a target="_blank" href="' + url + '" class="recommends-more-link">'
                + (recommendMore.text || '查看更多 <em>资讯</em> ')
                + '</a>'
                + '</div>'
            );
        }



    }


    /**
     * 热点容器
     *
     * @type {String}
     */
    var tplHotWrapper = ''
        + '<div class="hotpoint">'
        +     '<div class="hotpoint-header">新闻热点</div>'
        + '</div>';


    /**
     * 热词推荐
     */
    function renderHot(data) {

        if(!$('.hotpoint').length) {
            $(".recommends").after(tplHotWrapper);
        }


        var hotpointData = data.hot_card;

        if (hotpointData && hotpointData.length) {

            var html = '';
            var len = hotpointData.length;
            var tpl = ''
                + '<div class="c-span6 hotpoint-item">'
                +     '<a target="#{target}" class="MIP_LOG_BTN c-bloaka c-color c-urljump c-line-clamp1#{hotClass}" href="#{href}" data-click=\'{"action":"hotpoint", "order":"#{index}", "href":"#{href}"}\' data-urljump=\'#{urljump}\'>#{text}</a>'
                + '</div>';

            $.each(hotpointData, function(i, item) {

                var typeStr = item.type
                    ? '<i class="c-text-box c-text-box-red">新</i>'
                    : '';

                if (!(i % 2)) {
                    if (i) {
                        html += '</div>';
                    }
                    html += '<div class="c-row hotpoint-row">';
                }

                html += _.format(tpl, {
                    index: i,
                    target: inIframe ? '_blank' : '_self',
                    hotClass: '', //item.type ? ' hotpoint-href-word-hot' : '',
                    href: item.url,
                    text: item.query, // item.query + typeStr,
                    urljump: JSON.stringify({
                        t: 'mdd',
                        lid: _.getParam('lid', location.href)
                    })
                });

                if (i === len - 1) {
                    html += '</div>';
                }
            });


            $('.hotpoint').append('<div class="hotpoint-box">' + html + '</div>');

            if (data.hot_card_more) {

                var morelink = data.hot_card_more.link || 'https://m.baidu.com/s?word=%E7%99%BE%E5%BA%A6%E7%83%AD%E7%82%B9&sa=oper_olympic';

                var moreText = data.hot_card_more.text || '点击查看更多百度热点新闻';

                var moreHtml = ''
                    + '<div class="hotpoint-more">'
                    +   '<a target="_blank" href="' + morelink + '" class="hotpoint-more-link">'
                    +       moreText
                    +   '</a>'
                    + '</div>';

                $('.hotpoint').append(moreHtml);

            }


            // $(".hotpoint").css("height", "100%");
        }
        else {
            $(".hotpoint").remove();
        }
    }

    function init() {

        $(".recommends").delegate('.recommends-box','click',function(ev) {

            ev.preventDefault();

            var href = $(this).find(".recommends-href").attr("href");


            // 顶部题目
            var head = $(this).data('head');

            if (!head) {
                head = $(this).find(".recommends-provider").text();
            }

            var message = {
                "event": "loadiframe",
                "data": {
                    "url": href,
                    "enc": "no",
                    "title": head,
                    "click": $(this).data('click')
                }
            };

            if (inIframe) {
                window.parent.postMessage(message, '*');
            }
            else {
                location.href = href;
            }

        });

    }


    /**
     * 活动容器
     *
     * @type {String}
     */
    var tplActWrapper = ''
        + '<div class="recommend-act">'
        + '</div>';


    /**
     * 渲染活动
     *
     * @param  {object} data 渲染活动
     */
    function renderAct(data) {

        var actData = data.act_card;

        // actData = [
        //     {
        //         icon: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1316532929,3120616448&fm=58',
        //         text: '奥运有奖竞猜',
        //         url: 'http://activity.2016.baidu.com/guess'
        //     },
        //     {
        //         icon: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1588110423,3363913049&fm=58',
        //         text: '奥运闯关夺宝',
        //         url: 'http://activity.2016.baidu.com/answerui/'
        //     }

        // ];


        if (actData && actData.length) {

            $(".recommends").after(tplActWrapper);

            var tpl = ''
                + '<a target="_blank" class="MIP_LOG_BTN recommend-act-item" href="#{url}">'
                +   '<img class="recommend-act-icon" src="#{icon}" />'
                +   '<span class="recommend-act-text">#{text}</span>'
                + '</a>';

            var html = '';

            $.each(actData, function(i, item) {

                var url = _.addParam(item.url, {from: 'recmd'});

                html += _.format(tpl, {
                    url: url,
                    text: item.text,
                    icon: item.icon
                });

            });

            $('.recommend-act').html(html);
        }


    }

    return {
        init : init,
        render: render,
        renderHot: renderHot,
        renderAct: renderAct
    }
});
