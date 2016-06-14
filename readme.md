......................
........................
............................

How to create a Earth globe in space with some control........


Explanation....
Technology using Three.js ... 

Three.js defintion ... -> 

Three.js is a cross-browser JavaScript library/API used to create and display animated 3D computer graphics in a web browser. Three.js uses WebGL. The source code is hosted in a repository on GitHub.
---> this definition is copy and pasted from google <---

0. entry point / basic setup ...
    intialize all these objects as global varaibles..

    var renderer;
    var scene;
    var camera...

    -scene
    -camera
    -renderer

    create a scene that will hold all elements
        scene = new THREE.Scene();
    create a camera 
        scene = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    create a render / context background size, color

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    enable shadows

    renderer.shadowMapEnabled = true;


    


1. Setup sphere and camera controls 
  
    -create sphere geometry.
    -creating Mesh requires Geometry and Material 
    -Geometry and Material 

        var sphereGeometry = new THREE.SphereGeometry(15, 30, 30);
        var sphereMaterial = new THREE.MeshNormalMaterial();


    -Sphere Mesh

        var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        earthMesh.name = 'earth';


    -add to scene

        scene.add(earthMesh);

    -add camera controls
    
    camera.position.x = 35;
    camera.position.y = 36;
    camera.position.z = 33;
    camera.lookAt(scene.position);    

    

      camera = new THREE.OrbitControls(camera);

    -wrap existing camera with control object to use controls

        function render () {
            cameraControl.update();
        }




2. Add earth texture

    -create earth material/texture

    function createEarthMaterial () {
      var earthTexture = Three.ImageUtils.loadTexture(....)

      var earthMaterial = new THREE.MeshBasicMaterial ();
      earthMaterial.map = earthTexture;

      return earthMaterial;
    }


    

3. Add cloud texture

    -create another sphere slightly larger than the the earth globe

   var cloudGeometry = new
      THREE.SphereGeometry(sphereGeometry.parameters.radius*1.01,
      sphereGeometry.parameters.widthSegments,
      sphereGeometry.parameters.heightSegments);

    -create transparent cloud textures

     function createCloudMaterial() {
     var cloudTexture = THREE.ImageUtils.loadTexture(....);
     var cloudMaterial = new THREE.MeshBasicMaterial();
         cloudMaterial.map = cloudTexture;
         cloudMaterial.transparent = true;
         return cloudMaterial;
   }

3. Add directional lighting

     var directionalLight = new THREE.DirectionalLight(    0xffffff, 1);
    directionalLight.position = new THREE.Vector3(100, 10, -50);
    directionalLight.name = 'directional';

    -add to scene

    scene.add(directionalLight);

4. Add Ambient lighting

    -create AmbientLight
        var ambientLight = new THREE.AmbientLight(0x111111);

    -add to scene
        scene.add(ambientLight);


5. Add starry background + cdns
    
    -create Orthographic Camera for Background 

      cameraBG = new THREE.OrthographicCamera(
             -window.innerWidth,
              window.innerWidth,
              window.innerHeight,
             -window.innerHeight,
             -10000, 10000);
      cameraBG.position.z = 50;


    -Combine various renders together using the EffectComposer object 
        -setup the passes
            var bgPass = new THREE.RenderPass(sceneBG, cameraBG);
            var renderPass = new THREE.RenderPass(scene, camera);
            renderPass.clear = false;
            var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
            effectCopy.renderToScreen = true;

        -add passes to the composer
            composer = new THREE.EffectComposer(renderer);
            composer.addPass(bgPass);
            composer.addPass(renderPass);
            composer.addPass(effectCopy);

        -render loop 

        function render() {
            ...
            renderer.autoClear = false;
            composer.render();
            ...
        }



    -how? defining seperate passes which then are combined into a single result

    -cdn's required
       <script src="../libs/EffectComposer.js"></script>
       <script src="../libs/RenderPass.js"></script>
       <script src="../libs/CopyShader.js"></script>
       <script src="../libs/ShaderPass.js"></script>
       <script src="../libs/MaskPass.js"></script>

----------------------> more advanced textures .... 

6. Add depth (normal or bump map required...)
    
    -add a normal map 

7. Add Reflective spots through (specular map required...) 
    
    -add a specular map 

8. Setup the control object for the control gui
      control = new function () {
          this.rotationSpeed = 0.001;
          this.ambientLightColor = ambientLight.color.getHex();
          this.directionalLightColor = directionalLight.color.getHex();
      };


Notes

for easy quick viewing and server setup use the http-server npm module. 
example files are provided....
