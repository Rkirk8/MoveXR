const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = async function () {
  const scene = new BABYLON.Scene(engine);

  /*CAMERA
  -----------------------------------------------------------------------------------------------------------------*/
  // add a camera to the scene
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.Pi / 2, Math.Pi / 2, 2, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  
/* ENABLE AR
  -----------------------------------------------------------------------------------------------------------------*/
  // start webXR session
  const xr = await scene.createDefultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local"
    },
    optionalFeatures: true
  });

  /*LIGHTS
  -----------------------------------------------------------------------------------------------------------------*/
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  light.intensity = 0.7;

  /*SKYBOX
  -----------------------------------------------------------------------------------------------------------------*/
  // If there is time add a skybox option

  /*MESHES TO DODGE
  -----------------------------------------------------------------------------------------------------------------*/
  
  //simple box for a test
  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  
  
  /*ANIMATIONS
  -----------------------------------------------------------------------------------------------------------------*/

/* INTERACTION
  -----------------------------------------------------------------------------------------------------------------*/
  return scene;
};

// Continually render the scene in an endless loop
createScene().then((sceneToRender) => {
  engine.runRenderLoop(() => sceneToRender.render());
});

// Add an event listener that adapts to the user resizing the screen
window.addEventListener("resize", function() {
  engine.resize();
});