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
    //add debug
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

  /* HUD
  -------------------------------------------------*/
  let speed = 0.05; // Default speed

  // Function to check if device supports AR
  const checkARCapabilities = () => {
    return !!(navigator.xr && window.isSecureContext && 
      (window.DeviceOrientationEvent || window.DeviceMotionEvent));
  };

  if (checkARCapabilities() && xr.baseExperience) {
    console.log("AR capable device detected");

    // Create a CUI mesh to display speed
    const speedLevelMesh = BABYLON.MeshBuilder.CreatePlane("speedLevel", { width: 2, height: 0.2 }, scene);
    speedLevelMesh.position = new BABYLON.Vector3(0, 1.5, 2);
    speedLevelMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);

    // Create 3D GUI manager
    const manager = new BABYLON.GUI.GUI3DManager(scene);

    // Create a main panel for our controls
    const panel = new BABYLON.GUI.StackPanel3D();
    manager.addControl(panel);
    panel.position = new BABYLON.Vector3(2, 1.5, 2);

    // Create speed up button
    const speedUpButton = new BABYLON.GUI.HolographicButton("speedUp");
    panel.addControl(speedUpButton);
    speedUpButton.text = "Speed Up";
    speedUpButton.onPointerUpObservable.add(() => {
      speed += 0.01;
    });

    // Create speed down button
    const speedDownButton = new BABYLON.GUI.HolographicButton("speedDown");
    panel.addControl(speedDownButton);
    speedDownButton.text = "Slow Down";
    speedDownButton.onPointerUpObservable.add(() => {
      speed = Math.max(0.01, speed - 0.01);
    });

    // Speed display texture and updates remain the same
    const speedTexture = new BABYLON.DynamicTexture("speedTexture", { width: 512, height: 128 }, scene);
    const speedMaterial = new BABYLON.StandardMaterial("speedMaterial", scene);
    speedMaterial.diffuseTexture = speedTexture;
    speedLevelMesh.material = speedMaterial;

    const updateSpeedLevel = () => {
      const ctx = speedTexture.getContext();
      ctx.clearRect(0, 0, 512, 128);

      // Draw background bar
      ctx.fillStyle = "gray";
      ctx.fillRect(50, 50, 400, 30);

      // Draw speed bar
      const speedPercentage = Math.min(speed / 0.2, 1);
      ctx.fillStyle = "green";
      ctx.fillRect(50, 50, 400 * speedPercentage, 30);

      // Draw speed text
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Speed: ${speed.toFixed(2)}`, 200, 40);

      speedTexture.update();
    };

    scene.registerBeforeRender(() => {
      updateSpeedLevel();
    });

  } else {
    console.log("Using standard display mode");

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Speed Display
    const speedDisplay = new BABYLON.GUI.TextBlock();
    speedDisplay.text = `Speed: ${speed.toFixed(2)}`;
    speedDisplay.color = "white";
    speedDisplay.fontSize = 24;
    speedDisplay.top = "-40px";
    speedDisplay.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    speedDisplay.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(speedDisplay);

    // Speed Up Button
    const speedUpButton = BABYLON.GUI.Button.CreateSimpleButton("speedUp", "⬆️ Speed Up");
    speedUpButton.width = "150px";
    speedUpButton.height = "40px";
    speedUpButton.color = "white";
    speedUpButton.background = "green";
    speedUpButton.top = "10px";
    speedUpButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    speedUpButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    speedUpButton.onPointerClickObservable.add(() => {
      speed += 0.01;
      speedDisplay.text = `Speed: ${speed.toFixed(2)}`;
    });
    advancedTexture.addControl(speedUpButton);

    // Speed Down Button
    const speedDownButton = BABYLON.GUI.Button.CreateSimpleButton("speedDown", "⬇️ Slow Down");
    speedDownButton.width = "150px";
    speedDownButton.height = "40px";
    speedDownButton.color = "white";
    speedDownButton.background = "red";
    speedDownButton.top = "60px";
    speedDownButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    speedDownButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    speedDownButton.onPointerClickObservable.add(() => {
      speed = Math.max(0.01, speed - 0.01);
      speedDisplay.text = `Speed: ${speed.toFixed(2)}`;
    });
    advancedTexture.addControl(speedDownButton);
  }

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
  
  const createEndlessZAnimation = (obstacle, index) => {
    // Create an observer that runs before each frame render
    scene.registerBeforeRender(() => {
      // Move the obstacle toward the player (decrease Z value)
      obstacle.position.z -= speed; 
      
      // When obstacle moves past a certain point, reset it to the back
      if (obstacle.position.z < -15) {
        // Find the furthest obstacle
        let maxZ = -Infinity;
        obstacles.forEach(obs => {
          if (obs.position.z > maxZ) {
            maxZ = obs.position.z;
          }
        });
        
        // Place this obstacle behind the furthest one, maintaining the pattern
        obstacle.position.z = maxZ + 3; // Add spacing between obstacles
      }
    });
  };

  // Apply animation to each obstacle
  obstacles.forEach((obstacle, index) => {
    createEndlessZAnimation(obstacle, index);
  });

  /* HIT DETECTION: Detect if XR Headset Enters an Obstacle
  -------------------------------------------------*/

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
