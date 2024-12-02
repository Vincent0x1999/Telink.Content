function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
function setDisplay(elementId, isShow) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isShow === undefined) {
            element.classList.toggle('hidden');
        } else {
            if (isShow) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    }
}
function setDisabled(elementId, isDisabled) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isDisabled) {
            element.classList.add('disabled');
        } else {
            element.classList.remove('disabled');
        }
    }
}
function setContentByDataAttribute(dataAttribute, content) {

    const elements = document.querySelectorAll(`[data-${dataAttribute}]`);
    elements.forEach(element => {
        element.textContent = content;
    });
}
function isExist(elementId) {
    const element = document.getElementById(elementId);
    return element != null;
}
function setContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element instanceof HTMLDivElement) {
            element.innerHTML = content;
        } else if (element instanceof HTMLInputElement) {
            element.value = content;
        } else if (element instanceof HTMLSpanElement) {
            element.innerText = content;
        } else if (element instanceof HTMLSelectElement) {
            element.value = content;
        } else if (element instanceof HTMLTextAreaElement) {
            element.value = content;
        } else if (element instanceof HTMLAnchorElement) {
            element.innerHTML = content;
        }
    }
}
function getContent(elementId) {

    const element = document.getElementById(elementId);
    if (element) {
        if (element instanceof HTMLInputElement) {
            return element.value;
        } else if (element instanceof HTMLDivElement) {
            return element.innerHTML;
        } else if (element instanceof HTMLSpanElement) {
            return element.innerText;
        } else if (element instanceof HTMLSelectElement) {
            return element.value;
        } else if (element instanceof HTMLTextAreaElement) {
            return element.value;
        } else if (element instanceof HTMLAnchorElement) {
            return element.innerText;
        }

    }
    return '';
}
function getData(elementId, dataAttribute) {
    const element = document.getElementById(elementId);
    if (element) {
        return element.getAttribute(`data-${dataAttribute}`);
    }
    return '';
}
function ConvertShortAddress(str,maxnum) {
    if (str.length <= maxnum) {
        return str;
    }
    return str.substring(0, maxnum/2) + "..." + str.substring(str.length - maxnum/2);
}
function convertUtcToLocal(utcTimeString) 
{
    if (!utcTimeString.endsWith('Z') && !utcTimeString.includes('+00:00')) {
        utcTimeString += 'Z'; 
    }
    var utcDate = new Date(utcTimeString);
    let options={ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    // const timeFormat = 'datetime';
    // if (timeFormat)
    // {
    //     switch (timeFormat) {
    //         case 'datetime':
    //             options = {month: '2-digit', day: '2-digit' };
    //             break;
    //         case 'time':
    //             options = { hour: '2-digit', minute: '2-digit' };
    //             break;
    //     }
    // }

    return utcDate.toLocaleString(undefined, options);
}
function validTextLength(text,min,max){
    return text.length >= min && text.length <= max;
}
function validPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function timer(func,ms) {
    return setInterval(() => {
        if (func && typeof func === 'function') {
            func();
        }
    }, ms); 
}
async function doWebService(url,action, method, get_params, post_content) {
    const fetchContent = method == 'GET' ? { method: 'GET' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: post_content };
    const fetchurl = url+"?action=" + action + "&" + get_params ;
    try {
        const response = await fetch(fetchurl, fetchContent);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
function checkEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function tgConfirm(msg,callback)
{
    window.Telegram.WebApp.showConfirm(msg, function(response) {
        callback(response);
    });
}
function tgAlert(msg)
{
    window.Telegram.WebApp.showAlert(msg);
}
function toPage(url) {
    window.location.href =url;
}
function tgOpenWindow(url) {
    window.Telegram.WebApp.openTelegramLink(url);
}
function doOnScrollDown(callback,msgdivid) {
    const downtip='Scroll down to get points &#x2193; &#x2193; &#x2193;';
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if (scrolled >= scrollableHeight) {
        callback();
    } else {
        setContent(msgdivid, downtip);
        window.addEventListener('scroll', function handleScroll() {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            if (scrolled >= scrollableHeight) {
                window.removeEventListener('scroll', handleScroll);
                callback();
            } else {
                setContent(msgdivid, downtip);
            }
        });
    }
}
async function getCountryByIP(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return data.country_name;
    } catch (error) {
        console.error('error:', error);
        return null;
    }
}

function showMessageAndRedirect(msg,redirectUrl) {
    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'redirectMsg';

    const message = document.createElement('p');
    message.textContent = msg;

    const countdown = document.createElement('p');
    countdown.id = 'countdown';
    countdown.textContent = '5';

    countdownContainer.appendChild(message);
    countdownContainer.appendChild(countdown);
    document.body.innerHTML = '';
    document.body.appendChild(countdownContainer);

    let timeLeft = 5;
    const timer = setInterval(() => {
        timeLeft -= 1;
        countdown.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            window.location.href = redirectUrl;
        }
    }, 1000);
}

async function getTgCloudData(key)
{
    return new Promise((resolve) => {
        Telegram.WebApp.CloudStorage.getItem(key, function(ex, value) {
            if (!ex) {
                resolve(value);
            } else {
                resolve(null); 
            }
        });
    });
}
function setTgCloudData(key,value)
{
    Telegram.WebApp.CloudStorage.setItem(key, value);
}
function isExistFunction(fname) {
    return typeof this[fname] === 'function';
}
function checkAddress_Ton(address)
{
    const tonWalletAddressPattern = /^(EQ|UQ)[a-zA-Z0-9_-]{46}$/;
    return tonWalletAddressPattern.test(address);
}
async function doFunctionByName(fname, params = null) {
    if (typeof this[fname] === 'function') {
        if (this[fname].constructor.name === 'AsyncFunction') {
            if (params) {
                return await this[fname](params);
            } else {
                return await this[fname]();
            }
        } else {
            if (params) {
                return this[fname](params);
            } else {
                return this[fname]();
            }
        }
    }
}
function setLanguage(culture) {
    if (culture==null) {
        document.cookie = `CultureInfo=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }else{
    // 设置Cookie
    document.cookie = `CultureInfo=${culture};path=/`;
    }
    // 刷新页面
    location.reload();
}
function language(key){
    // if (window.Language[key]) {
    //     return window.Language[key];
    // }
    // return key;
    if (Language[key]) {
            return Language[key];
        }
        return key;
}
function setwaithandle(handleElement){
        window.waithanle=handleElement;
        window.waithanlehtml=handleElement.innerHTML;
}
function processwaithandle(){
    if(window.waithanle!=null){
        window.waithanle.innerHTML = `<div class="spinner-container center"> <div class="spinner"></div></div>`;
    }
}
function clearwaithandle(){
    if(window.waithanle!=null){
        window.waithanle.innerHTML=window.waithanlehtml;
        window.waithanle=null;
        window.waithanlehtml=null;
    }
}
function fileUrl(path){
    //https://github.com/Vincent0x1999/Telink.Content/blob/main/img/activity/3/banner.png?raw=true
    return `https://vincent0x1999.github.io/Telink.Content/${path}`;
}
class custom_alert {
    constructor(html, type = 'info', mode = 'auto') {
        this.html = html;
        this.type = type;
        this.mode = mode;
        this.duration = duration;
        this.alertContainer = null;
        this.init();
    }

    init() {
        // 创建提示框容器
        this.alertContainer = document.createElement('div');
        this.alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            max-width: 90%;
            display: none;
        `;
        document.body.appendChild(this.alertContainer);

        // 显示提示框
        this.show();
    }

    show() {
        // 创建提示框
        const alertBox = document.createElement('div');
        alertBox.className = type;
        alertBox.innerHTML = `
            <div class="custom_alert_content">${this.html}</div>
            ${this.mode === 'manual' ? '<button class="custom_alert_close">Close</button>' : ''}
        `;

        // 添加关闭事件
        if (this.mode === 'manual') {
            alertBox.querySelector('.custom_alert_close').addEventListener('click', () => {
                this.alertContainer.removeChild(alertBox);
                if (this.alertContainer.children.length === 0) {
                    this.alertContainer.style.display = 'none';
                }
            });
        }

        // 显示提示框
        this.alertContainer.appendChild(alertBox);
        this.alertContainer.style.display = 'block';

        // 自动消失
        if (this.mode === 'auto') {
            setTimeout(() => {
                if (this.alertContainer.contains(alertBox)) {
                    this.alertContainer.removeChild(alertBox);
                }
                if (this.alertContainer.children.length === 0) {
                    this.alertContainer.style.display = 'none';
                }
            }, 3000);
        }
    }
}
// custom select


class custom_select {
    constructor(panelId, options, onChangeCallback = null) {
        this.panelId = panelId;
        this.options = options;
        this.onChangeCallback = onChangeCallback;
        this.selected = null; 
        this.init();
    }

    init() {
        const panel = document.getElementById(this.panelId);
        if (!panel) {
            console.error(`Panel with id ${this.panelId} not found.`);
            return;
        }

        // 创建选择框的 HTML 结构
        const selectContainer = document.createElement('div');
        selectContainer.className = 'custom_select';

        this.selected = document.createElement('div');
        this.selected.className = 'custom_select_selected';


        const firstOption = this.options[0];
        this.selected.innerHTML = firstOption.html;
        this.selected.setAttribute('data-value', firstOption.value);
        

        selectContainer.appendChild(this.selected);

        const items = document.createElement('div');
        items.className = 'custom_select_items';
        items.style.display = 'none';

        this.options.forEach(option => {
            const item = document.createElement('div');
            item.setAttribute('data-value', option.value);
            item.innerHTML = option.html;
            items.appendChild(item);
        });

        selectContainer.appendChild(items);
        panel.appendChild(selectContainer);

        // 添加事件监听器
        this.selected.addEventListener('click', () => {
            items.style.display = items.style.display === 'block' ? 'none' : 'block';
        });

        items.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', () => {
                this.selected.innerHTML = item.innerHTML;
                this.selected.setAttribute('data-value', item.getAttribute('data-value'));
                items.style.display = 'none';
                if (this.onChangeCallback) {
                    this.onChangeCallback(this.selected.getAttribute('data-value'));
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!selectContainer.contains(e.target)) {
                items.style.display = 'none';
            }
        });
    }

    // 新增方法：获取当前选中项的 value
    getValue() {
        return this.selected ? this.selected.getAttribute('data-value') : null;
    }
}




//custom carousel
class custom_carousel {
    constructor(elementid=null, htmls) {
        this.elementid = elementid;
        this.htmls = htmls;
        this.panel =elementid==null?document.createElement("div"): document.getElementById(this.elementid);
        this.carousel = document.createElement('div');
        this.carousel.className = 'custom_carousel';
        this.carouselInner = document.createElement('div');
        this.carouselInner.className = 'custom_carousel_inner';
        this.carousel.appendChild(this.carouselInner);
        this.panel.appendChild(this.carousel);

        for (let i = 0; i < this.htmls.length; i++) {
            const card = document.createElement('div');
            card.className = 'custom_carousel_item';
            card.innerHTML = this.htmls[i];
            this.carouselInner.appendChild(card);
        }

        this.totalItems = this.htmls.length;
        this.startX = 0;
        this.currentIndex = 0;

        // 创建提示元素
        this.leftIndicator = document.createElement('div');
        this.leftIndicator.className = 'custom_carousel_indicator left-indicator';
        this.leftIndicator.addEventListener('click', () => this.showPreviousCard());
        // this.leftIndicator.innerText = '←';
        this.panel.appendChild(this.leftIndicator);

        this.rightIndicator = document.createElement('div');
        this.rightIndicator.className = 'custom_carousel_indicator right-indicator';
        this.rightIndicator.addEventListener('click', () => this.showNextCard());
        // this.rightIndicator.innerText = '→';
        this.panel.appendChild(this.rightIndicator);

        // 初始化提示元素的显示状态
        this.updateIndicators();

        this.carousel.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.carousel.addEventListener('touchend', (e) => {
            const moveX = e.changedTouches[0].clientX;
            const diffX = this.startX - moveX;
            if (diffX > 50) {
                this.showNextCard();
            } else if (diffX < -50) {
                this.showPreviousCard();
            }
        });
        
    }

    updateIndicators() {
        if (this.currentIndex > 0) {
            this.leftIndicator.style.display = 'block';
        } else {
            this.leftIndicator.style.display = 'none';
        }

        if (this.currentIndex < this.totalItems - 1) {
            this.rightIndicator.style.display = 'block';
        } else {
            this.rightIndicator.style.display = 'none';
        }
    }

    showNextCard() {
        if (this.currentIndex == this.totalItems - 1) {
            return;
        }
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.carouselInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateIndicators();
    }

    showPreviousCard() {
        if (this.currentIndex == 0) {
            return;
        }
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.carouselInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateIndicators();
    }
    html()
    {
        return this.panel.innerHTML;
    }
}



//custom tip_bottom

class tip_bottom {
    constructor(html) {
        this.html = html;
        this.overlay = null;
        this._div = null;
    }

    show() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        document.body.appendChild(this.overlay);

        this._div = document.createElement('div');
        this._div.classList.add("tip_bottom");
        this._div.innerHTML = this.html;
        document.body.appendChild(this._div);

        setTimeout(() => {
            this._div.classList.add('show');
            this.overlay.classList.add('show');
        }, 3);

        const closeButton = document.createElement('div');
        closeButton.classList.add("close");
        this._div.appendChild(closeButton);

        closeButton.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
    }

    updateHtml(newHtml) {
        this.html = newHtml;
        if (this._div) {
            this._div.innerHTML = this.html;

            // 重新添加关闭按钮
            const closeButton = document.createElement('div');
            closeButton.classList.add("close");
            this._div.appendChild(closeButton);

            closeButton.addEventListener('click', () => this.close());
        }
    }

    close() {
        if (this._div && this.overlay) {
            this._div.classList.remove('show');
            this.overlay.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(this._div);
                document.body.removeChild(this.overlay);
                this._div = null;
                this.overlay = null;
            }, 500);
        }
    }

    static clearAll() {
        const overlays = document.querySelectorAll('.overlay');
        const tipBottoms = document.querySelectorAll('.tip_bottom');

        overlays.forEach(overlay => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 500);
        });

        tipBottoms.forEach(tipBottom => {
            tipBottom.classList.remove('show');
            setTimeout(() => {
                if (tipBottom.parentNode) {
                    tipBottom.parentNode.removeChild(tipBottom);
                }
            }, 500);
        });
    }
}
// progressBar.js
class custom_progress {
    constructor(containerId=null, total,current,title=null) {
        this.container = containerId==null?document.createElement('div'):document.getElementById(containerId);
        this.total = total;
        this.current = current;
        this.title=title;

        
        
        // 创建进度条容器
        this.progressBarContainer = document.createElement('div');
        this.progressBarContainer.className = 'custom_progress_container';

        // 创建进度条
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'custom_progress_bar';
        this.progressBar.innerHTML = '<div class="custom_progress_rate">0%</div>';

        // 创建 current 标注
        this.currentLabel = document.createElement('div');
        this.currentLabel.className = 'custom_progress_label custom_progress_label_current';
        this.currentLabel.innerText =((this.title!=null && this.title.current)?this.title.current:"Current")+ `: ${this.current}`;

        // 创建 total 标注
        this.totalLabel = document.createElement('div');
        this.totalLabel.className = 'custom_progress_label custom_progress_label_total';
        this.totalLabel.innerText = ((this.title!=null && this.title.total)?this.title.total:"Total")+`: ${this.total}`;

        // 将进度条和标注添加到容器中
        this.progressBarContainer.appendChild(this.progressBar);
        this.progressBarContainer.appendChild(this.currentLabel);
        this.progressBarContainer.appendChild(this.totalLabel);
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        if(this.title!=null && this.title.banner!=null)
        {
            this.progressBarTitle = document.createElement('div');
            this.progressBarTitle.className = 'custom_progress_title';
            this.progressBarTitle.innerText =this.title.banner;
            this.container.appendChild(this.progressBarTitle);
        }
        
        this.container.appendChild(this.progressBarContainer);
        this.update();
    }

    setTotal(total) {
        this.total = total;
        this.totalLabel.innerText = `Total: ${this.total}`;
        this.update();
    }

    setCurrent(current) {
        this.current = current;
        this.currentLabel.innerText = `Current: ${this.current}`;
        this.update();
    }

    update() {
        let percentage = (this.current / this.total) * 100;
        this.progressBar.style.width = `${percentage<=0?1:percentage}%`;
        this.progressBar.innerHTML = `<div class="custom_progress_rate">${Math.round(percentage)}%</div>`;
    }
    html(){
        return this.container.innerHTML;
    }
}

// countdownTimer.js
class CountdownTimer {
    constructor(endTime, onTick, onComplete) {
        this.endTime = new Date(endTime).getTime();
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.intervalId = null;
    }

    start() {
        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.endTime - now;

        if (distance < 0) {
            clearInterval(this.intervalId);
            if (this.onComplete) {
                this.onComplete();
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (this.onTick) {
            this.onTick({ days, hours, minutes, seconds });
        }
    }
}
