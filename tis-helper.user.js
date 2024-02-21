// ==UserScript==
// @name         SUSTC-tis-helper
// @namespace    https://blog.vollate.top/
// @version      1.0.1
// @description  SUSTech 可能会变质，但绝对不会倒闭
// @author       Vollate
// @match        https://tis.sustech.edu.cn/*
// @icon         https://www.sustech.edu.cn/static/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';
    const Headers_ = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Host": "tis.sustech.edu.cn",
        "Origin": "https://tis.sustech.edu.cn",
        "Referer": "https://tis.sustech.edu.cn/Xsxk/query/1",
        "RoleCode": "01",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "X-Requested-With": "XMLHttpRequest",
        "sec-ch-ua": `"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Linux"`
    };
    function getGMAry_(key) {
        var str = GM_getValue(key);
        return str ? JSON.parse(str) : [];
    }

    function appendGMAry_(key, val) {
        var vals = getGMAry_(key);
        vals.push(val);
        GM_setValue(key, JSON.stringify(vals));
    }

    function clearGM_(key) {
        GM_setValue(key, undefined)
    }

    function enableAllButtons_() {
        var allButtons = document.querySelectorAll('button');
        var targetButtons = Array.prototype.filter.call(allButtons, function (button) {
            var span = button.querySelector('span');
            return span && span.textContent === '选课' && button.hasAttribute('disabled');
        });

        targetButtons.forEach(function (button) {
            button.removeAttribute('disabled');
        });
    }

    const checkAndAdd_ = (url, init) => {
        if (url.endsWith('Xsxk/addGouwuche')) {
            originalFetch(RequestURL, {
                method: 'POST',
                headers: Headers_,
                body: init,
                credentials: 'include'
            }).then(res => res.json())
                .then(data => {
                    let name = data.message.match('，课程：.+');
                    appendGMAry_('courseRequest', {'body': init, 'name': data.message.substring(name.index + 4)});
                });
        }
    };

    const RequestURL = 'https://tis.sustech.edu.cn/Xsxk/addGouwuche'

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                checkAndAdd_(url, this._body);
            }
        });
        originalXHROpen.apply(this, arguments);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this._body = body;
        originalXHRSend.apply(this, arguments);
    };


    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;
        checkAndAdd_(url, init);
        return originalFetch.apply(this, arguments);
    };

    async function courceRace_(targets) {
        while (GM_getValue('Start')) {
            for (let i = 0; i < targets.length; i++) {
                originalFetch(RequestURL, {
                    method: 'POST',
                    headers: Headers_,
                    body: targets[i].body,
                    credentials: 'include'
                }).then(res => res.json())
                    .then(data => {
                        if (data.jg == '1') {
                            console.log('Capture' + targets[i].name)
                        }
                    })
                await new Promise(resolve => setTimeout(resolve, 5));
            }
        }
    }

    const menu_command_id_1_ = GM_registerMenuCommand("Start", () => {
        alert('start compete');
        GM_setValue('Start', '+');
        courceRace_(getGMAry_('courseRequest'));
    });

    const menu_command_id_2_ = GM_registerMenuCommand("Stop", () => {
        alert('stop compete');
        clearGM_('Start')
    });

    const menu_command_id_3_ = GM_registerMenuCommand("Show selected", () => {
        let courses = getGMAry_('courseRequest');
        let info = ''
        for (let i = 0; i < courses.length; ++i) {
            info += i + 1 + '. ' + courses[i].name + '\n';
        }
        confirm(info);
    });

    const menu_command_id_4_ = GM_registerMenuCommand("Clear all courses", () => {
        if (confirm('Are you sure to clear all courses?')) {
            clearGM_('courseName');
            clearGM_('courseRequest');
        }
    });

    setInterval(enableAllButtons_, 1000);
})();


