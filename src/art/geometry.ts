// Pointed leaf lying along +x from the origin, used by the small gilded sprigs.
const f = (v: number) => Math.round(v * 10) / 10

export function leafPath(length: number, width: number) {
  return `M0,0C${f(length * .22)},${f(-width)} ${f(length * .72)},${f(-width * .92)} ${f(length)},0C${f(length * .7)},${f(width * .82)} ${f(length * .24)},${f(width * .9)} 0,0Z`
}
