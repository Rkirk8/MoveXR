const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, );


const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1);

  /* CAMERA 
  -------------------------------------------------*/
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
    scene,
    intensity = 0.7
  );

  /* ENVIRONMENT
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
    obstacle.checkCollisions = true;
    return obstacle;
  }

  const obstacles = [
  //------------------------------------------------------------ x right = '+' / left = '-', y height, z depth
    createObstacle("duck1", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.2, 1.8, 2), redMat),
    createObstacle("stepLeft1", { height: 3, width: 2, depth: 1 }, new BABYLON.Vector3(1.45, 1.5, 4.5), redMat),
    createObstacle("stepRight1", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 7), redMat),
    createObstacle("duck2", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.27, 1.8, 9), redMat),
    createObstacle("stepRight2", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 14), redMat),
    createObstacle("duck3", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.27, 1.8, 16), redMat),
    createObstacle("stepLeft2", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(1, 1.5, 11.5), redMat),
    createObstacle("duck3", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.27, 1.8, 16), redMat),
    createObstacle("stepLeft3", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(1, 1.5, 18.5), redMat),
    createObstacle("stepRight3", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 21), redMat)
  ];

/* ANIMATIONS
  -------------------------------------------------*/
  const createZAnimation = (obstacle, index) => {
    const zAnimation = new BABYLON.Animation(
      `zMovement${index}`,
      "position.z",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const zKeyFrames = [
      { frame: 0, value: obstacle.position.z },
      { frame: 100, value: obstacle.position.z - 20 },
      { frame: 200, value: obstacle.position.z }
    ];

    zAnimation.setKeys(zKeyFrames);

    scene.beginDirectAnimation(
      obstacle,
      [zAnimation],
      0,
      200,
      true,
      speed = 0.5,
      obstacleFrequency = 1
    );
  };

  obstacles.forEach((obstacle, index) => {
    createZAnimation(obstacle, index);
  });


  
/* HIT DETECTION: Detect if XR Headset Enters an Obstacle
  -------------------------------------------------*/
  

  /* INTERACTION */
  return scene;
};

// Render loop
createScene().then((sceneToRender) => {
  engine.runRenderLoop(() => sceneToRender.render());
});

// Responsive design
window.addEventListener("resize", function () {
  engine.resize();
});
