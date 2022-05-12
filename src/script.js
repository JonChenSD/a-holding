import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { player } from "./scripts/player.js"
import VocMap from "./VocMap.json";
import { parseGIF, decompressFrames } from 'gifuct-js'

// Shaders
import testVertexShader from './shaders/line/vertex.glsl'
import testFragmentShader from './shaders/line/fragment.glsl'
console.log(testVertexShader)
/**
 * Debug
 */
 const gui = new dat.GUI()


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// Buttons
let spiral = document.getElementById('spiral')
let wing = document.getElementById('wing')
let test = document.getElementById('test')
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// images
// import sattelite from '/assets/images/sattelite.png'
// const satteliteImg = document.getElementById('sattelite')
// satteliteImg.src = sattelite
var mouseX=window.innerWidth/2,
    mouseY=window.innerHeight/2;
let butterfly = document.getElementById('butterfly');
const onMouseMove = (e) =>{
  butterfly.style.left = e.pageX + 'px';
  butterfly.style.top = e.pageY + 'px';
}
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchmove', onMouseMove);
// Colors
const colors = {
    fog: '#3d2d54'
}

// var circle = {
//      el:$('#butterfly'),
//      x:window.innerWidth/2,
//      y:window.innerHeight/2,
//      w:80,
//      h:80,
//      update:function(){
//                    l = this.x-this.w/2;
//                    t = this.y-this.h/2;
//                    this.el.css({
//                             'transform':
//                             'translate3d('+l+'px,'+t+'px, 0)' });
//                            }
// }

// $(window).mousemove (function(e){
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// })

// setInterval (move,1000/60)
// function move(){
//   circle.x = lerp (circle.x, mouseX, 0.1);
//   circle.y = lerp (circle.y, mouseY, 0.1);
//   circle.update()
// }

// function lerp (start, end, amt){
//   return (1-amt)*start+amt*end
// }

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-french.jpg')
//Raycaster-Pointer
let raycaster;
const pointer = new THREE.Vector2();
const threshold = 0.01;
let intersection = null;
let intersectionPlane = null;
const vertices = [];
const dotPointsList = []
const movementPlane = []
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

console.log(geometry)

// Material
//create a blue LineBasicMaterial
const materialLine = new THREE.LineBasicMaterial( { color: 0x34eb77 } );

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms:
    {
        uFrequency: { value: new THREE.Vector2(10,5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture }
    }
})

// gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
// gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')
// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2/3
// scene.add(mesh)

var tempRadius = new THREE.Vector3();
//points
var tempCircle = createCircle(100, "yellow");
tempCircle.scale.set(0.0001, 0.0001, 1);
scene.add(tempCircle);

function createCircle(radius, color){
	let geom = new THREE.CircleGeometry(radius, 60);
    console.log(geom)
//   geom.vertices.shift();
  let mat = new THREE.LineBasicMaterial({color: color});
  return new THREE.LineLoop(geom, mat);
}
//point material
const materialPoint2 = new THREE.PointsMaterial( {size:.006, color: 0x34eb77 } );
const materialPoint = new THREE.PointsMaterial( {size:.006, color: 0x34eb77 } );
//Line constructor
const materialPointLarger = new THREE.PointsMaterial( {size:.01, color: 0x34eb77 } );

const v = new THREE.Vector2();
let r;

const planeGeometry = new THREE.PlaneGeometry( 1, 1 );
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane1 = new THREE.Mesh( planeGeometry, material );
plane1.position.set(0, 0, .2 )
console.log(plane1.scale)
plane1.scale.set(.04,.04,.04)
plane1.rotateX(THREE.Math.degToRad(-45))
console.log(plane1.scale)
scene.add( plane1 );

const plane2 = new THREE.Mesh( planeGeometry, planeMaterial );
plane2.position.set(0, 0, .2 )
console.log(plane2.scale)
plane2.scale.set(1,1,1)
plane2.rotateX(THREE.Math.degToRad(-90))
console.log(plane2.scale)
scene.add( plane2 );
movementPlane.push(plane2)


//selector
let selectedPoint = false;
const geometrySelect = new THREE.RingGeometry( .01, .012, 5 );
const materialSelect = new THREE.MeshBasicMaterial( { color: 0x34eb77, side: THREE.DoubleSide } );
const meshSelect = new THREE.Mesh( geometrySelect, materialSelect );
scene.add( meshSelect );



function lineConstructor(){
    const phi = Math.random( ) * Math.PI * 2;
	
    r =  Math.pow( Math.random( ), 1 / 6 ) + 0.08;
    v.x = r * Math.cos( phi );
    v.y = r * Math.sin( phi );
    const coordinate = {
        x: v.x,
        y: (Math.random()*.05 + .02),
        z: v.y
    }
    const points = [];
    points.push( new THREE.Vector3( coordinate.x, 0, coordinate.z ) );
    points.push( new THREE.Vector3( coordinate.x, coordinate.y, coordinate.z ) );

    const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometryLine, material );
    scene.add( line );

    //point

    vertices.push(coordinate.x,coordinate.y,coordinate.z)
    const geometryPoint = new THREE.BufferGeometry();
    geometryPoint.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );



    const dotPoints = new THREE.Points( geometryPoint, materialPoint );
    dotPointsList.push(dotPoints)

    scene.add( dotPoints );
}

// for(let i = 0; i < 1000; i++){
//     lineConstructor()
// }

const xValues = VocMap.data.map(d => d.X)
const yValues = VocMap.data.map(d => d.Y)

for (let i = 0; i < VocMap.data.length; i++) {
    const item = VocMap.data[i]
    console.log(item.X,item.Y)
    lineConstructors(item.X,item.Y)
}

function lineConstructors(x,y){
  
    const phi = Math.random( ) * Math.PI * 2;
	
    r =  Math.pow( Math.random( ), 1 / 6 ) + 0.08;
    v.x = r * Math.cos( phi );
    v.y = r * Math.sin( phi );
    const coordinate = {
        x: x *.04 -2,
        y: (Math.random()*.05 + .02),
        z: y * .04 - 1.6
    }

    const points = [];
    points.push( new THREE.Vector3( coordinate.x, 0, coordinate.z ) );
    points.push( new THREE.Vector3( coordinate.x, coordinate.y, coordinate.z ) );

    const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometryLine, material );
    scene.add( line );

    //point

    vertices.push(coordinate.x, coordinate.y, coordinate.z)
    const geometryPoint = new THREE.BufferGeometry();
    geometryPoint.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    const dotPoints = new THREE.Points( geometryPoint, materialPoint );
    dotPointsList.push(dotPoints)
    console.log('dotpoints yes',dotPoints,geometryPoint, line)
    scene.add( dotPoints );
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Pointer
function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // console.log(pointer)
}

const fog = new THREE.Fog(colors.fog, .37, 1.34)
scene.fog = fog

// Raycaster
raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = threshold;
document.addEventListener( 'pointermove', onPointerMove );
document.addEventListener( 'touchstart', onPointerMove );
document.addEventListener( 'touchend', onPointerMove );
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 30)
camera.position.set(0, .5, .4)
camera.rotateX(-.8)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableRotate = false
// controls.enableDamping = true
// controls.autoRotate = true
// controls.autoRotateSpeed = -1.0

function setupKeyControls() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
    function keyDown(e) {
        const duration = new Date().getTime();
        console.log(duration)
        //     // increase momentum if key pressed longer
        //     let momentum = Math.sqrt(duration + 200) * 0.01 + 0.05;

        //     // adjust for actual time passed
        // momentum = momentum * delta / 0.016;

        //     // increase momentum if camera higher
        // momentum = momentum + camera.position.z * 0.02;
      switch (e.key) {
        case 'd':
        camera.position.x += 0.02;
        console.log('37')
        break;
        case 'w':
        camera.position.z -= 0.02;
        break;
        case 'a':
        camera.position.x -= 0.02;
        break;
        case 's':
        camera.position.z += 0.02;
        break;
      }
    };
    function keyUp(e) {
        switch(e.keyCode) {
        //     case 38: // UP
        //         playerSpeed = 0; // NOT moving!
        //         break;
        //     // other cases...
        // }
    }

}
    
  }

  setupKeyControls()
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x31003d, 1)

let colorpalletes = ['0x31003d','0x34eb77','0x29d8ff','0x002b1c','0x6800e8','0x2e4a52']
spiral.addEventListener('click', async () => {
 
    if(materialPoint.color.g == 0.9686274509803922){
        materialPoint.color.setHex(0x34eb77)
        renderer.setClearColor(0x31003d, 1)
        
        
       
    } else if(materialPoint.color.r == 0.40784313725490196){
        
        materialPoint.color.setHex(0xfff700)
        renderer.setClearColor( 0x002b1c, 1) 
    }
    else{
        materialPoint.color.setHex(0x6800e8)
       console.log(materialPoint.color.g) 
        renderer.setClearColor( 0x2e4a52, 1)
        
    }
    
})
wing.addEventListener('click', async () => {
    if(currentNotes == Cmajor){
        currentNotes = CmajorSeventh
    } else if(currentNotes == CmajorSeventh){
        currentNotes = Dmajor
    } else{
        currentNotes = Cmajor
    }
})
test.addEventListener('click', async () => {
    console.log('test', scene.children)
    var item = currentNotes[Math.floor(Math.random()*currentNotes.length)];
            if(materialPoint.color.g == 0.9686274509803922){
                player.play('mono', item)
            }
            else if(materialPoint.color.r == 0.40784313725490196){
                player.play('SawSynth', item)
            }
            else{
                player.play('windchime', item)
            }
            
            console.log(intersection)
            console.log('pointbefore',intersection.point,intersection.point.material,intersection.material)
            // intersection.point.material = materialPointLarger
            // var object = scene.getObjectById( intersection.index, true );
            // object.material = materialPointLarger

            // console.log('point',intersection.material)
            currentPoint = intersection.index
            // dotPointsList[intersection.index].size.set(.06)
            console.log('dotpoints',dotPointsList[intersection.index])
    
})

canvas.addEventListener("click", () => {
    if(currentPoint != null){
        console.log('point position', currentVectorPoint.geometry.boundingSphere.center)
        meshSelect.position.set(currentPoint.x,currentPoint.y,currentPoint.z)
        meshSelect.lookAt(camera.position)
        selectedPoint = true
    }
})
//DEBUG
//
//
//

gui.addColor(colors, 'fog')
gui.add(fog, 'near').min(- 3).max(3).step(0.01)
gui.add(fog, 'far').min(- 3).max(3).step(0.01)



/**
 * Animate
 */
const clock = new THREE.Clock()

let currentPoint = null
let currentVectorPoint = null
const notes = ['C','C#','D','D#','E','F','G','G#','A','A#','B']
const Cmajor = ['C','E','G']
const Dmajor = ['D','F','A']
const CmajorSeventh = ['C', 'E', 'G', 'B', 'D', 'F']
let currentNotes = Cmajor
const tick = () =>
{

    tempCircle.lookAt( camera.position );
    //set
    raycaster.setFromCamera( pointer, camera );
    // console.log(pointer)
    const intersections = raycaster.intersectObjects( dotPointsList, false );
    const intersectionsPlane = raycaster.intersectObjects( movementPlane, false);

    intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
	
    var beepos = {x:0, y:0};
		
	var mouse = {x:0, y:0}; 
    var distX = mouse.x - beepos.x;
	var distY = mouse.y - beepos.y;
            
	intersectionPlane = ( intersectionsPlane.length ) > 0 ? intersectionsPlane[ 0 ] : null;
        
        
        if(intersectionPlane !=null){
            
            var distX = intersectionPlane.point.x - beepos.x;
			var distY = intersectionPlane.point.y - beepos.y;
			//Easing motion
       //Progressive reduction of distance 
			beepos.x += distX/3;
			beepos.y += distY/3;
            const vec = new THREE.Vector3(intersectionPlane.point.x,intersectionPlane.point.y,intersectionPlane.point.z)
            plane1.position.lerp(vec,0.05)
            console.log('plane intersected',intersectionPlane,plane1.position)
        }
        
        if(intersection !=null && currentPoint != intersection.index){
            console.log('1intersected', intersection, currentPoint)
            var item = currentNotes[Math.floor(Math.random()*currentNotes.length)];
            if(materialPoint.color.g == 0.9686274509803922){
                player.play('mono', item)
            }
            else if(materialPoint.color.r == 0.40784313725490196){
                player.play('SawSynth', item)
            }
            else{
                player.play('windchime', item)
            }
            
            console.log(intersection)
            console.log('pointbefore',intersection.point,intersection.point.material,intersection.material)
            // intersection.point.material = materialPointLarger
            // var object = scene.getObjectById( intersection.index, true );
            // object.material = materialPointLarger

            // console.log('point',intersection.material)
            currentPoint = intersection.point
            currentVectorPoint = dotPointsList[intersection.index]
            // dotPointsList[intersection.index].size.set(.06)
            console.log('dotpoints',dotPointsList[intersection.index])
        }

        else if(intersection !=null && currentPoint == intersection.index){
            console.log('nothing')
        }
        else{
            currentPoint = null
            
            tempCircle.position.set(500,500,500)
        }
    const elapsedTime = clock.getElapsedTime()

    //Update Material
    material.uniforms.uTime.value = elapsedTime

    // // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
player.init()
tick()