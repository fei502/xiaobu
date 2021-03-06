let originWidth; 
let originHeight; 
let container = document.getElementById('container');
let imgDiv = document.getElementById('imgDiv');    
let btnDiv = document.getElementById('btnDiv');
let clipImgDiv = document.getElementById('clipImgDiv'); 
let btn1 = document.getElementById('btn1');   
let btn2 = document.getElementById('btn2');   
let btn3 = document.getElementById('btn3'); 
var oRelDiv = document.createElement("div"); 
var scaleX = 1;
var scaleY = 1;  
let params = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    currentX: 0,
    currentY: 0,
    flag: false,
    kind: "drag"
};


container.style.display = 'flex';
container.style.flexDirection = 'column';
btnDiv.style.marginBottom = '20px';
btnDiv.style.height = '30px';
imgDiv.style.marginBottom = '20px';

var myCanvas = document.createElement('canvas');
myCanvas.setAttribute('id', 'myCanvas');
myCanvas.style.display = 'block';
myCanvas.width = 600;
myCanvas.height = 600;
myCanvas.style.border = "1px solid #d3d3d3";
myCanvas.innerText = '您的浏览器不支持 HTML5 canvas 标签。';
myCanvas.style.zIndex = 'auto';
var ctx = myCanvas.getContext('2d');
var img = new Image();
img.src = './images/IMG_1550.jpg';
img.setAttribute('id', 'img');
img.width = 600;
img.height = 600;
img.onload = function () {
    console.log('onload()执行...');
    ctx.drawImage(img, 0, 0, 600, 600);
    originWidth = img.naturalWidth;
    originHeight = img.naturalHeight;
    console.log('图片原始宽度=', originWidth);
    console.log('图片原始高度=', originHeight);
};
let clipImg = new Image();
clipImg.src = '';
clipImg.style.height = '100px';
clipImg.style.width = '100px';
clipImg.alt = '裁剪获得图片...';
let fileInput = document.createElement('input');
fileInput.setAttribute('multiple', 'multiple');
fileInput.setAttribute('type', 'file');
fileInput.setAttribute('id', 'fileInput');
imgDiv.appendChild(myCanvas);
let getObjectURL = function (file) {
    let url = null;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    }
    return url;
};
// 获取指定元素DOM
const ID = function (id) {
    return document.getElementById(id);
};
//获取相关CSS属性方法
let getCss = function (o, key) {
    return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};
// 打开本地图片
fileInput.addEventListener('change', function () {
    console.log('change()执行...');
    img.src = getObjectURL(this.files[0]);
});
btn3.addEventListener("click", function () {
    fileInput.click();
});
btn1.addEventListener("click", function () {
    var clickFlag = false;
    // 获取canvas中图片实际大小
    var iCurWidth = img.width;
    var iCurHeight = img.height;
    console.log('图片当前实际宽度=', iCurWidth);
    console.log('图片当前实际高度=', iCurHeight);
    // 可调整截图框
    oRelDiv.innerHTML = '';
    oRelDiv.style.position = "absolute";
    oRelDiv.style.width = iCurWidth + "px";
    oRelDiv.style.height = iCurHeight + "px";
    oRelDiv.style.top = myCanvas.offsetTop + 'px';
    console.log('oRelDiv.style.top = ', oRelDiv.style.top);
    oRelDiv.id = "cropContainer";

    var iOrigWidth = originWidth;
    var iOrigHeight = originHeight;
    scaleX = iCurWidth / iOrigWidth; // 图片宽度缩放比例（当前实际/原始）
    scaleY = iCurHeight / iOrigHeight;  // 图片高度缩放比例（当前实际/原始）
    console.log('图片横向（宽度）缩放比=', scaleX);
    console.log('图片纵向（高度）缩放比=', scaleY);

    // 将oRelDiv插入到myCanvas前
    myCanvas.parentNode.insertBefore(oRelDiv, myCanvas);

    //初始化坐标与剪裁高宽
    var cropW = 80; //截图框默认宽度
    var cropH = 80; //截图框默认高度
    var posX = myCanvas.width / 2 - cropW / 2;  // 截图框左上角x坐标
    var posY = myCanvas.height / 2 - cropH / 2;    // 截图框左上角y坐标
    oRelDiv.innerHTML = '<div id="zxxCropBox" style="height:' + cropH + 'px; width:' + cropW + 'px; position:absolute; left:' +
        posX + 'px; top:' + posY + 'px; border:1px solid black;">' +
        '<div id="zxxDragBg" style="height:100%; background:white; opacity:0.3; filter:alpha(opacity=30); cursor:move"></div>' +
        '<div id="dragLeftTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:-3px; cursor:nw-resize;"></div>' +
        '<div id="dragLeftBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; bottom:-3px; cursor:sw-resize;"></div>' +
        '<div id="dragRightTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:-3px; cursor:ne-resize;"></div>' +
        '<div id="dragRightBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; bottom:-3px; cursor:se-resize;"></div>' +
        '<div id="dragTopCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; top:-3px; left:50%; margin-left:-3px; cursor:n-resize;"></div>' +
        '<div id="dragBotCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; bottom:-3px; left:50%; margin-left:-3px; cursor:s-resize;"></div>' +
        '<div id="dragRightCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:50%; margin-top:-3px; cursor:e-resize;"></div> ' +
        '<div id="dragLeftCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:50%; margin-top:-3px; cursor:w-resize;"></div>' +
        '</div>' +
        '<input type="text" id="cropPosX" value="' + posX / scaleX + '" style="position:relative; top: -26px; width: 30px"/>' +
        '<input type="text" id="cropPosY" value="' + posY / scaleY + '" style="position:relative; top: -26px; width: 30px"/>' +
        '<input type="text" id="cropImageWidth" value="' + cropW / scaleX + '" style="position:relative; top: -26px; width: 30px"/>' +
        '<input type="text" id="cropImageHeight" value="' + cropH / scaleY + '" style="position:relative; top: -26px; width: 30px"/>';

    var startDrag = function (point, target, kind) {
        params.width = getCss(target, "width");
        params.height = getCss(target, "height");
        //初始化坐标
        if (getCss(target, "left") !== "auto") {
            params.left = getCss(target, "left");
        }
        if (getCss(target, "top") !== "auto") {
            params.top = getCss(target, "top");
        }
        //target是移动对象
        point.onmousedown = function (event) {
            params.kind = kind;
            params.flag = true;
            clickFlag = true;
            if (!event) {
                event = window.event;
            }
            var e = event;
            params.currentX = e.clientX;  //鼠标按下时坐标x轴
            params.currentY = e.clientY;  //鼠标按下时坐标y轴
            point.onselectstart = function () {
                return false;
            };

            document.onmousemove = function (event) {
                let e = event ? event : window.event;
                clickFlag = false;
                if (params.flag) {
                    var nowX = e.clientX; // 鼠标移动时x坐标
                    var nowY = e.clientY;   // 鼠标移动时y坐标
                    var disX = nowX - params.currentX;  // 鼠标x方向移动距离
                    var disY = nowY - params.currentY;  // 鼠标y方向移动距离
                    if (params.kind === "n") {
                        target.style.top = parseInt(params.top) + disY + "px";
                        target.style.height = parseInt(params.height) - disY + "px";
                    } else if (params.kind === "w") { //左拉伸
                        target.style.left = parseInt(params.left) + disX + "px";
                        target.style.width = parseInt(params.width) - disX + "px";
                    } else if (params.kind === "e") { //右拉伸
                        target.style.width = parseInt(params.width) + disX + "px";
                    } else if (params.kind === "s") { //下拉伸
                        target.style.height = parseInt(params.height) + disY + "px";
                    } else if (params.kind === "nw") { //左上拉伸
                        target.style.left = parseInt(params.left) + disX + "px";
                        target.style.width = parseInt(params.width) - disX + "px";
                        target.style.top = parseInt(params.top) + disY + "px";
                        target.style.height = parseInt(params.height) - disY + "px";
                    } else if (params.kind === "ne") { //右上拉伸
                        target.style.top = parseInt(params.top) + disY + "px";
                        target.style.height = parseInt(params.height) - disY + "px";
                        target.style.width = parseInt(params.width) + disX + "px";
                    } else if (params.kind === "sw") { //左下拉伸
                        target.style.left = parseInt(params.left) + disX + "px";
                        target.style.width = parseInt(params.width) - disX + "px";
                        target.style.height = parseInt(params.height) + disY + "px";
                    } else if (params.kind === "se") { //右下拉伸
                        target.style.width = parseInt(params.width) + disX + "px";
                        target.style.height = parseInt(params.height) + disY + "px";
                    } else { //移动
                        target.style.left = parseInt(params.left) + disX + "px";
                        target.style.top = parseInt(params.top) + disY + "px";
                    }
                }

                document.onmouseup = function () {

                    params.flag = false;
                    if (getCss(target, "left") !== "auto") {
                        params.left = getCss(target, "left");
                    }
                    if (getCss(target, "top") !== "auto") {
                        params.top = getCss(target, "top");
                    }
                    params.width = getCss(target, "width");
                    params.height = getCss(target, "height");
                    posX = parseInt(target.style.left);
                    posY = parseInt(target.style.top);
                    cropW = parseInt(target.style.width);
                    cropH = parseInt(target.style.height);
                    if (posX < 0) {
                        posX = 0;
                    }
                    if (posY < 0) {
                        posY = 0;
                    }
                    if ((posX + cropW) > iCurWidth) {
                        cropW = iCurWidth - posX;
                    }
                    if ((posY + cropH) > iCurHeight) {
                        cropH = iCurHeight - posY;
                    }
                    //赋值
                    ID("cropPosX").value = posX;
                    ID("cropPosY").value = posY;
                    ID("cropImageWidth").value = parseInt(ID("zxxCropBox").style.width);
                    ID("cropImageHeight").value = parseInt(ID("zxxCropBox").style.height);
                };
            }
        };
    };

    //绑定拖拽
    startDrag(ID("zxxDragBg"), ID("zxxCropBox"), "drag");
    //绑定拉伸
    startDrag(ID("dragLeftTop"), ID("zxxCropBox"), "nw");
    startDrag(ID("dragLeftBot"), ID("zxxCropBox"), "sw");
    startDrag(ID("dragRightTop"), ID("zxxCropBox"), "ne");
    startDrag(ID("dragRightBot"), ID("zxxCropBox"), "se");
    startDrag(ID("dragTopCenter"), ID("zxxCropBox"), "n");
    startDrag(ID("dragBotCenter"), ID("zxxCropBox"), "s");
    startDrag(ID("dragRightCenter"), ID("zxxCropBox"), "e");
    startDrag(ID("dragLeftCenter"), ID("zxxCropBox"), "w");
    ID("myCanvas").onselectstart = function () {
        return false;
    };
    img.onselectstart = function () {
        return false;
    };
});
function cropImage(img, cropPosX, cropPosY, width, height) {
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'newCanvas');
    newCanvas.width = width * scaleX;
    newCanvas.height = height * scaleY;
    newCanvas.style.border = "1px solid #d3d3d3";
    var newCtx = newCanvas.getContext('2d');
    clipImgDiv.appendChild(newCanvas);
    newCtx.drawImage(img, cropPosX, cropPosY, width, height, 0, 0, width * scaleX, height * scaleY);
    var newImage = new Image();
    newImage.src = newCanvas.toDataURL("image/png");
    newImage.style.marginLeft = '5px';
    clipImgDiv.appendChild(newImage);

    oRelDiv.innerHTML = '';
}
btn2.addEventListener("click", function () {
    console.log("clipend......");
    var x = document.getElementById("cropPosX").value;
    var y = document.getElementById("cropPosY").value;
    var w = document.getElementById("cropImageWidth").value;
    var h = document.getElementById("cropImageHeight").value;
    console.log('cropImage(img,', x, ',', y, ',', parseInt(w), ',', parseInt(h), ')');
    cropImage(img, x / scaleX, y / scaleY, parseInt(w) / scaleX, parseInt(h) / scaleY);
});