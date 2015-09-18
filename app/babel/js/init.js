const requestAFrame = (()=>{
  return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          function (callback) {
            return window.setTimeout(callback, 1000 / 60);
  };
})();
const cancelAFrame = (()=>{
  return window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          function (id) {
            window.clearTimeout(id);
  };
})();
//  Renderer
const ClickRenderer = {
  init(scene, camera, fps, Store) {
    this.store = Store;
    this.scene = scene;
    this.camera = camera;
    this.fps = fps;
    window.addEventListener('render_move', this);
    window.addEventListener('render_rotate', this);
  },
  handleEvent(e) {
    switch(e.type) {
      case 'render_move':
        this.fps.style.transform = `translate3D(${e.detail.x}px, 0, ${e.detail.y}px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;        break;
      case 'render_rotate':
        this.camera.style.transform = `translate3D(0, 0, ${this.store.perspective}px) rotateX(${e.detail.y}deg) rotateY(${e.detail.x}deg) rotateZ(0deg)`;
        break;
    }
  },
};

// Store
function Store() {
  this.perspective = 800;
  this.left = false;
  this.right = false;
  this.forward = false;
  this.backward = false;
  this.r_left = false;
  this.r_right = false;
  this.r_up = false;
  this.r_down = false;
  this.posX = -400;
  this.posY = 400;
  this.rotateX = 0;
  this.rotateY = 0;
  this.moveSpeed = 24;
  this.retrunSpeed = 1;
  this.PI = Math.PI / 180;
};

Store.prototype = {
  init() {
    window.addEventListener('set_move', this);
    window.addEventListener('cancel_move', this);
    requestAFrame(this._move.bind(this));
  },
  handleEvent(e) {
    switch(e.type) {
      case 'set_move':
        switch(e.detail) {
          case 65:
            this.r_left = true;
            break;
          case 37:
            this.r_left = true;
            break;
          case 68:
            this.r_right = true;
            break;
          case 39:
            this.r_right = true;
            break;
          case 87:
            this.forward = true;
            break;
          case 38:
            this.forward = true;
            break;
          case 83:
            this.backward = true;
            break;
          case 40:
            this.backward = true;
            break;
          case 81:
            this.left = true;
            break;
          case 69:
            this.right = true;
            break;
        }
        break;
      case 'cancel_move':
        switch(e.detail) {
          case 65:
            this.r_left = false;
            break;
          case 37:
            this.r_left = false;
            break;
          case 68:
            this.r_right = false;
            break;
          case 39:
            this.r_right = false;
            break;
          case 87:
            this.forward = false;
            break;
          case 38:
            this.forward = false;
            break;
          case 83:
            this.backward = false;
            break;
          case 40:
            this.backward = false;
            break;
          case 81:
            this.left = false;
            break;
          case 69:
            this.right= false;
            break;
        }
        break;
    }
  },
  _move() {
    if(this.forward | this.backward | this.left | this.right) {
      if(this.left) {
        this.posX += Math.sin((this.rotateX + 90) * this.PI) * this.moveSpeed;
        this.posY -= Math.cos((this.rotateX + 90) * this.PI) * this.moveSpeed;
      } else if(this.right) {
        this.posX -= Math.sin((this.rotateX + 90) * this.PI) * this.moveSpeed;
        this.posY += Math.cos((this.rotateX + 90) * this.PI) * this.moveSpeed;
      }  
      if(this.forward) {
        this.posX -= Math.sin(this.rotateX * this.PI) * this.moveSpeed;
        this.posY += Math.cos(this.rotateX * this.PI) * this.moveSpeed;
      } else if(this.backward) {
        this.posX += Math.sin(this.rotateX * this.PI) * this.moveSpeed;
        this.posY -= Math.cos(this.rotateX * this.PI) * this.moveSpeed;
      }
      this._setMove(this.posX, this.posY);
    }
    if(this.r_left | this.r_right | this.r_top | this.r_down) {
      if(this.r_left) {
        this.rotateX -= this.retrunSpeed;
      } else if(this.r_right) {
        this.rotateX += this.retrunSpeed;
      }  
      if(this.r_up) {
        this.rotateY += this.retrunSpeed;
      } else if(this.r_down) {
        this.rotateY -= this.retrunSpeed;
      }
      this._setRotate(this.rotateX, this.rotateY);
    }
    requestAFrame(this._move.bind(this));
  },
  _setMove(x, y) {
    window.dispatchEvent(new CustomEvent('render_move',{'detail': {'x': x, 'y': y}}));
  },
  _setRotate(x, y) {
    window.dispatchEvent(new CustomEvent('render_rotate',{'detail': {'x': x, 'y': y}}));
  },
};

// Dispatcher
const Dispatcher = {
  init() {
    // get view
    this.scene = document.getElementById('scene');
    this.camera = document.getElementById('camera');
    this.fps = document.getElementById('fps');
    window.addEventListener('keydown', this);
    window.addEventListener('keyup', this);
    this.store = new Store();
    this.store.init();
    ClickRenderer.init(this.scene, this.camera, this.fps, this.store);
    
  },
  handleEvent(e) {
    switch(e.type){
      case 'keydown':
        window.dispatchEvent(new CustomEvent('set_move',{'detail': e.keyCode}));
        break;
      case 'keyup':
        window.dispatchEvent(new CustomEvent('cancel_move',{'detail': e.keyCode}));
        break;
    }
  },
};
Dispatcher.init();