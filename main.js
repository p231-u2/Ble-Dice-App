import { connectBLE, accel, temperature, calibrate } from "./ble.js";
import { computeOrientation } from "./orientation.js";
import { initScene, updateRotation } from "./threeScene.js";

initScene(document.getElementById("threeCanvas"));

document.getElementById("connectBtn").onclick = async () => {
  document.getElementById("status").textContent = "Connecting...";
  await connectBLE(updateUI);
  document.getElementById("status").textContent = "Connected";
};

document.getElementById("calibrateBtn").onclick = calibrate;

function updateUI() {
  xVal.textContent = accel.x.toFixed(2);
  yVal.textContent = accel.y.toFixed(2);
  zVal.textContent = accel.z.toFixed(2);
  tempVal.textContent = temperature.toFixed(1);

  const { pitch, roll } = computeOrientation(accel.x, accel.y, accel.z);
  updateRotation(pitch, roll);
}
