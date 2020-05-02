let dot1 = document.querySelector('.d1');
let messageWindow = document.querySelector('.messanger');
dot1.addEventListener('click', function () {
	messageWindow.classList.add('windowActive');
})
let closeBtn = document.querySelector('.messanger__close');
closeBtn.addEventListener('click', function () {
	messageWindow.classList.remove('windowActive');
})
let canvas = document.getElementById("canvas");
let engine = null;
let scene = null;
let sceneToRender = null;
let createDefaultEngine = function () {
	return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
};



const setTopBottomRatio = (camera) => {
	const ratio = canvas.height / canvas.width;
	camera.orthoTop = camera.orthoRight * ratio;
	camera.orthoBottom = camera.orthoLeft * ratio;
};
const zoom2DView = (camera, delta) => {
	const zoomingOut = delta < 0;

	// limit zooming in to no less than 1 units.
	if (!zoomingOut && Math.abs(camera.orthoLeft) <= 1){
		dot1.style.height = "100px";
		dot1.style.left = "-40%"
		dot1.style.top = "75%";
		return dot1.style.width = "150px";
	}
	else {
		dot1.style.height = "50px";
		dot1.style.top = "55%";
		dot1.style.left = "30%";
		dot1.style.width = "50px"
	}

	camera.orthoLeft += delta;
	camera.orthoRight -= delta;

	setTopBottomRatio(camera);

	// decrease pan sensitivity the closer the zoom level.
	camera.panningSensibility = 22250 / Math.abs(camera.orthoLeft);
};

const resetCameraZoom = (camera) => {
	camera.orthoLeft = -0.5;
	camera.orthoRight = 0.5;

	setTopBottomRatio(camera);
};

var createScene = function () {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera('Camera', 1, 1, -10, BABYLON.Vector3.Zero(), scene);

	resetCameraZoom(camera);

	scene.onPointerObservable.add(({ event }) => {
		const delta = (Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))) * 1.5;
		zoom2DView(camera, delta);
	}, BABYLON.PointerEventTypes.POINTERWHEEL);

	// lock the camera's placement, zooming is done manually in orthographic mode.
	// Locking this fixes strange issues with Hemispheric Light
	camera.lowerRadiusLimit = camera.radius;
	camera.upperRadiusLimit = camera.radius;

	// This attaches the camera to the canvas
	camera.attachControl(canvas, false,false,true);
	camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;



	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	let building = BABYLON.SceneLoader.ImportMesh("", "scenes/", "test.babylon.gltf", scene, function (newMeshes) {
		// Set the target of the camera to the first imported mesh
		camera.target = newMeshes[0];
	});




	// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
	let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 2;

	return scene;

};



engine = createDefaultEngine();
if (!engine) throw 'engine should not be null.';
scene = createScene();;
sceneToRender = scene

engine.runRenderLoop(function () {
	if (sceneToRender) {
		sceneToRender.render();
	}
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});

// // function showWorldAxis(size, heightAboveGround, scene) {
// // 	var makeTextPlane = function(text, color, size) {
// // 			var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
// // 			dynamicTexture.hasAlpha = true;
// // 			dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
// // 			var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
// // 			plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
// // 			plane.material.backFaceCulling = false;
// // 			plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
// // 			plane.material.diffuseTexture = dynamicTexture;
// // 			return plane;
// // 	};
// // 	var axisX = BABYLON.Mesh.CreateLines("axisX", [
// // 			new BABYLON.Vector3(0, heightAboveGround, 0), new BABYLON.Vector3(size, heightAboveGround, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size + heightAboveGround, 0),
// // 			new BABYLON.Vector3(size, heightAboveGround, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size + heightAboveGround, 0)
// // 	], scene);
// // 	axisX.color = new BABYLON.Color3(1, 0, 0);
// // 	var xChar = makeTextPlane("X", "red", size / 10);
// // 	xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size + heightAboveGround, 0);
// // 	var axisY = BABYLON.Mesh.CreateLines("axisY", [
// // 			BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
// // 			new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
// // 	], scene);
// // 	axisY.color = new BABYLON.Color3(0, 1, 0);
// // 	var yChar = makeTextPlane("Y", "green", size / 10);
// // 	yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
// // 	var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
// // 			new BABYLON.Vector3(0, heightAboveGround, 0), new BABYLON.Vector3(0, heightAboveGround, size), new BABYLON.Vector3(0, -0.05 * size + heightAboveGround, size * 0.95),
// // 			new BABYLON.Vector3(0, heightAboveGround, size), new BABYLON.Vector3(0, 0.05 * size + heightAboveGround, size * 0.95)
// // 	], scene);
// // 	axisZ.color = new BABYLON.Color3(0, 0, 1);
// // 	var zChar = makeTextPlane("Z", "blue", size / 10);
// // 	zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
// // };


// 	// You have to create a function called createScene. This function must return a BABYLON.Scene object
// // You can reference the following variables: scene, canvas
// // You must at least define a camera
// // More info here: https://doc.babylonjs.com/generals/The_Playground_Tutorial

// // var createScene = function() {
// // 	var scene = new BABYLON.Scene(engine);

// //     // Set Camera
// //     var camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, 0, 100, new BABYLON.Vector3(0, 100, 0), scene);

// //     camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

// //     var distance = 500;	
// //     var aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width; 
// //     camera.orthoLeft = -distance/2;
// //     camera.orthoRight = distance / 2;
// //     camera.orthoBottom = camera.orthoLeft * aspect;
// //     camera.orthoTop = camera.orthoRight * aspect;

// //     // last param from this function is telling you which buton to use for panning, so no more need line 34
// //     camera.attachControl(canvas, true, false, 0);
// //     // you don't need to call 2 time same function. it is enough 1 time
// //     // camera.attachControl(canvas, true, false);

// //     // using this property you can choose which axis to be use for panning
// //     camera.panningAxis = new BABYLON.Vector3(1, 1, 0);
// //     camera.upperBetaLimit = Math.PI / 2;
// //     camera.wheelPrecision = 0.1;
// //     camera.panningSensibility = 1;
// //     camera.inertia = 0.1;
// //     camera.panningInertia = 0.2;
// //     // never use variable with _ because they are private and can be changed durring development
// //     // camera._panningMouseButton = 0; // change functionality from left to right mouse button
// //     camera.angularSensibilityX = 500;
// //     camera.angularSensibilityY = 500;

// //     // Set Objects
// //     var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
// //     var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2}, scene);
// //     sphere.position.y = 1;
// //     var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:200, width:200, subdivisions: 2}, scene);

// //     var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
// //     myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
// //     sphere.material = myMaterial;

// //     showWorldAxis(300, 100, scene);
// // 		// var building = BABYLON.SceneLoader.Append("./", "test.babylon.gltf", scene, function (meshes) {    
// // 		// 	scene.createDefaultCameraOrLight(true, true, true);
// // 		// 	}); 
// //     return scene;
// // };



// //     function showWorldAxis(size, heightAboveGround, scene) {
// //         var makeTextPlane = function(text, color, size) {
// //             var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
// //             dynamicTexture.hasAlpha = true;
// //             dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
// //             var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
// //             plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
// //             plane.material.backFaceCulling = false;
// //             plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
// //             plane.material.diffuseTexture = dynamicTexture;
// //             return plane;
// //         };
// //         var axisX = BABYLON.Mesh.CreateLines("axisX", [
// //             new BABYLON.Vector3(0, heightAboveGround, 0), new BABYLON.Vector3(size, heightAboveGround, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size + heightAboveGround, 0),
// //             new BABYLON.Vector3(size, heightAboveGround, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size + heightAboveGround, 0)
// //         ], scene);
// //         axisX.color = new BABYLON.Color3(1, 0, 0);
// //         var xChar = makeTextPlane("X", "red", size / 10);
// //         xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size + heightAboveGround, 0);
// //         var axisY = BABYLON.Mesh.CreateLines("axisY", [
// //             BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
// //             new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
// //         ], scene);
// //         axisY.color = new BABYLON.Color3(0, 1, 0);
// //         var yChar = makeTextPlane("Y", "green", size / 10);
// //         yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
// //         var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
// //             new BABYLON.Vector3(0, heightAboveGround, 0), new BABYLON.Vector3(0, heightAboveGround, size), new BABYLON.Vector3(0, -0.05 * size + heightAboveGround, size * 0.95),
// //             new BABYLON.Vector3(0, heightAboveGround, size), new BABYLON.Vector3(0, 0.05 * size + heightAboveGround, size * 0.95)
// //         ], scene);
// //         axisZ.color = new BABYLON.Color3(0, 0, 1);
// //         var zChar = makeTextPlane("Z", "blue", size / 10);
// //         zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
// //     };
