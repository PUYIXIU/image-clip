const imgTarget = document.getElementById('imgTarget')
const canvas = document.getElementById('preview-canvas')
const ctx = canvas.getContext('2d')
let scale = 1
canvas.width = 100
canvas.height = 100
imgTarget.style.left = (250 - imgTarget.width/2)
imgTarget.style.top = (250 - imgTarget.height/2)
const srcSize = [ // 原始尺寸
    imgTarget.width,
    imgTarget.height
]

let currentSize = [ // 当前尺寸
    imgTarget.width,
    imgTarget.height
]
let imgPos = [(250 - imgTarget.width/2),(250 - imgTarget.height/2)]
let texturePos = [(250 - imgTarget.width/2),(250 - imgTarget.height/2)]
let startPos = endPos = [0,0]
let isDragging = false
imgTarget.addEventListener('wheel', imgScale)
imgTarget.addEventListener('mousedown', imgStartDrag)

let leftRange = 200
let rightRange = 300 - imgTarget.width
let topRange = 200
let bottomRange = 300 - imgTarget.height
targetMap()
// 将图片映射到canvas上
function targetMap(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    console.log('-----------------')
    console.log('left top: '+ imgPos)
    console.log('width height: '+ currentSize)
    console.log('dleft dtop: '+[(200-imgPos[0]), (200/scale - imgPos[1])])
    console.log('dw dh: '+ [100*1/scale , 100*1/scale])
    // 滚轮缩小 图片左移 imgPos[0]偏大 left偏小 图片右偏
    // 滚轮放大 图片左移 imgPos[0]偏小 left偏大 图片右偏
    ctx.drawImage(imgTarget,
        // 200-imgPos[0], 200 - imgPos[1], 100 , 100,
        // (200-imgPos[0]), (200 - imgPos[1]), 100*1/scale , 100*1/scale,
        (200-texturePos[0]), (200 - texturePos[1]), 100*1/scale , 100*1/scale,
        0,0,canvas.width,canvas.height)
}

// 图片开始拖拽
function imgStartDrag(e){
    isDragging = true
    startPos = [e.offsetX, e.offsetY]
    imgTarget.addEventListener('mousemove', imgDragging)
    imgTarget.addEventListener('mouseup', imgEndDrag)
}

// 图片正在拖拽
function imgDragging(e){
    if(isDragging){
        endPos = [e.offsetX, e.offsetY]
        let dist = [
            endPos[0] - startPos[0],
            endPos[1] - startPos[1],
        ]
        if((imgPos[0]+dist[0])<=leftRange && (imgPos[0]+dist[0])>=rightRange ){
            imgPos[0] = imgPos[0]+dist[0]
            texturePos[0] =  texturePos[0]+dist[0]
            imgTarget.style.left = imgPos[0] + 'px'
        }
        if((imgPos[1]+dist[1])<=topRange && (imgPos[1]+dist[1])>=bottomRange ){
            imgPos[1] = imgPos[1]+dist[1]
            texturePos[1] =  texturePos[1]+dist[1]
            imgTarget.style.top = imgPos[1] + 'px'
        }
        targetMap()
    }
}

// 结束拖拽
function imgEndDrag(e){
    imgTarget.removeEventListener('mousemove', imgDragging)
    isDragging = false
}

// 缩放
function imgScale(e){
    debugger
    let oldSize = [currentSize[0],currentSize[1]]
    if(e.wheelDelta > 0 && scale<5){
        scale += 0.05 // 46 -> 5 
        texturePos[0] -= 100*0.02
        texturePos[1] -= 100*0.02
        imgPos[0] -= 5
        imgPos[1] -= 5
        currentSize[0]+=10
        currentSize[1]+=10
    }else if(currentSize[0]>=300 && currentSize[1]>=300){
        scale -= 0.05
        texturePos[0] += 5
        texturePos[1] += 5
        imgPos[0] += 5
        imgPos[1] += 5
        currentSize[0]-=10
        currentSize[1]-=10
    }
    // currentSize = [
    //     // srcSize[0]*scale,
    //     // srcSize[1]*scale,
    //     srcSize[0]+scale*5,
    //     srcSize[1]+scale*5,
    // ]
    imgTarget.style.width = currentSize[0]+'px'    
    imgTarget.style.height = currentSize[1]+'px' 
    // imgPos[0] -= (currentSize[0]-oldSize[0])/2
    // imgPos[1] -= (currentSize[1]-oldSize[1])/2
    imgTarget.style.left = imgPos[0] + 'px'
    imgTarget.style.top = imgPos[1] + 'px'
    targetMap()
}