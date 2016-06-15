......................
........................
............................

How to create a Earth globe in space with some control........


Explanation....
Technology using Three.js ... 

Three.js defintion ... -> 

Three.js is a cross-browser JavaScript library/API used to create and display animated 3D computer graphics in a web browser. Three.js uses WebGL. The source code is hosted in a repository on GitHub.
---> this definition is copy and pasted from google <---

Three.js needs to have 3 basic components to render barebones minimum to an html page. They are a scene, camera, renderer.

The scene is like the "sandbox" container for your "elements", "objects" like Meshs, Lights and Cameras.

The Camera is like your "view entry point" and is a very accurate term for what it does.

The renderer is just setting up the context which in this case "WebGLrenderer". As three.js is a framework built on top of of the WEBGL api to make working with 3d objects simpler

So to setup we need to setup the scene that will contain our camera, renderer.

0. entry point / basic setup ... 
    var scene = new THREE.Scene(); //intialize new scene
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // intialize new camera 
    var renderer = new THREE.WebGLRenderer(); // intialize renderer

    intialize all these objects as global variables..
  
There are two different kinds of cameras you can use 
Orthographic and Perspective. The only difference is that objects in view scale and look like they are becoming smaller the further they are. While in an Orthographic camera disregards distance and objects will all remain the same height like in an old school 3d Rpg game. We are setting the camera view size to the browser size with window.innerWidth / window.innerHeight.


    create a render / context background size, color

    ....
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

the setClearColor method takes two paramaters. The first being a Color which can be given using a Hexcode or RGB values. the second value describes the alpha(transparency) of the background. 0 being completely transparent and 1 being opaque

    enable shadows

  In three.js bla bla bla shadow rendering requires alot of CPU processing power. So by default it is off. To turn it on 

    renderer.shadowMapEnabled = true;

There are two add-ons we can that make our life easier when messing around with 3d objects. Practically alot of it comes down to experimenting with whats one scene directly to get a sense of what looks right. Rather than randomly guessing e.g how fast a sphere rotates. 

  so the first add-on would be some stats located at the top left corner by default. Stats tells us our FPS and FPS stands for frames per second. Usually rendering and updating 3d models requires alot of processing power and FPS is a quick way to tell if your Device can handle it.

  you can either use the cdn or dl the stats.min library directly and link it in your html file

  The second add-on would be the dat.gui. This is the add on that allows for a visual experience in experimentation. While this is a very basic example of three.js (rotating globe painted pretty with pretty textures) if you decide to add more complex animations that you want to make look realistic via physics its easier to get a sense whether an animation looks correct by cycling through values such as speeds. It is a bit like a remote control.

  So in this example we added controls to the rotation speed and direction of the globe

  Firstly adding a declaring a global variable called control

  var control
  and then setup control over the rotation of the sphere like so..

  function addControlGui(controlObject) {
      var gui = new dat.GUI();
      guid.add(controlObject, 'rotationSpeed', -0.01, 0.01);
      ...
  }
  the code above sets a range you can scroll between -0.01, 0.01. scrolling in the negative reverses the direction the sphere rotates

  control = new function () {
      this.rotationSpeed = 0.001; //Default Staring value
      ...
  }


1. Setup sphere and camera controls 
    to create a sphere we must create a Sphere Mesh. To create a sphere Mesh we must create a Sphere Geometry and Sphere Material.

    In Three.js there are many ways to create "geometry" which is basically a shape... defined by a collection of "vertex" in 3d spatial space. This 3d Spatial space is defined by x, y, z coordinates. 

    If you are familiar with Canvas then you will note that the X increases postively to the right and y Increases positively down. With THREE.js y will increase positively UP(north). Mimics 3d programs like (Blender, Autodesk products). Infact alot of the processes like positioning and translating are smiliar. 

    So back to vertex or vertices 3 link together to make a 
    triangle which is called a face. With three.js you can manually code in vertice and then link them together to create faces to manually create a shape but in this case we will just be using pre built in basic geometry I.E a sphere

    Side Note Models 3d programmers prefer quads 
    because it is easier to smooth the surface prefer Triangles because its easier to code.

    So to create a Basic sphere geometry

    var sphereGeometry = new THREE.SphereGeometry(height, widthsegments, heightsegments);

    height in built scene scale. while widthsegments and height segments are the how many segments it has. For example if a sphere was divided once it would have two segments if two times it would have 3 segments. and so on.
    Segments are important in determining the Smoothness of the geometry more segments = smoother surface.

    after this we require a Material which will cover(wrap) the surface of the geometry. An example of a material would be basic 2d textures, bump maps, specular maps, UV maps. A basic 2d texture can be a simple image downloaded from the net or could be a Three.js given material like
    basic color, BasicMaterial, Phong, Lambert etc... The only thing to note is Basic Materials do not take into how light reacts. (e.g would be rendererd completely black in a scene with light)

    To create a basic Material
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})

    color is once again just given a color value (hex, rgb)
    wireframe is an additional property that can be used to view a naked sphere without faces.

    To finally Create a Mesh in this case a Sphere Mesh we must combine the sphere geometry and sphere material.

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

    A Mesh is basically just the combination of geometry and material. Mesh is the only Object that can be rendered on the scene. So to add the sphere to scene 

    scene.add(sphere)

    To add our own texture such as our own earth image we have to create our own material instead of using just an existing one. 

    var sphereMaterial = createEarthMaterial();

    function createEarthmaterial() {
        var earthTexture = THREE.ImageUtils.loadTexture(...)
        var earthMaterial = new THREE.MeshPhongMaterial();
        earthMaterial.map = earthTexture;

        return earthMaterial;
    }

    Here we are loading in an earth image we dled and combining it with PhongMaterial. PhongMaterial will allow the Mesh to take into account what it looks like with light. 


        var sphereGeometry = new THREE.SphereGeometry(15, 30, 30);
        var sphereMaterial = new THREE.MeshNormalMaterial();


    -Sphere Mesh

        var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        earthMesh.name = 'earth';


    -add to scene

        scene.add(earthMesh);


    Here we are positioning the camera and determining where it is facing with "lookAt". lookAt can be given specific coordinates or an object where it will look to the center.
    

    -add camera controls
    
    camera.position.x = 35; //defining the camera position along the x axis
    camera.position.y = 36; // defining the camera position along the y axis
    camera.position.z = 33; // defining the camera position along the z axis 
    camera.lookAt(scene.position);    

    
    Here is another library that makes our life easier. It is wrapped around the camera object and give us the ability to scroll, zoom in and out, and rotate via clicking the screen.

      camera = new THREE.OrbitControls(camera);

        function render () {
            cameraControl.update(); //updating camera controls
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
    a Sphere Wrapped in a high resolution image of earth looks pretty plain on its own. We can give earth globe another layer by adding in what will look like floating clouds. So another layer. This is basically done by creating Another geometry wrapping it in a floating cloud img and setting a transparency.

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
    Lighting is important as it is a huge factor in determining how realistic a scene looks. There are many different methods of adding lighting using three.js.
    Directional lightining is like parallel light coming from a torch while Ambient light is like atmosphere light which can be given a colour. 

    To create a directional Light...

     var directionalLight = new THREE.DirectionalLight(    0xffffff, 1); // creating the directional light object first parameter is the color second parater is the intensity of the light

    directionalLight.position = new THREE.Vector3(100, 10, -50); // placing the light using manually input vertex coordinates
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

    Rendering is a bit more complicated because of the multiple materials we want to render together and not individually updated. We use the EffectComposer as we to pass in different renders, shaders, masks.

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
