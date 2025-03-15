// ==UserScript==
// @name         SUSTech tis cheater
// @namespace    https://blog.vollate.top/
// @version      1.3.3
// @description  SUSTech 可能会变质，但绝对不会倒闭
// @author       Vollate
// @match        https://tis.sustech.edu.cn/*
// @icon         https://www.sustech.edu.cn/static/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://s4.zstatic.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at       document-end
// ==/UserScript==

(function ($) {
    $(document).ready(function () {
        'use strict';
        const DEFAULT_INTERVAL = 1600;
        const language = navigator.language || navigator.userLanguage;
        const platform = navigator.platform;
        const ua = navigator.userAgent;

        let secChUa = "";
        let secChUaMobile = "";
        let secChUaPlatform = "";
        if (navigator.userAgentData) {
            secChUa = navigator.userAgentData.brands.map(b => `"${b.brand}";v="${b.version}"`).join(", ");
            secChUaMobile = navigator.userAgentData.mobile ? "?1" : "?0";
            secChUaPlatform = navigator.userAgentData.platform;
        } else {
            secChUa = `"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"`;
            secChUaMobile = "?0";
            secChUaPlatform = platform;
        }

        const FetchHeaders = {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": language,
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
            "sec-ch-ua": secChUa,
            "sec-ch-ua-mobile": secChUaMobile,
            "sec-ch-ua-platform": secChUaPlatform
        };

        const CSSManager = {
            modalOverlay: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: '1000'
            }, modal: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                zIndex: '9999',
                maxWidth: '400px',
                width: '100%'
            }, modalTitle: {
                margin: '0 0 20px 0',
                fontSize: '20px',
                textAlign: 'center',
                color: '#333',
                borderBottom: '2px solid #ddd',
                paddingBottom: '10px'
            }, courseLine: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '10px',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
                color: '#555'
            }, deleteButton: {
                padding: '5px 10px',
                backgroundColor: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
            }, closeButton: {
                display: 'block',
                margin: '20px auto 0',
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
            }, confirmButton: {
                display: 'block',
                margin: '20px auto 0',
                padding: '10px 20px',
                backgroundColor: '#0cdf24',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
            }, popupNotification: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: '#01af15',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: '1001',
                fontSize: '16px',
                opacity: '0.9',
                display: 'flex',
                alignItems: 'center'
            }, popupErrorNotification: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: '#af012a',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: '1001',
                fontSize: '16px',
                opacity: '0.9',
                display: 'flex',
                alignItems: 'center'
            }, messageContainer: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '300px',
                maxHeight: '200px',
                backgroundColor: '#f1f1f1',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                padding: '10px',
                zIndex: '1001',
                fontSize: '14px',
                color: '#333',
                display: 'flex',
                flexDirection: 'column'
            }, messageHeader: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #ddd',
                paddingBottom: '8px',
                marginBottom: '10px',
                fontWeight: 'bold',
                position: 'sticky',
                top: '0',
                backgroundColor: '#f1f1f1',
                zIndex: '1001'
            }, timeInput: {
                width: '60px', padding: '5px', marginRight: '10px', fontSize: '16px'
            }
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        function showAsyncPopup(message, css_style, duration) {
            let $popup = $('<div>').css(css_style);

            $popup.text(message);

            $('body').append($popup);

            setTimeout(() => {
                $popup.fadeOut(300, function () {
                    $(this).remove();
                });
            }, duration);
        }

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

        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            originalXHROpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function (body) {
            if (this._url.endsWith('Xsxk/addGouwuche')) {
                this.addEventListener('readystatechange', function () {
                    if (this.readyState === 4) {
                        new Promise(resolve => setTimeout(resolve, 4000)).then(() => {
                            fetch(this._url, {
                                method: 'POST',
                                headers: FetchHeaders,
                                body: xhrBodyToFetchBody(body),
                                credentials: 'include'
                            }).then(res => res.json()).then(data => {
                                console.log(data);
                                let courseName = data.message.split('课程：')[1];
                                showAsyncPopup("Add course \"" + courseName + "\" to course list", CSSManager.popupNotification, 5000);
                                appendGMAry_('SelectedCourses', {name: courseName, body: xhrBodyToFetchBody(body)});
                            }).catch(err => {
                                console.error(err);
                                showAsyncPopup("Failed to add course to course list", CSSManager.popupErrorNotification, 5000);
                            })
                        });
                    }
                });
            }
            return originalXHRSend.apply(this, arguments);
        };

        function createMessageContainer() {
            let $container = $('<div id="messageContainer">').css(CSSManager.messageContainer);

            let $header = $('<div>').css(CSSManager.messageHeader);

            $header.text('Messages');

            let $closeButton = $('<span>').text('×').css({
                cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', lineHeight: '1'
            });

            $closeButton.on('click', function () {
                $container.remove();
            });

            $header.append($closeButton);
            $container.append($header);
            $container.append($('<div id="messageContent">').css({
                flex: '1', overflowY: 'auto'
            }));

            $('body').append($container);
        }

        function appendMessage(courseName) {
            let $message = $('<div>').text('Success: ' + courseName).css({
                padding: '5px 0', borderBottom: '1px solid #ddd'
            });

            $('#messageContent').append($message);
            // $('#messageContent').scrollTop($('#messageContent')[0].scrollHeight);
        }


        async function startRace_(targetCourses, interval) {
            if (targetCourses.length === 0) {
                alert('Your course list is empty, you need to add at least one course');
                return;
            }
            showAsyncPopup('SUSTech tis cheater: start', CSSManager.popupNotification, 5000);

            if ($('#messageContainer').length === 0) {
                createMessageContainer();
            }

            while (GM_getValue('Start') && targetCourses.length > 0) {
                for (let i = 0; i < targetCourses.length; i++) {
                    fetch('https://tis.sustech.edu.cn/Xsxk/addGouwuche', {
                        method: 'POST', headers: FetchHeaders, body: targetCourses[i].body, credentials: 'include'
                    }).then(res => res.json())
                        .then(data => {
                            if (data.jg === '1') {
                                console.log('Success: ' + targetCourses[i].name);
                                appendMessage(targetCourses[i].name);
                                targetCourses.splice(i, 1);
                                updateCourses(targetCourses);
                            }
                        });
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
            }

            showAsyncPopup('SUSTech tis cheater: stop', CSSManager.popupNotification, 5000);
        }

        function updateCourses(courses) {
            GM_setValue('SelectedCourses', JSON.stringify(courses));
        }

        let hadInit = false;

        async function initMenu() {
            if (hadInit) {
                return;
            }
            hadInit = true;
            GM_registerMenuCommand("Start", () => {
                GM_setValue('Start', '1');
                startRace_(getGMAry_('SelectedCourses'), GM_getValue('Interval', DEFAULT_INTERVAL));
            });

            GM_registerMenuCommand("Schedule Start", () => {
                const $modalOverlay = $('<div>')
                    .css(CSSManager.modalOverlay)
                    .attr('id', 'schedule-modal-overlay');

                const $modal = $('<div>')
                    .css(CSSManager.modal)
                    .attr('id', 'schedule-modal');

                const $title = $('<h2>')
                    .text('Schedule Start')
                    .css(CSSManager.modalTitle);

                const $inputGroup = $('<div>')
                    .css({
                        display: 'flex', justifyContent: 'space-around', margin: '20px 0'
                    });

                const $hourInput = $('<input>')
                    .attr({
                        type: 'number', placeholder: 'HH', min: '0', max: '23'
                    })
                    .css(CSSManager.timeInput);

                const $minuteInput = $('<input>')
                    .attr({
                        type: 'number', placeholder: 'MM', min: '0', max: '59'
                    })
                    .css(CSSManager.timeInput);

                const $secondInput = $('<input>')
                    .attr({
                        type: 'number', placeholder: 'SS', min: '0', max: '59'
                    })
                    .css(CSSManager.timeInput);

                $inputGroup.append($hourInput, $minuteInput, $secondInput);

                const $confirmButton = $('<button>')
                    .text('Confirm')
                    .css(CSSManager.confirmButton)
                    .on('click', () => {
                        const hours = parseInt($hourInput.val(), 10) || 0;
                        const minutes = parseInt($minuteInput.val(), 10) || 0;
                        const seconds = parseInt($secondInput.val(), 10) || 0;

                        const now = new Date();
                        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

                        let remainingTime = targetTime - now;

                        if (remainingTime <= 0) {
                            targetTime.setDate(targetTime.getDate() + 1);
                            remainingTime = targetTime - now;
                        }

                        if (remainingTime <= 0) {
                            alert('Please enter a valid future time!');
                            return;
                        }

                        $modalOverlay.remove();

                        setTimeout(() => {
                            GM_setValue('Start', '1');
                            startRace_(getGMAry_('SelectedCourses'), GM_getValue('Interval', DEFAULT_INTERVAL));
                        }, remainingTime);

                        alert(`Task scheduled to run at ${targetTime.toLocaleTimeString()} (${Math.floor(remainingTime / 1000)} seconds from now)`);
                    });

                const $cancelButton = $('<button>')
                    .text('Cancel')
                    .css(CSSManager.closeButton)
                    .on('click', () => {
                        $modalOverlay.remove();
                    });

                const $buttonGroup = $('<div>')
                    .css({
                        display: 'flex', justifyContent: 'center', gap: '20px'
                    })
                    .append($cancelButton, $confirmButton);

                $modal.append($title, $inputGroup, $buttonGroup);
                $modalOverlay.append($modal);
                $(window.top.document.body).append($modalOverlay);
            });


            GM_registerMenuCommand("Stop", () => {
                clearGM_('Start')
            });

            GM_registerMenuCommand("Show selected", async () => {
                let courses = getGMAry_('SelectedCourses');
                let $modalOverlay = $('<div>').addClass('sustc-modal-overlay').attr('id', 'sustc-modal-overlay').css(CSSManager.modalOverlay);
                let $modal = $('<div>').css(CSSManager.modal);
                let $modalTitle = $('<h2>').text('Selected Courses').css(CSSManager.modalTitle);
                $modal.append($modalTitle);
                let $courseList = $('<div>');

                if (courses.length === 0) {
                    let $emptyMessage = $('<div>').text('No courses selected').css({
                        textAlign: 'center', fontSize: '16px', color: '#888', padding: '20px 0'
                    });
                    $courseList.append($emptyMessage);
                }

                for (let i = 0; i < courses.length; ++i) {
                    let $courseLine = $('<div>').css(CSSManager.courseLine);
                    let $courseInfo = $('<span>').text((i + 1) + '. ' + courses[i].name);
                    let $deleteButton = $('<button>').text('Delete').css(CSSManager.deleteButton);
                    $deleteButton.on('click', function () {
                        courses.splice(i, 1);
                        updateCourses(courses);
                        $courseLine.remove();
                    });
                    $courseLine.append($courseInfo).append($deleteButton);
                    $courseList.append($courseLine);
                }

                $modal.append($courseList);

                let $closeButton = $('<button>').text('Close').css(CSSManager.closeButton);

                $closeButton.on('click', function () {
                    $modalOverlay.remove();
                });

                $modal.append($closeButton);
                $modalOverlay.append($modal);

                $(window.top.document.body).append($modalOverlay);
            });

            GM_registerMenuCommand("Clear all courses", () => {
                if (confirm('Are you sure to clear all selected courses?')) {
                    clearGM_('SelectedCourses');
                }
            });

            GM_registerMenuCommand("Set Interval", () => {
                let interval = prompt('Set the interval between each request (ms)', GM_getValue('Interval', DEFAULT_INTERVAL));
                GM_setValue('Interval', interval);
            });
        }

        setInterval(enableAllButtons_, 2000);
        if (window.self !== window.top) {
            return;
        }
        clearGM_('Start');
        initMenu();
    });
})(jQuery.noConflict(true));