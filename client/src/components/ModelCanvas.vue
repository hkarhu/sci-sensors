<template>
    <canvas id="three_canvas"></canvas>
</template>

<script>
// import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js';
//import {
//    BloomEffect,
//    EffectComposer,
//    GlitchPass,
//    EffectPass,
//    RenderPass
//} from 'postprocessing'

export default {
    name: 'ModelCanvas',
    data() {
        return {}
    },
    mounted: function() {
        
        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2(0, 0.001)
        
        // const composer = new THREE.EffectComposer(new WebGLRenderer())
        // const effectPass = new THREE.EffectPass(camera, new BloomEffect())
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        
        /*
        this.gradientMap = new THREE.DataTexture( colors, colors.length, 1, THREE.LuminanceFormat );
		gradientMap.minFilter = THREE.NearestFilter;
		gradientMap.magFilter = THREE.NearestFilter;
		gradientMap.generateMipmaps = false;
		*/
        
        let data_canvas = document.querySelector('#three_canvas');
        
        try {
            this.renderer = new THREE.WebGLRenderer({ canvas: data_canvas, alpha: true, antialias: false });
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.5;
            this.renderer.toneMappingWhitePoint = 1.0;            
        } catch ( e ) {
            this.renderer = null;
            throw new Error("No renderer!");
        }   

        this.effect = new OutlineEffect( this.renderer,  { defaultThickness: 0.006, defaultColor: [ 0, 0, 0 ], defaultAlpha: 1, defaultKeepAlive: true });
        
        this.light = new THREE.DirectionalLight('hsl(0, 100%, 100%)')
        
        this.ambient_light = new THREE.AmbientLight( 0x999999 );
        
        //Target
        //this.target_graphic = new THREE.Line( new THREE.RingGeometry( 1, 5, 32, 1, 1 ), new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth: 3.0 }));
        let mat_sprite = new THREE.SpriteMaterial( {map: new THREE.TextureLoader().load( '@img/target_sprite.png' )});
        this.target_graphic = new THREE.Sprite(mat_sprite);
//         this.target_graphic.visible = false
        
        //Pointer line
        this.target_line_geom_buffer = new THREE.BufferGeometry()
        this.target_line_geom_buffer.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(9), 3 ) );
        //.setFromPoints( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) );
        let line_material = new THREE.LineBasicMaterial( {
            color: 0x229900,
            linewidth: 3,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin:  'round' //ignored by WebGLRenderer
        });
        
        this.target_line_inner = new THREE.Line( this.target_line_geom_buffer, line_material);
        
        let uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        };
        
        this.shader_material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader:   "uniform float time;"+
                                "uniform vec2 resolution;"+
                                "void main()	{"+
                                "gl_Position = vec4( position, 1.0 );"+
                                "}",
                
                fragmentShader: "uniform float time;"+
                                "uniform vec2 resolution;"+
                                "void main(){ "+
                                "float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;"+
                                "float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;"+
                                "gl_FragColor = vec4(vec3(min(x, y)), 1.);"+
                                "}",
    
        });
        
        this.scene.add(this.camera)        
        this.scene.add(this.light)
        this.scene.add(this.ambient_light)
        this.scene.add(this.target_graphic)
        this.scene.add(this.target_line_inner)
        
        this.renderer.shadowMap.enabled = false
        this.light.position.set(0, 0, 10)
        this.camera.position.z = 60;
        this.camera.position.y = 30;
        //this.scene.background = new THREE.Color('hsl(0, 100%, 100%)')
        this.scene.background = new THREE.Color("#241");
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.rotateSpeed = 1.0
        this.controls.zoomSpeed = 1
        this.controls.panSpeed = 0.5
        this.controls.noZoom = false
        this.controls.noPan = true
        this.controls.staticMoving = true
        this.controls.dynamicDampingFactor = 0.3
        window.addEventListener('resize', this.onWindowResize, false );
        this.onWindowResize();
        
        this.animate()
    },
    methods: {
        animate: function() {
            requestAnimationFrame(this.animate)
            
            let cpos = this.camera.position;
            
            this.light.position.set(cpos.x, cpos.y, cpos.z)
            
            this.controls.update()
            
            if(this.selected_target){
                
                this.target_graphic.visible = true;
                this.target_line_inner.visible = true;
                let tpos = this.selected_target.position;
                
                
                let lposa = this.target_line_inner.geometry.attributes.position.array;
                //let lposa = this.target_line_outer.geometry.attributes.position.array;
                
                let oh = document.querySelector('.sensor_list').offsetHeight;
                
                let y = (this.selected_target_element.offsetTop + this.selected_target_element.offsetHeight/16)/oh - document.querySelector('.sensor_list').scrollTop/oh;
                
                const cvec = new THREE.Vector3(1, (1-y*2), 0);
                const bvec = new THREE.Vector3(0.75, (1-y*2), 0);
                
                //let canvas = document.getElementById('three_canvas')
                
                cvec.unproject(this.camera)
                bvec.unproject(this.camera)
                
                //let d = -this.camera.position.z/bvec.z
                //cvec.copy(this.camera.position).add(bvec.multiplyScalar(d))
                
                //cvec.applyMatrix4(this.camera.matrixWorld);
                //cvec.applyMatrix4(this.camera.matrixWorld);

                lposa[0] = cvec.x;
                lposa[1] = cvec.y;
                lposa[2] = cvec.z;
                lposa[3] = bvec.x;
                lposa[4] = bvec.y;
                lposa[5] = bvec.z;
                lposa[6] = tpos.x;
                lposa[7] = tpos.y;
                lposa[8] = tpos.z;
                this.target_line_inner.geometry.attributes.position.needsUpdate = true;
                this.target_graphic.position.set(tpos);
            } else {
                this.target_graphic.visible = false;
                this.target_line_inner.visible = false;
            }
            
            //this.renderer.render(this.scene, this.camera)
            this.effect.render(this.scene, this.camera)
        },
        onWindowResize: function() {
            let canvas = document.getElementById('three_canvas')
            this.camera.aspect = canvas.offsetWidth/canvas.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
        },
        loadModel: function(model_url){
            this.gltf_loader = new GLTFLoader()
            let _self = this;
            this.gltf_loader.load( model_url, function ( gltf ) {
                _self.model = gltf.scene;
                /*
                let mat_toon = new THREE.MeshToonMaterial( {
					color: 0xFFFFFF,
					gradientMap: this.gradientMap
                });
                */
                //let mat_wireframe = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
                //let mat_lambert = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading});
                //_self.model.children[3].children[0].material = new THREE.LineBasicMaterial( {color: 0xffffff} );
                //let mesh = SceneUtils.createMultiMaterialObject( _self.model.geometry, [mat_wireframe] );
                //_self.model.children[3].children.forEach(o => o.material = mat_toon)
                _self.scene.add(_self.model);
            }, undefined, function ( error ) {
                console.error( error );
            });
        },
        selectSensor: function(hwid, proxy){
            if(proxy.$el.classList.contains("vcp--expanded")){
                this.selected_target_element = proxy.$el
                let hwid_s = hwid.replaceAll(':','').replaceAll('.','')
                this.selected_target = this.model.children.find(el => el.name == hwid_s)
            } else {
                this.selected_target = null
            }
        }
    },
}
</script>

<style>
#three_canvas {
	width: 100%;
	height: 996px;
	background-color: #F0F;
}
</style>
