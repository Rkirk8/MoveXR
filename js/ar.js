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
    2,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  /* ENABLE AR 
  -------------------------------------------------*/
  // Start WebXR session
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local",
    },
    optionalFeatures: ["local-floor", "bounded-floor"]
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
  /* CREATE MULTIPLE BOXES */
const boxes = [];
const numBoxes = 5; // Change this to add more boxes

for (let i = 0; i < numBoxes; i++) {
  const box = BABYLON.MeshBuilder.CreateBox(`box${i}`, { size: 1 }, scene);
  box.position.set(Math.random() * 4 - 2, 0, Math.random() * -5 - 2); // Random x, start behind player
  const boxMat = new BABYLON.StandardMaterial(`boxMat${i}`, scene);
  boxMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random()); // Random color
  box.material = boxMat;
  boxes.push(box);
}

  /* MOVE BOXES FORWARD & LOOP */
  //move @ 30fps
  const moveBoxes = new BABYLON.Animation("dodgeAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
  //array for key frames
  const dodgeKeys = [];
  dodgeKeys.push({
    frame: 0,
    value: 0
  });
  dodgeKeys.push({
    frame: 150,
    value: 5
  });
  dodgeKeys.push({
    frame: 300,
    value: 0
  });
  moveBoxes.setKeys(dodgeKeys);
  boxes.forEach(box => {
    box.animations.push(moveBoxes);
  })
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
