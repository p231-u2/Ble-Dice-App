let smooth = { pitch: 0, roll: 0 };
const alpha = 0.15; // smoothing factor

export function computeOrientation(x, y, z) {
  const pitch = Math.atan2(x, Math.sqrt(y*y + z*z));
  const roll  = Math.atan2(y, Math.sqrt(x*x + z*z));

  smooth.pitch += alpha * (pitch - smooth.pitch);
  smooth.roll  += alpha * (roll - smooth.roll);

  return smooth;
}
