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


  /* OBSTACLE GENERATION UTILITIES
  -------------------------------------------------*/
  // Obstacle Types
  const obstacleTypes = [
    { 
      name: "duck", 
      dimensions: { height: 0.5, width: 2, depth: 1 }
    },
    { 
      name: "stepLeft", 
      dimensions: { height: 1.5, width: 1, depth: 1 }
    },
    { 
      name: "stepRight", 
      dimensions: { height: 1.5, width: 1, depth: 1 }
    }
  ];

  // Material Colors
  const materialColors = [
    { name: "red", color: new BABYLON.Color3(1, 0, 0) },
    { name: "blue", color: new BABYLON.Color3(0, 0, 1) },
    { name: "green", color: new BABYLON.Color3(0, 1, 0) },
    { name: "purple", color: new BABYLON.Color3(0.5, 0, 0.5) }
  ];

  // Create obstacle material
  const createObstacleMaterial = (scene, color) => {
    const material = new BABYLON.StandardMaterial(`${color.name}Mat`, scene);
    material.diffuseColor = color.color;
    material.alpha = 0.7;
    return material;
  };
  // Obstacle generation function
  const generateObstacle = () => {
    // Randomly select obstacle type
    const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    // Randomly select material color
    const materialColor = materialColors[Math.floor(Math.random() * materialColors.length)];
    
    // Random horizontal position
    const xPosition = (Math.random() - 0.5) * 4; // Spread across -2 to 2 on x-axis
    
    // Create obstacle
    const obstacle = BABYLON.MeshBuilder.CreateBox(
      obstacleType.name + Date.now(), 
      obstacleType.dimensions, 
      scene
    );
    
    // Position obstacle
    obstacle.position = new BABYLON.Vector3(
      xPosition, 
      obstacleType.dimensions.height / 2, 
      20 // Start far back
    );
    
    // Apply material
    const obstacleMaterial = createObstacleMaterial(scene, materialColor);
    obstacle.material = obstacleMaterial;
    
    return obstacle;
  };

  // Obstacle management
  const activeObstacles = [];

  // Obstacle spawning function
  const spawnObstacles = () => {
    const maxObstacles = GameConfig.difficulty[GameConfig.currentDifficulty].maxObstacles;
    
    // Remove off-screen obstacles
    for (let i = activeObstacles.length - 1; i >= 0; i--) {
      if (activeObstacles[i].position.z < -5) {
        activeObstacles[i].dispose();
        activeObstacles.splice(i, 1);
      }
    }

    // Spawn new obstacles if below max
    while (activeObstacles.length < maxObstacles) {
      const newObstacle = generateObstacle();
      activeObstacles.push(newObstacle);
    }
  };

  // Animation for moving obstacles
  const animateObstacles = () => {
    activeObstacles.forEach((obstacle) => {
      // Move obstacle forward
      obstacle.position.z -= 0.1 * GameConfig.difficulty[GameConfig.currentDifficulty].speed;
    });
  };

  // Spawn initial obstacles
  spawnObstacles();


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


