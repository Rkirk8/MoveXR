const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Difficulties
const GameConfig = {
  difficulty: {
    easy: { speed: 0.5, obstacleFrequency: 1, maxObstacles: 3 },
    medium: { speed: 1, obstacleFrequency: 2, maxObstacles: 5 },
    hard: { speed: 2, obstacleFrequency: 3, maxObstacles: 7 }
  },
  currentDifficulty: 'easy',
  score: 0,
  lives: 3
};

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);

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
    optionalFeatures: ["local-floor", "hand-tracking"]
  });

  /* LIGHTS
  ------------------------------------------------- */
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
  light.intensity = 0.7;

  /* SKYBOX 
  -------------------------------------------------*/
  // Placeholder for skybox


  /* MESHES x right/left, y height, z depth
  -------------------------------------------------*/
  const redMat = new BABYLON.StandardMaterial("redMat", scene);
  redMat.diffuseColor = new BABYLON.Color3(1, 0, 0);

  /* OBSTACLES
  -------------------------------------------------*/
  const obstacleTypes = [
    {
      name: "duck",
      dimensions: { height: 0.5, width: 3, depth: 1 },
      xPositions: [1.7, 0.27]
    },
    {
      name: "stepLeft",
      dimensions: { height: 3, width: 3, depth: 1 }, xPositions: [1, 1.45]
    },
    {
      name: "stepRight",
      dimensions: { height: 3, width: 3, depth: 1 }, xPositions: [-1, -1.45],
    }
  ];

  /* OBSTACLE MANAGEMENT 
  -------------------------------------------------*/

  // Return a random obstacle from the array w/ Math.random() function.
  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Function to generate obstacles
  const generateObstacles = () => {
    const obstacles = []; // Array to store generated obstacles
    let currentZPosition = 3; // First obstacle position
    const zSpacing = 2.5; // Space consecutive obstacles

    // Shuffle obstacle types and select the first three for initial obstacles
    const firstThreeTypes = [obstacleTypes].sort(() => Math.random() - 0.5);

    firstThreeTypes.forEach((type, index) => {
      const name = `${type.name}${index + 1}`; // Unique name for each obstacle
      const xPosition = getRandomItem(type.xPositions); // Random X position from type

      const obstacle = createObstacle(
        name, 
        { 
          height: type.height, 
          width: type.width, 
          depth: type.depth 
        }, 
        new BABYLON.Vector3(xPosition, 1.5, currentZPosition), // Position vector for obstacle
        redMat // Material for obstacle
      );

      obstacles.push(obstacle); // Add created obstacle to the array
      currentZPosition += zSpacing; // Update Z position for the next obstacle
    });

    return obstacles; // Return the array of generated obstacles
  };

  // Generate obstacles and store them in an array
  const obstacles = generateObstacles();

  /* ANIMATIONS
  -------------------------------------------------*/
  const createZAnimation = (obstacle, index) => {
    // Create an animation for the Z-axis
    const zAnimation = new BABYLON.Animation(
      `zMovement${index}`,
      "position.z",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Define the keyframes
    const zKeyFrames = [
      { frame: 0, value: obstacle.position.z },
      { frame: 100, value: obstacle.position.z - 20 },
      { frame: 200, value: obstacle.position.z }
    ];

    // Set the keyframes for the animation.
    zAnimation.setKeys(zKeyFrames);

    // Start the animation on the obstacle. The animation will loop indefinitely.
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

  // Animate each obstacle
  obstacles.forEach((obstacle, index) => {
    createZAnimation(obstacle, index);
  });

  /* HIT DETECTION: Detect if XR Headset Enters an Obstacle
  -------------------------------------------------*/
  // Placeholder for hit detection implementation

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


