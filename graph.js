// main

console.log("graph");

function Graph(view) {
    this.view = view

    this.init = () => {
        // console.log("constructor");
        let div

        div = document.createElement('canvas');
        div.className = 'graph'
        this.buttonsView = view.appendChild(div)

        let t = new Transformator(div)
        // // title
        // div = document.createElement('div');
        // div.classList.add('tableTitle')
        // this.titleView = view.appendChild(div)

        // // table
        // div = document.createElement('div');
        // div.className = 'table'
        // this.tableView = view.appendChild(div)
        // this.buildRowDom( div, { X:'X', Y:'Y' }, { header:true } )
        //
        // // buttons
    }
    this.init();
}

// -----------------------------------------------------

function Transformator (view)  {

    this.view = view
    this.context = null
    // this.view.width = 800;
    // this.view.height = 600;

    var gkhead = new Image;
    var lastX=this.view.width/2, lastY=this.view.height/2;
    var scaleFactor = 1.05;


    this.init = () => {
        this.context = this.view.getContext('2d')
        this.trackTransforms(this.context);
        this.redraw();


        var dragStart,dragged;

        this.view.addEventListener('mousedown', (evt) => {
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            lastX = evt.offsetX || (evt.pageX - this.view.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - this.view.offsetTop);
            dragStart = this.context.transformedPoint(lastX,lastY/2);// fix
            dragged = false;
        },false);

        this.view.addEventListener('mousemove', (evt) => {
            lastX = evt.offsetX || (evt.pageX - this.view.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - this.view.offsetTop);
            dragged = true;
            this.redraw();

            if (dragStart){
                var pt = this.context.transformedPoint(lastX,lastY/2); // fix
                // console.log(lastX,lastY)
                // console.log(pt)
                // console.log(pt.x-dragStart.x,pt.y-dragStart.y)
                this.context.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                this.redraw();
            }
        },false);

        this.view.addEventListener('mouseup', (evt) => {
            dragStart = null;
            if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
        },false);


        var zoom = (clicks) => {
            var pt = this.context.transformedPoint(lastX,lastY/2); // fix
            this.context.translate(pt.x,pt.y);
            var factor = Math.pow(scaleFactor,clicks);
            this.context.scale(factor,factor);
            this.context.translate(-pt.x,-pt.y);
            this.redraw();
        }

        var handleScroll = (evt) => {
            var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
            if (delta) zoom(delta);
            return evt.preventDefault() && false;
        };

        this.view.addEventListener('DOMMouseScroll',handleScroll,false);
        this.view.addEventListener('mousewheel',handleScroll,false);
    }

 // compleate
    this.redraw = (item) => {
        let context = this.context
        gkhead.src = 'http://phrogz.net/tmp/gkhead.jpg';

        // Clear the entire this.view
        var p1 = this.context.transformedPoint(0,0);
        var p2 = this.context.transformedPoint(this.view.width,this.view.height);
        this.context.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

        this.context.save();
        this.context.setTransform(1,0,0,1,0,0);
        this.context.clearRect(0,0,this.view.width,this.view.height);
        this.context.restore();

        this.context.fillText("Hello World",10,50);

        // ctx.fillRect(width / -2, height / -2, width, height);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(100, 0);
        context.moveTo(0, 0);
        context.lineTo(0, 100);


        // console.log(lastX, lastY);
        // let X = lastX
        // let Y = lastY
        // context.moveTo(X-100, Y);
        // context.lineTo(X+100, Y);
        // context.moveTo(X, Y-100);
        // context.lineTo(X, Y+100);

        X = context.transformedPoint(lastX,lastY).x
        Y = context.transformedPoint(lastX,lastY/2).y
        context.moveTo(X-100, Y);
        context.lineTo(X+100, Y);
        context.moveTo(X, Y-100);
        context.lineTo(X, Y+100);
        context.stroke();

        // this.context.drawImage(gkhead,0,0);

    }

    // Adds this.context.getTransform() - returns an SVGMatrix
    // Adds this.context.transformedPoint(x,y) - returns an SVGPoint
    this.trackTransforms = () => {
        var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        var xform = svg.createSVGMatrix();
        this.context.getTransform = () => { return xform; };

        var savedTransforms = [];
        var save = this.context.save;
        this.context.save = () => {
            savedTransforms.push(xform.translate(0,0));
            return save.call(this.context);
        };

        var restore = this.context.restore;
        this.context.restore = () => {
            xform = savedTransforms.pop();
            return restore.call(this.context);
        };

        var scale = this.context.scale;
        this.context.scale = (sx,sy) => {
            xform = xform.scaleNonUniform(sx,sy);
            return scale.call(this.context,sx,sy);
        };

        var rotate = this.context.rotate;
        this.context.rotate = (radians) => {
            xform = xform.rotate(radians*180/Math.PI);
            return rotate.call(this.context,radians);
        };

        var translate = this.context.translate;
        this.context.translate = (dx,dy) => {
            xform = xform.translate(dx,dy);
            return translate.call(this.context,dx,dy);
        };

        var transform = this.context.transform;
        this.context.transform = (a,b,c,d,e,f) => {
            var m2 = svg.createSVGMatrix();
            m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
            xform = xform.multiply(m2);
            return transform.call(this.context,a,b,c,d,e,f);
        };

        var setTransform = this.context.setTransform;
        this.context.setTransform = (a,b,c,d,e,f) => {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(this.context,a,b,c,d,e,f);
        };

        var pt  = svg.createSVGPoint();
        this.context.transformedPoint = (x,y) => {
            pt.x=x; pt.y=y;
            return pt.matrixTransform(xform.inverse());
        }
    }

    this.init();

}
