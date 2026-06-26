'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface FloatingShape {
  mesh: THREE.Mesh
  baseY: number
  phase: number
  rotX: number
  rotY: number
  rotZ: number
}

export default function Background3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.z = 120

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a1628, 0.5))

    const pointLight1 = new THREE.PointLight(0x0078d4, 2)
    pointLight1.position.set(50, 80, 50)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x00bcf2, 1)
    pointLight2.position.set(-80, -20, -60)
    scene.add(pointLight2)

    // ── 1. Particle Field ─────────────────────────────────────
    const PARTICLE_COUNT = 2000
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
    const particleColors = new Float32Array(PARTICLE_COUNT * 3)

    const azureColor = new THREE.Color(0x0078d4)
    const cyanColor = new THREE.Color(0x00bcf2)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 400
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 400
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 400

      const c = Math.random() < 0.2 ? cyanColor : azureColor
      particleColors[i * 3] = c.r
      particleColors[i * 3 + 1] = c.g
      particleColors[i * 3 + 2] = c.b
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })

    const particleField = new THREE.Points(particleGeo, particleMat)
    scene.add(particleField)

    // ── 2. Animated Grid ──────────────────────────────────────
    const gridBaseGeo = new THREE.PlaneGeometry(600, 600, 60, 60)
    const gridWireGeo = new THREE.WireframeGeometry(gridBaseGeo)
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x0078d4,
      opacity: 0.08,
      transparent: true,
    })
    const grid = new THREE.LineSegments(gridWireGeo, gridMat)
    grid.rotation.x = -Math.PI / 2
    grid.position.y = -80
    scene.add(grid)

    // ── 3. Floating Icosahedra ────────────────────────────────
    const shapes: FloatingShape[] = []
    for (let i = 0; i < 8; i++) {
      const radius = 3 + Math.random() * 5
      const geo = new THREE.IcosahedronGeometry(radius, 1)
      const mat = new THREE.MeshStandardMaterial({
        color: Math.random() < 0.5 ? 0x0078d4 : 0x00bcf2,
        wireframe: true,
        opacity: 0.15 + Math.random() * 0.15,
        transparent: true,
      })
      const mesh = new THREE.Mesh(geo, mat)
      const bX = (Math.random() - 0.5) * 240
      const bY = -40 + Math.random() * 100
      const bZ = -80 + Math.random() * 100
      mesh.position.set(bX, bY, bZ)
      scene.add(mesh)
      shapes.push({
        mesh,
        baseY: bY,
        phase: Math.random() * Math.PI * 2,
        rotX: 0.002 + Math.random() * 0.006,
        rotY: 0.002 + Math.random() * 0.006,
        rotZ: 0.002 + Math.random() * 0.006,
      })
    }

    // ── 4. Connecting Lines ───────────────────────────────────
    const SAMPLE_COUNT = 300
    const sampled: THREE.Vector3[] = []
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const idx = Math.floor(Math.random() * PARTICLE_COUNT)
      sampled.push(
        new THREE.Vector3(
          particlePositions[idx * 3],
          particlePositions[idx * 3 + 1],
          particlePositions[idx * 3 + 2],
        ),
      )
    }

    const linePoints: number[] = []
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      for (let j = i + 1; j < SAMPLE_COUNT; j++) {
        if (sampled[i].distanceTo(sampled[j]) < 40) {
          linePoints.push(
            sampled[i].x, sampled[i].y, sampled[i].z,
            sampled[j].x, sampled[j].y, sampled[j].z,
          )
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePoints), 3),
    )
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00bcf2,
      opacity: 0.06,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(connectionLines)

    // ── Mouse Parallax ────────────────────────────────────────
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animation Loop ────────────────────────────────────────
    let frameId: number
    let time = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      if (document.hidden) return

      time += 0.01

      // Slowly rotate the particle field
      particleField.rotation.y += 0.0003
      particleField.rotation.x += 0.0001

      // Scroll grid forward, loop seamlessly
      grid.position.z += 0.15
      if (grid.position.z >= 60) grid.position.z = 0

      // Bob and rotate each icosahedron
      shapes.forEach((s) => {
        s.mesh.rotation.x += s.rotX
        s.mesh.rotation.y += s.rotY
        s.mesh.rotation.z += s.rotZ
        s.mesh.position.y = s.baseY + Math.sin(time + s.phase) * 8
      })

      // Pulse connection line opacity
      lineMat.opacity = Math.sin(time * 0.5) * 0.03 + 0.06

      // Camera parallax lerp toward mouse
      const targetX = (mouseX / window.innerWidth - 0.5) * 15
      const targetY = -(mouseY / window.innerHeight - 0.5) * 8
      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)

      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.Points ||
          obj instanceof THREE.LineSegments
        ) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })

      // gridBaseGeo is not added to the scene — dispose manually
      gridBaseGeo.dispose()

      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
