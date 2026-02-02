/* ============================================
   THREE.JS 3D BACKGROUND
   Animated Particle System with Gold Particles
   ============================================ */

(function () {
    // Check for Three.js
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0f, 1);

    // Mobile Check
    const isMobile = window.innerWidth < 768;

    // Particle System - OPTIMIZED FOR MOBILE
    const particleCount = isMobile ? 30 : 150; // Drastically reduced for mobile
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Gold color variations - SUBTLE PALETTE
    const goldColors = [
        { r: 0.831, g: 0.686, b: 0.216 }, // Primary gold
        { r: 0.722, g: 0.588, b: 0.047 }, // Dark gold
    ];

    for (let i = 0; i < particleCount; i++) {
        // Positions - spread across a large area
        // Reduce spread on mobile 
        const spreadX = isMobile ? 30 : 60;
        const spreadY = isMobile ? 40 : 60;
        const spreadZ = isMobile ? 15 : 10;

        positions[i * 3] = (Math.random() - 0.5) * spreadX;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - spreadZ;

        // Random gold color
        const goldColor = goldColors[Math.floor(Math.random() * goldColors.length)];
        colors[i * 3] = goldColor.r;
        colors[i * 3 + 1] = goldColor.g;
        colors[i * 3 + 2] = goldColor.b;

        // Random sizes - SMALLER ON MOBILE
        sizes[i] = Math.random() * (isMobile ? 1.5 : 2.5) + 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle Material - LOWER OPACITY
    const particleMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.2, // Very low opacity
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating Geometric Shapes
    const geometries = [];
    const shapesGroup = new THREE.Group();

    // Create elegant shapes - REDUCED COUNT
    const shapeCount = 5; // Reduced from 15
    for (let i = 0; i < shapeCount; i++) {
        let geometry;
        const shapeType = Math.floor(Math.random() * 3); // Removed complex Torus

        switch (shapeType) {
            case 0:
                geometry = new THREE.OctahedronGeometry(0.3, 0); // Smaller
                break;
            case 1:
                geometry = new THREE.TetrahedronGeometry(0.3, 0); // Smaller
                break;
            default:
                geometry = new THREE.IcosahedronGeometry(0.2, 0); // Smaller
        }

        const material = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            wireframe: true,
            transparent: true,
            opacity: 0.08 // Extremely subtle
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Random position - Behind content
        mesh.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10 - 5
        );

        // Random rotation
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        // Store animation data - SLOWER SPEEDS
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.002, // Very slow rotation
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.002
            },
            floatSpeed: Math.random() * 0.2 + 0.1, // Slow float
            floatOffset: Math.random() * Math.PI * 2
        };

        geometries.push(mesh);
        shapesGroup.add(mesh);
    }

    scene.add(shapesGroup);

    // Camera position
    camera.position.z = 15;

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll position
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse following - VERY DAMPENED
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;

        // Rotate particles based on mouse
        particles.rotation.y = targetX * 0.1; // Minimal rotation
        particles.rotation.x = targetY * 0.05;

        // Subtle particle float
        particles.rotation.y += 0.0001; // Barely moving
        particles.rotation.z += 0.00005;

        // Move particles based on scroll
        particles.position.y = -scrollY * 0.002;

        // Animate geometric shapes
        geometries.forEach((mesh) => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;

            // Floating motion
            mesh.position.y += Math.sin(elapsedTime * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.001;
        });

        // Shapes follow mouse subtly
        shapesGroup.rotation.y = targetX * 0.05;
        shapesGroup.rotation.x = targetY * 0.02;

        // Parallax effect on scroll
        shapesGroup.position.y = -scrollY * 0.001;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

})();
