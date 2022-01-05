# Priorities
Priorities provide a way for certain code to run before others, allowing better integration between components. For example, the collision resolver component should run after the collider component has determined the collisions, so the collision resolver has a higher priority than the collider. This document provides an overview of the different priorities, and which types of components are generally assigned to them.

| Priority | Component Category |
|----------|--------------------|
| -600     | Mount point        |
| -500     | DOA                |
| -400     | Point              |
| -390     | Parent             |
| -300     | Collider           |
| -200     | Collision Resolver |
| -100     | Renderer           |
| 0        | Base layer         |
