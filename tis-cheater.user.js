// ==UserScript==
// @name         SUSTech tis cheater
// @namespace    https://blog.vollate.top/
// @version      1.1.0
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
    const FetchHeaders = {
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

    function xhrBodyToFetchBody(body) {
        if (body instanceof FormData) {
            return body;
        } else if (typeof body === 'string') {
            try {
                const json = JSON.parse(body);
                return JSON.stringify(json);
            } catch (e) {
                return body;
            }
        } else if (body instanceof ArrayBuffer || body instanceof Blob) {
            return body;
        } else if (typeof body === 'object' && body !== null) {
            return JSON.stringify(body);
        }
        return null;
    }

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url;
        originalXHROpen.apply(this, arguments);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (this._url.endsWith('Xsxk/addGouwuche')) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    let data = JSON.parse(this.responseText);
                    if (data.jg === '1') {
                        console.log('Success, now start to get course name');
                        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                            fetch(this._url, {
                                method: 'POST',
                                headers: FetchHeaders,
                                body: xhrBodyToFetchBody(body),
                                credentials: 'include'
                            }).then(res => res.json()).then(data => {
                                let CourseName = data.message.split('课程：')[1];
                                console.log(data);
                                appendGMAry_('SelectedCourses', {name: CourseName, body: xhrBodyToFetchBody(body)});
                            })
                        });
                    } else {
                        console.error('Error: ' + data.message);
                    }
                }
            });
        }
        return originalXHRSend.apply(this, arguments);
    };

    async function changeRaceStatus_(targetCourses, interval) {
        alert('SUSTech tis cheater: start');
        while (GM_getValue('Start')) {
            for (let i = 0; i < targetCourses.length; i++) {
                fetch('https://tis.sustech.edu.cn/Xsxk/addGouwuche', {
                    method: 'POST',
                    headers: FetchHeaders,
                    body: targetCourses[i].body,
                    credentials: 'include'
                }).then(res => res.json())
                    .then(data => {
                        if (data.jg === '1') {
                            console.log('Success: ' + targetCourses[i].name)
                        }
                    });
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
        alert('SUSTech tis cheater: stopped');
    }

    GM_registerMenuCommand("Start", () => {
        GM_setValue('Start', '1');
        changeRaceStatus_(getGMAry_('SelectedCourses'), GM_getValue('Interval', 200));
    });

    GM_registerMenuCommand("Stop", () => {
        clearGM_('Start')
    });

    GM_registerMenuCommand("Show selected", () => {
        let courses = getGMAry_('SelectedCourses');
        let info = ''
        for (let i = 0; i < courses.length; ++i) {
            info += i + 1 + '. ' + courses[i].name + '\n';
        }
        confirm(info);
    });

    GM_registerMenuCommand("Clear all courses", () => {
        if (confirm('Are you sure to clear selected all courses?')) {
            clearGM_('SelectedCourses');
        }
    });

    GM_registerMenuCommand("Set Interval", () => {
        let interval = prompt('Set the interval between each request (ms)', GM_getValue('Interval', 200));
        GM_setValue('Interval', interval);
    });

    for (let i = 0; i < 10; ++i) {
        setInterval(enableAllButtons_, 2000);
    }
})();


