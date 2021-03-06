        // global variables
        var renderer;
        var scene;
        var camera;
        var control;
        var stats;
        var cameraControl;

        // background stuff
        var cameraBG;
        var sceneBG;
        var composer;
        var clock;

        // intialize scene
        function init() {

            clock = new THREE.Clock();

            // create a scene, that will hold all our elements such as objects, cameras and lights.
            scene = new THREE.Scene();

            // create a camera, which defines where we're looking at.
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

            // create a render, sets the background color and the size
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0x000000, 1.0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMapEnabled = true;

            // create a sphere
            var sphereGeometry = new THREE.SphereGeometry(15, 60, 60);
            var sphereMaterial = createEarthMaterial();
            var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            earthMesh.name = 'earth';
            scene.add(earthMesh);

            // create a cloudGeometry, slighly bigger than the original sphere
            var cloudGeometry = new THREE.SphereGeometry(15.3, 60, 60);
            var cloudMaterial = createCloudMaterial();
            var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloudMesh.name = 'clouds';
            scene.add(cloudMesh);

            // now add some better lighting
            var ambientLight = new THREE.AmbientLight(0x111111);
            ambientLight.name='ambient';
            scene.add(ambientLight);

            // add sunlight (light
            var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position = new THREE.Vector3(100,10,-50);
            directionalLight.name='directional';
            scene.add(directionalLight);

            // position and point the camera to the center of the scene
            camera.position.x = 25;
            camera.position.y = 10;
            camera.position.z = 23;
            camera.lookAt(scene.position);

            // add controls
            cameraControl = new THREE.OrbitControls(camera);

            // setup the control object for the control gui
            control = new function () {
            this.rotationSpeed = 0.001;
            this.ambientLightColor = ambientLight.color.getHex();
            this.directionalLightColor = directionalLight.color.getHex();
            };

            // add extras
            addControlGui(control);
            addStatsObject();


            // add background using a camera
            cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
            cameraBG.position.z = 50;
            sceneBG = new THREE.Scene();

            var materialColor = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("./assets/starry_background.jpg"), depthTest: false });
            var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialColor);
            bgPlane.position.z = -100;
            bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
            sceneBG.add(bgPlane);

            // setup the composer steps
            // first render the background
            var bgPass = new THREE.RenderPass(sceneBG, cameraBG);
            // next render the scene (rotating earth), without clearing the current output
            var renderPass = new THREE.RenderPass(scene, camera);
            renderPass.clear = false;
            // finally copy the result to the screen
            var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
            effectCopy.renderToScreen = true;

            // add these passes to the composer
            composer = new THREE.EffectComposer(renderer);
            composer.addPass(bgPass);
            composer.addPass(renderPass);
            composer.addPass(effectCopy);

            // add the output of the renderer to the html element
            document.body.appendChild(renderer.domElement);

            // call the render function, after the first render, interval is determined
            // by requestAnimationFrame
            render();
        }


        function createEarthMaterial() {
            // 4096 is the maximum width for maps
            var earthTexture = THREE.ImageUtils.loadTexture("./assets/earthmap4k.jpg");

            var earthMaterial = new THREE.MeshPhongMaterial();
            earthMaterial.map = earthTexture;

            return earthMaterial;
            }

        function createCloudMaterial() {
            var cloudTexture = THREE.ImageUtils.loadTexture("./assets/fair_clouds_4k.png");

            var cloudMaterial = new THREE.MeshPhongMaterial();
            cloudMaterial.map = cloudTexture;
            cloudMaterial.transparent = true;

            return cloudMaterial;
            }

        function addControlGui(controlObject) {
            var gui = new dat.GUI();
            gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);
            gui.addColor(controlObject, 'ambientLightColor');
            gui.addColor(controlObject, 'directionalLightColor');
            }

        function addStatsObject() {
            stats = new Stats();
            stats.setMode(0);

            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.body.appendChild(stats.domElement);
            }


            // Called when the scene needs to be rendered. Delegates to requestAnimationFrame
            // future renders

        function render() {

            // update stats
            stats.update();

            // update camera
            cameraControl.update();

            scene.getObjectByName('earth').rotation.y+=control.rotationSpeed;
            scene.getObjectByName('clouds').rotation.y+=control.rotationSpeed*1.1;

            // update light colors
            scene.getObjectByName('ambient').color = new THREE.Color(control.ambientLightColor);
            scene.getObjectByName('directional').color = new THREE.Color(control.directionalLightColor);

            // and render the scene, renderer shouldn't autoclear, we let the composer steps do that themselves
            // rendering is now done through the composer, which executes the render steps
            renderer.autoClear = false;
            composer.render();

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            }


        
        // Function handles the resize event. This make sure the camera and the renderer
        // are updated at the correct moment.
        
        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            }

        // calls the init function when the window is done loading.
        window.onload = init;
        // calls the handleResize function when the window is resized
        window.addEventListener('resize', handleResize, false);