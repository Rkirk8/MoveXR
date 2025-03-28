const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = async function () {
  const scene = new BABYLON.Scene(engine);

  /* CAMERA 
  -------------------------------------------------*/
  // Add a camera to the scene
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2,
    10,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  camera.attachControl(canvas, true);

  /* ENABLE AR 
  -------------------------------------------------*/
  // Start WebXR session
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local-floor",
    },
    optionalFeatures: ["bounded-floor", "hand-tracking"]
  });

  /* LIGHTS
  ------------------------------------------------- */
  // Add a light to the scene
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
  light.intensity = 0.7;

  /* SKYBOX 
  -------------------------------------------------*/
  // If there is time, add a skybox option

  

  /* MESHES x right/left, y height, z depth
  -------------------------------------------------*/

  // Materials
  const redMat = new BABYLON.StandardMaterial("redMat", scene);
  redMat.diffuseColor = new BABYLON.Color3(1, 0, 0);

  //Mesh Object
  const createObstacle = (name, dimensions, position, material) => {
    const obstacle = BABYLON.MeshBuilder.CreateBox(name, dimensions, scene);
    obstacle.position = position; //x right/left, y height, z depth
    obstacle.material = material;
    return obstacle;
  }

  const obstacles = [
    createObstacle("duck", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.2, 1.8, 2), redMat),
    createObstacle("stepLeft", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(1, 1.5, 4.5), redMat),
    createObstacle("stepRight", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 7), redMat),
    createObstacle("jump", { height: 0.25, width: 2, depth: 0.5 }, new BABYLON.Vector3(0, 0.123, 9.5), redMat)
  ];

  // x right/left, y height, z depth
  // //box 1 (duck)
  // const box1 = BABYLON.MeshBuilder.CreateBox("box1", { height: .5, width: 2, depth: 1 }, scene);
  // box1.position = new BABYLON.Vector3(0.2, 1.8, 2);
  // box1.material = defaultBoxMaterial;
  // //box 2 (step left)
  // const box2 = BABYLON.MeshBuilder.CreateBox("box2", { height: 3, width: 1.5, depth: 1 }, scene);
  // box2.position = new BABYLON.Vector3(1, 1.5, 4.5);
  // box2.material = defaultBoxMaterial;

  // //box 3 (step right)
  // const box3 = BABYLON.MeshBuilder.CreateBox("box3", { height: 3, width:1.5, depth: 1 }, scene);
  // box3.position = new BABYLON.Vector3(-1, 1.5, 7);
  // box3.material = defaultBoxMaterial;

  // //box 4 (jump)
  // const box4 = BABYLON.MeshBuilder.CreateBox("box4", { height: .25, width: 2, depth: .5 }, scene);  
  // box4.position = new BABYLON.Vector3(0, .123, 9.5);
  // box4.material = defaultBoxMaterial;

/* ANIMATIONS
  -------------------------------------------------*/
  
/* CONTROLS
  -------------------------------------------------*/

  /* INTERACTION */
  return scene;
};

// Continually render the scene in an endless loop
createScene().then((sceneToRender) => {
  engine.runRenderLoop(() => sceneToRender.render());
});

// Add an event listener that adapts to the user resizing the screen
window.addEventListener("resize", function () {
  engine.resize();
});
