const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1);

  /* CAMERA SETUP
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
  -------------------------------------------------*/
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
  light.intensity = 0.7;

  /* HUD (HEAD-UP DISPLAY)
  -------------------------------------------------*/
  let speed = 0.01; // Default speed

  // Create a CUI mesh to display speed
  const speedLevelMesh = BABYLON.MeshBuilder.CreatePlane("speedLevel", { width: 2, height: 0.2 }, scene);
  speedLevelMesh.position = new BABYLON.Vector3(0, 1.5, 2); // Position it in front of the user
  speedLevelMesh.rotation = new BABYLON.Vector3(0, 0, 0); // Face directly toward the user

  // Create a dynamic texture for the speed level
  const speedTexture = new BABYLON.DynamicTexture("speedTexture", { width: 512, height: 128 }, scene);
  const speedMaterial = new BABYLON.StandardMaterial("speedMaterial", scene);
  speedMaterial.diffuseTexture = speedTexture;
  speedLevelMesh.material = speedMaterial;

  // Function to update the speed level display
  const updateSpeedLevel = () => {
    const ctx = speedTexture.getContext();
    ctx.clearRect(0, 0, 512, 128);

    // Draw background bar
    ctx.fillStyle = "gray";
    ctx.fillRect(50, 50, 400, 30);

    // Draw speed bar
    const speedPercentage = Math.min(speed / 0.2, 1); // Normalize speed to a percentage
    ctx.fillStyle = "green";
    ctx.fillRect(50, 50, 400 * speedPercentage, 30);

    // Draw speed text
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Arial";
    const speedLevel = Math.floor(speed * 100); // Convert speed X 100
    ctx.fillText(`Level: ${speedLevel}`, 200, 40);

    speedTexture.update();
  };

  // Dynamically position the speed level in front of the user
  scene.registerBeforeRender(() => {
    const cameraPosition = xr.baseExperience.camera.position;
    speedLevelMesh.position = new BABYLON.Vector3(cameraPosition.x, cameraPosition.y + 1.5, cameraPosition.z + 2); // Keep it in front of the user
    updateSpeedLevel();
  });

  /* SCORE DISPLAY
  -------------------------------------------------*/
  let score = 0;

  // Create a dynamic texture for the score display
  const scoreTexture = new BABYLON.DynamicTexture("scoreTexture", { width: 512, height: 128 }, scene);
  const scoreMaterial = new BABYLON.StandardMaterial("scoreMaterial", scene);
  scoreMaterial.diffuseTexture = scoreTexture;

  // Create a separate mesh for the score display
  const scoreMesh = BABYLON.MeshBuilder.CreatePlane("scoreDisplay", { width: 2, height: 0.2 }, scene);
  scoreMesh.position = new BABYLON.Vector3(0, 1.8, 2); // Slightly above the speed level
  scoreMesh.material = scoreMaterial;

  // Function to update the score display
  const updateScoreDisplay = () => {
    const ctx = scoreTexture.getContext();
    ctx.clearRect(0, 0, 512, 128);

    // Draw background bar
    ctx.fillStyle = "gray";
    ctx.fillRect(50, 50, 400, 30);

    // Draw score text
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`Score: ${score}`, 200, 40);

    scoreTexture.update();
  };

  // Dynamically position the score display in front of the user
  scene.registerBeforeRender(() => {
    const cameraPosition = xr.baseExperience.camera.position;
    scoreMesh.position = new BABYLON.Vector3(cameraPosition.x, cameraPosition.y + 1.8, cameraPosition.z + 2); // Keep it in front of the user
    updateScoreDisplay();
  });

  // Increment the score for each obstacle not hit
  obstacles.forEach((obstacle) => {
    scene.registerBeforeRender(() => {
      if (!isPaused && obstacle.position.z < xr.baseExperience.camera.position.z - 1) {
        // Check if the obstacle has moved past the player
        score += 10; // Add 10 points for avoiding the obstacle
        console.log(`Score increased! Current score: ${score}`);
        
        // Move the obstacle further back to reset its position
        let maxZ = -Infinity;
        obstacles.forEach((obs) => {
          if (obs.position.z > maxZ) {
            maxZ = obs.position.z;
          }
        });
        obstacle.position.z = maxZ + 3; // Reset obstacle position
      }
    });
  });

  /* GUI CONTROLS
  -------------------------------------------------*/
  const manager = new BABYLON.GUI.GUI3DManager(scene);

  // Create a main panel for our controls
  const panel = new BABYLON.GUI.StackPanel3D();
  manager.addControl(panel);

  // Position the panel directly in front of the user on the ground
  panel.position = new BABYLON.Vector3(0, 0.1, 1); // x=0 (centered), y=0.1 (slightly above ground), z=1 (in front of user)
  panel.rotation = new BABYLON.Vector3(-Math.PI / 4, 0, 0); // Tilt the panel slightly upward for better visibility
  panel.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Scale down the panel
  panel.margin = 0.02; // Add spacing between buttons

  // Add buttons to the panel
  const speedUpButton = new BABYLON.GUI.HolographicButton("speedUp");
  panel.addControl(speedUpButton);
  speedUpButton.text = "Speed Up";
  speedUpButton.onPointerUpObservable.add(() => {
    speed += 0.01;
  });

  const speedDownButton = new BABYLON.GUI.HolographicButton("speedDown");
  panel.addControl(speedDownButton);
  speedDownButton.text = "Slow Down";
  speedDownButton.onPointerUpObservable.add(() => {
    speed = Math.max(0.01, speed - 0.01);
  });

  const pauseButton = new BABYLON.GUI.HolographicButton("pause");
  panel.addControl(pauseButton);
  pauseButton.text = "Pause";
  let isPaused = false; // Track animation state
  pauseButton.onPointerUpObservable.add(() => {
    isPaused = true; // Pause the animation
  });

  const playButton = new BABYLON.GUI.HolographicButton("play");
  panel.addControl(playButton);
  playButton.text = "Play";
  playButton.onPointerUpObservable.add(() => {
    isPaused = false; // Resume the animation
  });

  /* OBSTACLES
  -------------------------------------------------*/
  const redMat = new BABYLON.StandardMaterial("redMat", scene);
  redMat.diffuseColor = new BABYLON.Color3(1, 0, 0);

  const createObstacle = (name, dimensions, position, material) => {
    const obstacle = BABYLON.MeshBuilder.CreateBox(name, dimensions, scene);
    obstacle.position = position; // x right/left, y height, z depth
    obstacle.material = material;
    obstacle.checkCollisions = true;
    return obstacle;
  };

  const obstacles = [
    createObstacle("duck1", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.2, 1.8, 2), redMat),
    createObstacle("stepLeft1", { height: 3, width: 2, depth: 1 }, new BABYLON.Vector3(1.45, 1.5, 4.5), redMat),
    createObstacle("stepRight1", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 7), redMat),
    createObstacle("duck2", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.27, 1.8, 9), redMat),
    createObstacle("stepRight2", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 14), redMat),
    createObstacle("duck3", { height: 0.5, width: 2, depth: 1 }, new BABYLON.Vector3(0.27, 1.8, 16), redMat),
    createObstacle("stepLeft2", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(1, 1.5, 11.5), redMat),
    createObstacle("stepLeft3", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(1, 1.5, 18.5), redMat),
    createObstacle("stepRight3", { height: 3, width: 1.5, depth: 1 }, new BABYLON.Vector3(-1, 1.5, 21), redMat)
  ];

  /* ANIMATIONS
  -------------------------------------------------*/
  const createEndlessZAnimation = (obstacle, index) => {
    scene.registerBeforeRender(() => {
      if (!isPaused) { // Only move obstacles if not paused
        obstacle.position.z -= speed;

        // When obstacle moves past a certain point, reset it to the back
        if (obstacle.position.z < -15) {
          let maxZ = -Infinity;
          obstacles.forEach(obs => {
            if (obs.position.z > maxZ) {
              maxZ = obs.position.z;
            }
          });

          obstacle.position.z = maxZ + 3; // Add spacing between obstacles
        }
      }
    });
  };

  // Apply animation to each obstacle
  obstacles.forEach((obstacle, index) => {
    createEndlessZAnimation(obstacle, index);
  });

  /* HIT DETECTION
  -------------------------------------------------*/
  scene.registerBeforeRender(() => {
    const headsetPosition = xr.baseExperience.camera.position; // Get the XR headset's position

    obstacles.forEach((obstacle) => {
      const obstacleBoundingBox = obstacle.getBoundingInfo().boundingBox; // Get the obstacle's bounding box
      const isColliding = obstacleBoundingBox.intersectsPoint(headsetPosition); // Check if the headset is inside the bounding box

      if (isColliding) {
        console.log(`Collision detected with obstacle: ${obstacle.name}`);
        isPaused = true; // Pause the game on collision
        // Handle collision (e.g., reset game, reduce score, etc.)
      }
    });
  });

  return scene;
};

/* RENDER LOOP
-------------------------------------------------*/
createScene().then((sceneToRender) => {
  engine.runRenderLoop(() => sceneToRender.render());
});

/* RESPONSIVE DESIGN
-------------------------------------------------*/
window.addEventListener("resize", function () {
  engine.resize();
});
