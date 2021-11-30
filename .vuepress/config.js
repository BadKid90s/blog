module.exports = {
    "title": "blog",
    "description": "",
    "dest": "public",
    "head": [
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon.ico"
            }
        ],
        [
            "meta",
            {
                "name": "viewport",
                "content": "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    "theme": "reco",
    "themeConfig": {
        "nav": [
            {
                "text": "首页",
                "link": "/",
                "icon": "reco-home"
            },
            {
                "text": "时间线",
                "link": "/timeline/",
                "icon": "reco-date"
            },
            {
                "text": "文档",
                "icon": "reco-message",
                "items": [
                    {
                        "text": "vuepress-reco",
                        "link": "/docs/theme-reco/"
                    }
                ]
            },
            {
                "text": "链接",
                "icon": "reco-message",
                "items": [
                    {
                        "text": "GitHub",
                        "link": "https://github.com/recoluan",
                        "icon": "reco-github"
                    }
                ]
            }
        ],
        "sidebar": {
            "/docs/theme-reco/": [
                "",
                "theme",
                "plugin",
                "api"
            ],
            "/docs/java/": [
                "hello",
            ]
        },
        "type": "blog",
        "blogConfig": {
            "category": {
                "location": 3,// 在导航栏菜单中所占的位置，默认2
                "text": "分类" // 默认文案 “分类”
            },
            "tag": {
                "location": 3, // 在导航栏菜单中所占的位置，默认3
                "text": "标签"  // 默认文案 “标签”
            }
        },
        "friendLink": [ // 信息栏展示社交信息
            {
                "title": "午后南杂",
                "desc": "Enjoy when you can, and endure when you must.",
                "email": "wry10150@163.com",
                // "link": "https://www.recoluan.com"
            },
            {
                "title": "java",
                "desc": "我是一个java boy",
                "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                // "link": "https://vuepress-theme-reco.recoluan.com"
            }
        ],
        "logo": "/logo.png",
        "search": true,
        "searchMaxSuggestions": 10,
        "lastUpdated": "Last Updated",
        "author": "wangruiyu",
        "authorAvatar": "/avatar.png",
        "record": "xxxx",
        "startYear": "2017"
    },
    "markdown": {
        "lineNumbers": true
    },
    "plugins": [
        ["sakura", {
            num: 30,  // 默认数量
            show: true,
            zIndex: 2,
            img: {
                replace: false,  // false 默认图 true 换图 需要填写httpUrl地址
                httpUrl: 'http://www.zpzpup.com/assets/image/sakura.png'     // 绝对路径
            }
        }],
        ["ribbon-animation", {
            size: 90,   // 默认数据
            opacity: 0.3,  //  透明度
            zIndex: -1,   //  层级
            opt: {
                // 色带HSL饱和度
                colorSaturation: "80%",
                // 色带HSL亮度量
                colorBrightness: "60%",
                // 带状颜色不透明度
                colorAlpha: 0.65,
                // 在HSL颜色空间中循环显示颜色的速度有多快
                colorCycleSpeed: 6,
                // 从哪一侧开始Y轴 (top|min, middle|center, bottom|max, random)
                verticalPosition: "center",
                // 到达屏幕另一侧的速度有多快
                horizontalSpeed: 200,
                // 在任何给定时间，屏幕上会保留多少条带
                ribbonCount: 2,
                // 添加笔划以及色带填充颜色
                strokeSize: 0,
                // 通过页面滚动上的因子垂直移动色带
                parallaxAmount: -0.5,
                // 随着时间的推移，为每个功能区添加动画效果
                animateSections: true
            },
            ribbonShow: false, //  点击彩带  true显示  false为不显示
            ribbonAnimationShow: true  // 滑动彩带
        }],
        ['go-top'],
        [
            "dynamic-title",
            {
                showIcon: "https://www.zpzpup.com/assets/image/favicon.ico",
                showText: "欢迎回来 O(∩_∩)O~",
                hideIcon: "https://www.zpzpup.com/assets/image/favicon.ico",
                hideText: "失联中。。。快回来~",
                recoverTime: 2000
            }
        ],
        [ 'vuepress-plugin-helper-live2d', {
            // 是否开启控制台日志打印(default: false)
            log: false,
            live2d: {
                // 是否启用(关闭请设置为false)(default: true)
                enable: true,
                // 模型名称(default: hibiki)
                model: 'koharu',
                display: {
                    position: "right", // 显示位置：left/right(default: 'right')
                    width: 135, // 模型的长度(default: 135)
                    height: 300, // 模型的高度(default: 300)
                    hOffset: 65, //  水平偏移(default: 65)
                    vOffset: 0, //  垂直偏移(default: 0)
                },
                mobile: {
                    show: false // 是否在移动设备上显示(default: false)
                },
                react: {
                    opacity: 1 // 模型透明度(default: 0.8)
                }
            }
        }
        ],
        ['flexsearch-pro', {//自定义搜索参数
            searchPaths: [],    // 搜索路径数组，为空表示搜索全部路径
            searchHotkeys: ['s'],    // 激活搜索控件的热键, 默认是 "s" ，也可以添加更多热键
            searchResultLength: 60,    // 搜索结果展示的字符长度, 默认是60个字节
        }],
        ['cursor-effects', {
            size: 2, // size of the particle, default: 2
            shape: ['star' | 'circle'], // shape of the particle, default: 'star'
            zIndex: 999999999, // z-index property of the canvas, default: 999999999
        }],
        ['@vuepress/active-header-links', {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
        }],
        ['ribbon'],
        ['@vuepress-reco/vuepress-plugin-pagation']
    ]
}