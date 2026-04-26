// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,5);
scene.add(light);

// ROAD
const roadGeo = new THREE.PlaneGeometry(6, 200);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// LANES
const lanes = [-2, 0, 2];
let playerLane = 1;

// PLAYER (insan görünümlü basit model)
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 1.2, 0.6),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.3),
  new THREE.MeshStandardMaterial({ color: 0xffcc99 })
);

body.position.y = 0.6;
head.position.y = 1.3;

const player = new THREE.Group();
player.add(body);
player.add(head);
scene.add(player);

player.position.set(lanes[playerLane], 0, 0);

// HOUSE FUNCTION
function createHouse(z) {
  const house = new THREE.Group();

  // body
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );

  // roof (triangle)
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.6,1,4),
    new THREE.MeshStandardMaterial({ color: 0x553311 })
  );
  roof.position.y = 1.8;
  roof.rotation.y = Math.PI / 4;

  // window
  const window = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5,0.5),
    new THREE.MeshBasicMaterial({ color: 0x87cefa })
  );
  window.position.set(0,0.2,1.01);

  house.add(box);
  house.add(roof);
  house.add(window);

  house.position.set(lanes[Math.floor(Math.random()*3)], 0, z);

  scene.add(house);
  return house;
}

// OBJECTS
let houses = [];
let coins = [];
let obstacles = [];

// SPAWN
function spawn() {
  houses.push(createHouse(-50));
}
setInterval(spawn, 1200);

// INPUT
document.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowLeft" && playerLane > 0) playerLane--;
  if(e.key === "ArrowRight" && playerLane < 2) playerLane++;
});

// GAME LOOP
function animate() {
  requestAnimationFrame(animate);

  // MOVE PLAYER
  player.position.x = lanes[playerLane];

  // MOVE WORLD
  houses.forEach(h=>{
    h.position.z += 0.2;
  });

  // CAMERA FOLLOW
  camera.position.z = player.position.z + 5;
  camera.position.y = 3;
  camera.lookAt(player.position);

  renderer.render(scene,camera);
}

animate();
