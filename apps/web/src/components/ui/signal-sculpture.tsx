'use client'

import { useEffect, useRef, useState } from 'react'

export default function SignalSculpture() {
  const host = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const pauseRef = useRef(false)
  useEffect(() => {
    pauseRef.current = paused
  }, [paused])

  useEffect(() => {
    const element = host.current
    if (!element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let cleanup = () => {}
    // Keep the CSS sculpture as a complete fallback on low-motion devices.
    if (motion.matches) return
    void import('three')
      .then(THREE => {
        if (disposed) return
        let renderer: import('three').WebGLRenderer
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          })
        } catch {
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        element.appendChild(renderer.domElement)
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
        camera.position.z = 8.5
        const group = new THREE.Group()
        scene.add(group)
        const geometry = new THREE.TorusKnotGeometry(1.45, 0.38, 144, 20, 2, 3)
        const material = new THREE.MeshStandardMaterial({
          color: '#e69868',
          metalness: 0.72,
          roughness: 0.27,
        })
        const knot = new THREE.Mesh(geometry, material)
        group.add(knot)
        const wireGeometry = new THREE.IcosahedronGeometry(2.35, 1)
        const wireMaterial = new THREE.MeshBasicMaterial({
          color: '#b9a998',
          wireframe: true,
          transparent: true,
          opacity: 0.16,
        })
        group.add(new THREE.Mesh(wireGeometry, wireMaterial))
        scene.add(new THREE.HemisphereLight('#ffedda', '#374b55', 3))
        const key = new THREE.DirectionalLight('#fff1df', 7)
        key.position.set(3, 4, 5)
        scene.add(key)
        const rim = new THREE.DirectionalLight('#a9d6df', 4)
        rim.position.set(-4, -1, 2)
        scene.add(rim)
        let visible = true
        let frame = 0
        let last = 0
        let x = 0
        let y = 0
        const render = (time: number) => {
          frame = 0
          if (disposed || !visible || document.hidden) return
          const delta = Math.min((time - last) / 1000, 0.05)
          last = time
          if (!pauseRef.current && !motion.matches) {
            knot.rotation.y += delta * 0.18
            knot.rotation.z += delta * 0.06
            group.rotation.x += (y * 0.2 - group.rotation.x) * 0.035
            group.rotation.y += (x * 0.3 - group.rotation.y) * 0.035
          }
          renderer.render(scene, camera)
          if (!pauseRef.current && !motion.matches)
            frame = requestAnimationFrame(render)
        }
        const resume = () => {
          if (!frame && visible && !document.hidden)
            frame = requestAnimationFrame(render)
        }
        const resize = () => {
          const { width, height } = element.getBoundingClientRect()
          renderer.setSize(width, height)
          camera.aspect = width / Math.max(height, 1)
          camera.updateProjectionMatrix()
          resume()
        }
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect()
          x = (event.clientX - rect.left) / rect.width - 0.5
          y = (event.clientY - rect.top) / rect.height - 0.5
        }
        const observer = new IntersectionObserver(entries => {
          visible = entries[0].isIntersecting
          resume()
        })
        observer.observe(element)
        const sizeObserver = new ResizeObserver(resize)
        sizeObserver.observe(element)
        element.addEventListener('pointermove', move)
        element.addEventListener('sculpture-resume', resume)
        document.addEventListener('visibilitychange', resume)
        motion.addEventListener('change', resume)
        const contextLost = (event: Event) => {
          event.preventDefault()
          visible = false
          setReady(false)
        }
        renderer.domElement.addEventListener('webglcontextlost', contextLost)
        resize()
        setReady(true)
        cleanup = () => {
          cancelAnimationFrame(frame)
          observer.disconnect()
          sizeObserver.disconnect()
          element.removeEventListener('pointermove', move)
          element.removeEventListener('sculpture-resume', resume)
          document.removeEventListener('visibilitychange', resume)
          motion.removeEventListener('change', resume)
          renderer.domElement.removeEventListener(
            'webglcontextlost',
            contextLost
          )
          geometry.dispose()
          material.dispose()
          wireGeometry.dispose()
          wireMaterial.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
      })
      .catch(() => {
        /* The static sculpture remains visible if loading fails. */
      })
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <div className="signal-art">
      <div className="signal-coordinate">HK / EXPERIMENT 001</div>
      <div ref={host} className="signal-canvas" aria-hidden="true">
        {!ready && (
          <div className="signal-fallback">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <div className="signal-caption">
        <span>CODE, WITH A CREATIVE FREQUENCY.</span>
        {ready && (
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => {
              pauseRef.current = !paused
              setPaused(!paused)
              host.current?.dispatchEvent(new Event('sculpture-resume'))
            }}
          >
            {paused ? 'Play motion' : 'Pause motion'}{' '}
            <span aria-hidden="true">{paused ? '↗' : 'Ⅱ'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
