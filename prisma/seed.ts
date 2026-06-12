import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "ibrahim@umgafrica.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Ibrahim Abdull (Cyborg)",
      },
    });
    console.log("Admin user created");
  }

  const posts = [
    {
      title: "Building a Rust Compiler for STM32: Lessons from 3,600 Lines",
      slug: "building-rust-compiler-stm32",
      excerpt:
        "Ghost is a Rust-based compiler for embedded edge AI. Writing the tokenizer, parser, AST, and C emitter taught me more about hardware than any tutorial ever could.",
      content: `## The Stack\n\nGhost is structured as a traditional compiler pipeline: tokenizer → parser → AST → type checker → IR → code generation. The novel part is the IR level, where Ghost exposes plasticity primitives — \`reward()\`, \`punish()\`, and \`mutate_lifecycle()\` — that translate to on-device weight adjustments for embedded neural networks.\n\n## What I Got Wrong First\n\nMy first C emitter produced code that the STM32 HAL rejected. I was treating SRAM like a flat heap — ignoring SRAM bank boundaries on the F4. Two DMA channels accessing the same bank simultaneously causes a bus fault the reference manual barely mentions.\n\nThe STM32F405 has separate SRAM1 (112 KB), SRAM2 (16 KB), and CCM (64 KB) banks. CCM is faster but DMA-inaccessible. Moving tensor buffers to SRAM2 and DMA descriptors to SRAM1 resolved the contention.\n\n## The Quantization Bug\n\nGhost emits C that calls CMSIS-NN kernels. The tensor type bug — the bug I'm currently fixing — is a mismatch between Ghost's IR type system and CMSIS-NN's Q7 format. Ghost's IR represents width and depth as separate integers. CMSIS-NN wants HWC layout with INT8 per-channel scaling. The codegen bridge between these two has a subtle off-by-one in the scale factor computation.\n\nFinding this required reading the CMSIS-NN source, not the documentation. The source reveals the actual memory layout requirement; the docs only say "pass the quantization parameters."\n\n## Next Steps\n\nFix the codegen tensor type bug. Then implement native ELF output using inkwell to replace the C emission step. Running LLVM directly means Ghost can target STM32F4xx without requiring an ARM GCC toolchain — one less dependency.`,
      tags: "Rust,Compilers,Embedded",
      readTime: 12,
      published: true,
      featured: true,
    },
    {
      title: "Itqan: Why Islamic Mastery Ethics Make Better Engineers",
      slug: "itqan-islamic-mastery-ethics",
      excerpt:
        "The Prophet ﷺ said Allah loves when one does a job with itqan — mastery and perfection. I apply this to embedded firmware, and it changes how I work completely.",
      content: `## What Itqan Means\n\nItqan (إتقان) comes from the root أتقن — to do something with precision, perfection, and completeness. It is not about speed. Not about minimum viable. It is the Islamic concept of craftsmanship.\n\nFor a firmware engineer, itqan means: if you write an interrupt handler, you understand every clock cycle it spends. If you write a PID controller, you can explain every gain value from first principles. If you design a PCB, you have considered thermal dissipation, EMI, and manufacturing tolerances — not just "will it work in my lab."\n\n## The Practical Difference\n\nWithout itqan, I stop at "does it work." With itqan, I stop at "do I understand why it works, and have I considered all the ways it can fail?"\n\nThe difference shows up as reliability. Firmware that works at 22°C but fails at 40°C is not itqan. A watchdog that doesn't account for interrupt latency during power brown-out is not itqan.\n\n## The Muhassaba Practice\n\nMuhassaba is the Islamic practice of self-accounting. Every week, I review my engineering output: did I ship something I genuinely understand? Did I cut a corner I have not documented? Did I test the edge cases, or just the happy path?\n\nThis has made me slower in the short term and significantly more reliable in the long term. Siafu robots will operate in rural Tanzania without a human nearby. The amanah — the trust placed in the craftsman — demands maximum effort. Not because a client will know the difference. Because Allah will.`,
      tags: "Islam,Engineering,Philosophy",
      readTime: 8,
      published: true,
      featured: true,
    },
    {
      title: "TinyML on 128KB SRAM: INT8 Models on STM32F411",
      slug: "tinyml-128kb-sram-stm32f411",
      excerpt:
        "Arena allocation, CMSIS-NN internals, and memory budgeting for a keyword spotting model that actually fits on constrained hardware.",
      content: `## Model Selection & Sizing\n\nI used the hello_edge keyword spotting model from TF Micro examples, trained on Speech Commands. After INT8 post-training quantization, weights compressed to ~18 KB. Input tensor (MFCC of 1-second audio at 16 kHz) needs ~2 KB. So far comfortable in 128 KB SRAM.\n\nThe problem is the inference arena — the scratch memory the TFLM interpreter uses during inference. It must be statically allocated at startup. Too small and inference fails silently. Too large and you starve your application stack.\n\n## Arena Sizing Method\n\nStart with a large arena (80 KB). Run inference. Call \`MicroInterpreter::arena_used_bytes()\` to see actual usage. Set arena to 110% of that — the 10% headroom covers alignment padding variations between builds. For this model: reported 38,400 bytes. I set the arena to 42 KB, leaving 86 KB for application code and stack.\n\n## CMSIS-NN Key Facts\n\nTFLM on Cortex-M4 uses CMSIS-NN kernels. The core kernel arm_convolve_HWC_q7 uses SMLAD (dual 16-bit MAC). Input must be in HWC layout. Bias must be INT32. Output shift and multiplier are per-channel, not per-tensor. Misunderstanding the output shift is the most common cause of all-same-class inference output.\n\n## Latency Measurement\n\nUse DWT cycle counter:\n\n\`\`\`c\nCoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;\nDWT->CYCCNT = 0;\nDWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;\nuint32_t t0 = DWT->CYCCNT;\ninterpreter.Invoke();\nfloat ms = (float)(DWT->CYCCNT - t0) / (SystemCoreClock/1000.0f);\n\`\`\`\n\nResult: 87 ms at 100 MHz. Fast enough for real-time keyword detection with a sliding window.`,
      tags: "TinyML,STM32,CMSIS-NN",
      readTime: 15,
      published: true,
      featured: true,
    },
    {
      title: "Siafu Update: LoRa Mesh Reliability in Tanzanian Terrain",
      slug: "siafu-lora-mesh-tanzania",
      excerpt:
        "Six months of building swarm robots for African agriculture. The hardware works. LoRa mesh reliability in rural terrain is the hard unsolved problem.",
      content: `## The Terrain Problem\n\nArusha's agricultural zones have RF propagation characteristics that standard LoRa link budget calculations — developed for flat European environments — don't capture. Volcanic soil with high mineral content affects ground-wave propagation. Mount Meru creates multipath reflections across the basin. Maize at full growth attenuates 868 MHz signals more than crop models predict.\n\nResult: a two-node link that works at 50 meters fails intermittently at 150 meters across a maize boundary. Same hardware, same firmware, different environment.\n\n## What We Tried\n\nIncreasing spreading factor SF7 → SF10 improved reliability at the cost of airtime — packets take 6× longer to transmit. This reduces swarm update rate from 10 Hz to under 2 Hz, too slow for coordinated motion. Switching to 433 MHz improved vegetation penetration by ~4 dB but introduced interference from other IoT deployments in the area.\n\n## Current Solution: Adaptive Spreading Factor\n\nEach node monitors RSSI and SNR and steps up the spreading factor when signal quality drops below threshold. Fast communication when nodes are close; robust when far apart. The cost is implementation complexity and non-uniform airtime across the mesh.\n\n## The Deeper Problem\n\nThe real design challenge is building a swarm algorithm that degrades gracefully when mesh connectivity drops. Each node maintains a belief state about the global swarm configuration based on received messages. When connectivity is high, beliefs converge quickly. When low, beliefs diverge — but the swarm continues functioning locally while the mesh reconnects. This probabilistic approach is the key to field-deployable swarm intelligence.`,
      tags: "Robotics,LoRa,Africa",
      readTime: 10,
      published: true,
      featured: false,
    },
  ];

  for (const post of posts) {
    const exists = await prisma.post.findUnique({
      where: { slug: post.slug },
    });
    if (!exists) {
      await prisma.post.create({ data: post });
      console.log(`Post created: ${post.title}`);
    }
  }

  const projects = [
    {
      name: "Ghost",
      slug: "ghost",
      tagline: "Embedded Edge AI Compiler",
      description:
        "Rust-based compiler targeting STM32F4xx & ESP32-S3. On-device reinforcement learning via plasticity primitives. 3,600 lines of Rust — tokenizer, parser, AST, type checker, IR, VM, and C emitter.",
      tech: "Rust,LLVM,STM32F4xx,ESP32-S3,TinyML",
      status: "Active",
      color: "#00D9FF",
      year: 2025,
      featured: true,
      published: true,
    },
    {
      name: "Siafu Swarm",
      slug: "siafu-swarm",
      tagline: "Agricultural Swarm Robotics",
      description:
        "Autonomous robot swarm for African smallholder farmers. LoRa mesh, ESP32-S3 nodes, and collective intelligence algorithms for precision agriculture across Tanzania's varied terrain.",
      tech: "ESP32-S3,LoRa,Rust,ROS2",
      status: "Dev",
      color: "#00FF88",
      year: 2024,
      featured: true,
      published: true,
    },
    {
      name: "Jenga Connect",
      slug: "jenga-connect",
      tagline: "Hardware Procurement Platform",
      description:
        "B2B platform connecting hardware engineers with electronics suppliers in East Africa. First end-to-end order completed. Solving supply chain fragmentation for African makers.",
      tech: "Django,React,PostgreSQL",
      status: "Live",
      color: "#FF5500",
      year: 2024,
      featured: true,
      published: true,
    },
    {
      name: "AuraClock S3",
      slug: "auraclock-s3",
      tagline: "Mechatronic Focus Device",
      description:
        "ESP32-S3 focus enforcement device. Haptic feedback, IMU sensing, OLED display. Custom KiCad PCB. Designed for Hack Club Fallout 2026, Shenzhen.",
      tech: "ESP32-S3,KiCad,Rust,IMU",
      status: "Built",
      color: "#A855F7",
      year: 2026,
      featured: false,
      published: true,
    },
    {
      name: "Msingi",
      slug: "msingi",
      tagline: "Investment Readiness Engine",
      description:
        "SaaS for African pre-seed founders. 39-question readiness framework, M-Pesa Daraja, Cloudflare R2 data room, JWT auth, multi-org RBAC. Django + Next.js 14.",
      tech: "Django,Next.js,M-Pesa",
      status: "Beta",
      color: "#F59E0B",
      year: 2025,
      featured: false,
      published: true,
    },
    {
      name: "Ghost-X1",
      slug: "ghost-x1",
      tagline: "Custom Edge AI Board",
      description:
        "Custom ESP32-S3 PCB designed specifically for the Ghost compiler. USB-C, SPI flash, antenna connector. Hardware-software co-designed for optimal compiler output.",
      tech: "ESP32-S3,KiCad,PCB Design",
      status: "Active",
      color: "#FF5500",
      year: 2026,
      featured: true,
      published: true,
    },
  ];

  for (const project of projects) {
    const exists = await prisma.project.findUnique({
      where: { slug: project.slug },
    });
    if (!exists) {
      await prisma.project.create({ data: project });
      console.log(`Project created: ${project.name}`);
    }
  }

  const products = [
    {
      name: "Embedded Rust on STM32",
      slug: "embedded-rust-stm32",
      type: "ebook",
      subtitle: "From Registers to RTOS",
      price: 24.99,
      level: "Intermediate",
      pages: 280,
      emoji: "📖",
      color: "#00D9FF",
      description:
        "Bare-metal Rust on STM32F4xx. PAC, Embassy, RTIC, DMA, SWD debugging, and linker scripts.",
      features:
        '["Cortex-M4 Architecture","PAC & HAL","Embassy RTOS","DMA & Interrupts","SWD Debugging","Linker Scripts"]',
      published: true,
    },
    {
      name: "TinyML Deployment Bible",
      slug: "tinyml-deployment-bible",
      type: "ebook",
      subtitle: "INT8 to STM32F4",
      price: 19.99,
      level: "Advanced",
      pages: 190,
      emoji: "🌐",
      color: "#A855F7",
      description:
        "Quantized neural networks on Cortex-M4. CMSIS-NN internals, memory budgeting, and inference debugging.",
      features:
        '["INT8 Quantization","CMSIS-NN Internals","Memory Budgeting","Inference Debugging","Arena Allocation","Performance Tuning"]',
      published: true,
    },
    {
      name: "Ghost: Build a Compiler",
      slug: "ghost-build-compiler",
      type: "ebook",
      subtitle: "From Scratch in Rust",
      price: 29.99,
      level: "Advanced",
      pages: 340,
      emoji: "👻",
      color: "#00FF88",
      description:
        "Tokenizer, parser, AST, type checker, and LLVM IR emission. Real embedded compiler development.",
      features:
        '["Tokenization","Parsing","AST Construction","Type Checking","IR Generation","LLVM Backend"]',
      published: true,
    },
    {
      name: "IoT for Africa",
      slug: "iot-for-africa",
      type: "ebook",
      subtitle: "Hardware Under Constraint",
      price: 14.99,
      level: "Beginner",
      pages: 160,
      emoji: "🌍",
      color: "#F59E0B",
      description:
        "Building IoT hardware for African conditions: inconsistent power, limited supply chains, demanding environments.",
      features:
        '["Power Management","Thermal Design","Supply Chain","Field Testing","Enclosure Design","Radio Planning"]',
      published: true,
    },
    {
      name: "Ghost X1 Dev Board",
      slug: "ghost-x1-dev-board",
      type: "kit",
      subtitle: "ESP32-S3 Edge AI",
      price: 45.0,
      level: "",
      pages: 0,
      emoji: "⚙️",
      color: "#00D9FF",
      description:
        "Custom ESP32-S3 board for Ghost compiler demos. USB-C, SPI flash, antenna connector, quick-start firmware.",
      features:
        '["Custom PCB","ESP32-S3 Module","USB-C Cable","Getting Started Guide","Example Firmware","Pinout Reference"]',
      published: true,
    },
    {
      name: "AuraClock S3 Kit",
      slug: "auraclock-s3-kit",
      type: "kit",
      subtitle: "Build Your Focus Device",
      price: 38.0,
      level: "",
      pages: 0,
      emoji: "⏳",
      color: "#A855F7",
      description:
        "ESP32-S3, OLED, haptic motor, IMU. Hack Club Fallout 2026 design. Open-source Rust firmware included.",
      features:
        '["All PCB Components","OLED Display 0.96\\"","Haptic Driver IC","Open-Source Firmware","IMU Module","Battery Included"]',
      published: true,
    },
    {
      name: "STM32 Embedded Rust Starter",
      slug: "stm32-embedded-rust-starter",
      type: "kit",
      subtitle: "Begin Your Firmware Journey",
      price: 35.0,
      level: "",
      pages: 0,
      emoji: "🔌",
      color: "#00FF88",
      description:
        "STM32F4xx board, ST-Link V2 debugger, breadboard, jumper wires, sensors pack. Pairs with the Embedded Rust e-book.",
      features:
        '["STM32F4xx Dev Board","ST-Link V2 Debugger","Breadboard + Wires","Sensors Pack (5 types)","USB Cable","Component Kit"]',
      published: true,
    },
    {
      name: "Siafu Node Kit",
      slug: "siafu-node-kit",
      type: "kit",
      subtitle: "LoRa + ESP32-S3 Swarm Node",
      price: 52.0,
      level: "",
      pages: 0,
      emoji: "🌿",
      color: "#F59E0B",
      description:
        "Single Siafu swarm node. ESP32-S3, LoRa SX1276, soil moisture sensor, LiPo battery, weatherproof enclosure.",
      features:
        '["ESP32-S3 Board","LoRa SX1276 Module","Soil Moisture Sensor","LiPo + Weatherproof Case","Solar Charging","Mounting Hardware"]',
      published: true,
    },
  ];

  for (const product of products) {
    const exists = await prisma.product.findUnique({
      where: { slug: product.slug },
    });
    if (!exists) {
      await prisma.product.create({ data: product });
      console.log(`Product created: ${product.name}`);
    }
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
