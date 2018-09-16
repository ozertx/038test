// main


console.log("graph")

function Graph(view) {
    this.view = view
    this.setRender = render => this.render = render
    let t = null
    this.redraw = null
    let step=25

    let data = [] // { X , Y}

    this.setData = (arr) => {
        data = arr
        this.redraw()
    }

    this.render = (context) => {
        let items = []
        data.forEach( item => items.push({ X:item.X, Y:item.Y })) // clone setData
        //console.log(items);

        axis()
        context.lineWidth=2;
        context.fillText("default111",100,100)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(100, 0)
        context.moveTo(0, 0)
        context.lineTo(0, 100)
        context.stroke();

        // context.beginPath();
        // context.arc(100, 100, 5, 0, 2 * Math.PI, false);
        // context.fillStyle = "rgb(0, 0, 255)";
        // context.fill();


        items.forEach( item => {
            let X = item.X*step
            let Y = -item.Y*step
            context.beginPath();
            context.arc(X, Y, 5, 0, 2 * Math.PI, false);
            context.fillStyle = "rgb(0, 0, 255)";
            context.fill();
        })

        function axis() {
            let lt = 20

            context.beginPath()

            context.moveTo(-lt*step, 0)
            context.lineTo(+lt*step, 0)

            for( i = -lt; i<=lt; i++ ){
                context.moveTo(i*step, -5)
                context.lineTo(i*step, +5)
                context.fillText("" + i,i*step + 2.5 , -5)
            }

            context.moveTo( 0, -lt*step)
            context.lineTo( 0, +lt*step)

            for( i = -lt; i<=lt; i++ ){
                if (i==0) continue;
                context.moveTo( -5, i*step)
                context.lineTo( +5,i*step)
                context.fillText("" +(-i), 5,i*step - 2.5 )
            }
            context.stroke();
        }
    }

    // this.render = (context) => {
    // data.forEach( item => {})
    //
    // }

    this.init = () => {
        let div

        div = document.createElement('canvas')
        div.className = 'graph'
        this.buttonsView = view.appendChild(div)
        t = new Transformator( div, this.render )
        this.redraw = () => t.redraw()

    }
    this.init()
}
// -----------------------------------------------------

// let defaultrender = (context) => { // default render
//     context.lineWidth=2;
//     context.fillText("default111",100,100)
//     context.beginPath()
//     context.moveTo(0, 0)
//     context.lineTo(100, 0)
//     context.moveTo(0, 0)
//     context.lineTo(0, 100)
// }
// -----------------------------------------------------

function Transformator ( view, render )  {

    let context
    let lastX = view.width/2
    let lastY = view.height/2*2 // fix
    let scaleFactor = 1.05

    this.context = context
    this.view = view
    this.debug = true

    this.render = render

    this.init = () => {
        context = view.getContext('2d')
        this.trackTransforms(context)
        context.scale(1,0.5) // fix
        context.translate(lastX,lastY)
        this.redraw()

        let dragStart,dragged

        view.addEventListener('mouseup', (evt) => dragStart = null, false)
        view.addEventListener('mousedown', (evt) => {
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'
            lastX = evt.offsetX || (evt.pageX - view.offsetLeft)
            lastY = evt.offsetY || (evt.pageY - view.offsetTop)
            console.log(lastX, lastY)
            dragStart = context.transformedPoint(lastX,lastY)
            dragged = false
        },false)
        view.addEventListener('mousemove', (evt) => {
            lastX = evt.offsetX || (evt.pageX - view.offsetLeft)
            lastY = evt.offsetY || (evt.pageY - view.offsetTop)
            dragged = true
            this.redraw()

            if (dragStart){
                let pt = context.transformedPoint(lastX,lastY)
                context.translate(pt.x-dragStart.x,pt.y-dragStart.y)
                this.redraw()
            }
        },false)

        let zoom = (clicks) => {
            let pt = context.transformedPoint(lastX,lastY)
            context.translate(pt.x,pt.y)
            let factor = Math.pow(scaleFactor,clicks)
            context.scale(factor,factor)
            context.translate(-pt.x,-pt.y)
            this.redraw()
        }

        let handleScroll = (evt) => {
            let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0
            if (delta) zoom(delta)
            return evt.preventDefault() && false
        }

        view.addEventListener('DOMMouseScroll',handleScroll,false)
        view.addEventListener('mousewheel',handleScroll,false)
    }

    this.redraw = () => {

        // Clear the entire view
        let p1 = context.transformedPoint(0,0)
        let p2 = context.transformedPoint(view.width,view.height)
        context.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y)

        context.save()
        context.setTransform(1,0,0,1,0,0)
        context.clearRect(0,0,view.width,view.height)
        context.restore()

        if( this.render != null ) this.render(context)

        // debug mouse pointer
        if( this.debug ) {
            let X = context.transformedPoint(lastX,lastY).x
            let Y = context.transformedPoint(lastX,lastY).y
            context.moveTo(X-100, Y)
            context.lineTo(X+100, Y)
            context.moveTo(X, Y-100)
            context.lineTo(X, Y+100)
            context.stroke()
        }
    }

    // Adds context.getTransform() - returns an SVGMatrix
    // Adds context.transformedPoint(x,y) - returns an SVGPoint
    this.trackTransforms = () => {
        let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg')
        let xform = svg.createSVGMatrix()
        context.getTransform = () => { return xform }

        let savedTransforms = []
        let save = context.save
        context.save = () => {
            savedTransforms.push(xform.translate(0,0))
            return save.call(context)
        }

        let restore = context.restore
        context.restore = () => {
            xform = savedTransforms.pop()
            return restore.call(context)
        }

        let scale = context.scale
        context.scale = (sx,sy) => {
            xform = xform.scaleNonUniform(sx,sy)
            return scale.call(context,sx,sy)
        }

        let rotate = context.rotate
        context.rotate = (radians) => {
            xform = xform.rotate(radians*180/Math.PI)
            return rotate.call(context,radians)
        }

        let translate = context.translate
        context.translate = (dx,dy) => {
            xform = xform.translate(dx,dy)
            return translate.call(context,dx,dy)
        }

        let transform = context.transform
        context.transform = (a,b,c,d,e,f) => {
            let m2 = svg.createSVGMatrix()
            m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
            xform = xform.multiply(m2)
            return transform.call(context,a,b,c,d,e,f)
        }

        let setTransform = context.setTransform
        context.setTransform = (a,b,c,d,e,f) => {
            xform.a = a
            xform.b = b
            xform.c = c
            xform.d = d
            xform.e = e
            xform.f = f
            return setTransform.call(context,a,b,c,d,e,f)
        }

        let pt  = svg.createSVGPoint()
        context.transformedPoint = (x,y) => {
            pt.x=x; pt.y=y/2; // scale fix
            return pt.matrixTransform(xform.inverse())
        }
    }

    this.init()

}
