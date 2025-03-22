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
    optionalFeatures: ["bounded-floor"]
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

  /* MESHES TO DODGE
  -------------------------------------------------*/
  // default box colour and matterial
  const defaultBoxMaterial = new BABYLON.StandardMaterial("defBoxMat", scene);
  defaultBoxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color



  //box 1 (duck)
  const box1 = BABYLON.MeshBuilder.CreateBox("box1", { height: .5, width: 2, depth: 1 }, scene);
  box1.position = new BABYLON.Vector3(0, 1, 2);
  box1.material = defaultBoxMaterial;
  //box 2
  const box2 = BABYLON.MeshBuilder.CreateBox("box2", { height: 1, width: 0.25, depth: 1 }, scene);
  box2.position = new BABYLON.Vector3(0, 0.5, 4);
  box2.material = defaultBoxMaterial;

  //box 3
  const box3 = BABYLON.MeshBuilder.CreateBox("box3", { height: 1, width: 0.25, depth: 1 }, scene);
  box3.position = new BABYLON.Vector3(0, 0.5, 6);
  box3.material = defaultBoxMaterial;

  //box 4
  const box4 = BABYLON.MeshBuilder.CreateBox("box4", { height: 1, width: 0.25, depth: 1 }, scene);  
  box4.position = new BABYLON.Vector3(0, 0.5, 8);
  box4.material = defaultBoxMaterial;

  /* MOVE BOXES FORWARD & LOOP */
  //move @ 30fps
  
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
