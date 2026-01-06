export let accel = { x: 0, y: 0, z: 0 };
export let temperature = 0;

let baseline = { x: 0, y: 0, z: 0 };

export function calibrate() {
  baseline = { ...accel };
}

export async function connectBLE(onUpdate) {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: "Minew" }],
    optionalServices: [
      "0000180f-0000-1000-8000-00805f9b34fb", // Battery
      "0000181a-0000-1000-8000-00805f9b34fb"  // Environmental Sensing
    ]
  });

  const server = await device.gatt.connect();

  /* ---- Accelerometer (Minew Custom Service Example) ---- */
  const accelService = await server.getPrimaryService(
    "0000fff0-0000-1000-8000-00805f9b34fb"
  );

  const accelChar = await accelService.getCharacteristic(
    "0000fff4-0000-1000-8000-00805f9b34fb"
  );

  accelChar.startNotifications();
  accelChar.addEventListener("characteristicvaluechanged", e => {
    const d = e.target.value;
    accel.x = (d.getInt16(0, true) / 16384) - baseline.x;
    accel.y = (d.getInt16(2, true) / 16384) - baseline.y;
    accel.z = (d.getInt16(4, true) / 16384) - baseline.z;
    onUpdate();
  });

  /* ---- Temperature ---- */
  const tempService = await server.getPrimaryService(
    "0000181a-0000-1000-8000-00805f9b34fb"
  );

  const tempChar = await tempService.getCharacteristic(
    "00002a6e-0000-1000-8000-00805f9b34fb"
  );

  tempChar.startNotifications();
  tempChar.addEventListener("characteristicvaluechanged", e => {
    temperature = e.target.value.getInt16(0, true) / 100;
  });
}
