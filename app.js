<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird Game</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.70.0/phaser.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #2c3e50;
            font-family: Arial, sans-serif;
        }
        #game-container {
            border: 3px solid #34495e;
            border-radius: 10px;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    
    <script>
        let config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 300 },
                    debug: false,
                },
            },
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };

        let game = new Phaser.Game(config);

        // Game variables
        var bird;
        let hasLanded = false;
        let cursors;
        let hasBumped = false;
        let messageToPlayer;
        let roads;
        let isGameStarted = false;

        function preload() {
            // Create simple colored rectangles as placeholders for assets
            this.add.graphics()
                .fillStyle(0x87CEEB)
                .fillRect(0, 0, 800, 600);
            
            // Create background texture
            this.add.graphics()
                .fillStyle(0x87CEEB)
                .fillRect(0, 0, 800, 600);
            this.add.graphics()
                .fillStyle(0x90EE90)
                .fillRect(0, 500, 800, 100);
            
            // Create simple textures for game objects
            this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
            
            // Create bird texture (simple yellow square)
            let birdGraphics = this.add.graphics();
            birdGraphics.fillStyle(0xFFD700);
            birdGraphics.fillRect(0, 0, 32, 32);
            birdGraphics.generateTexture('bird', 32, 32);
            birdGraphics.destroy();
            
            // Create road texture (brown rectangle)
            let roadGraphics = this.add.graphics();
            roadGraphics.fillStyle(0x8B4513);
            roadGraphics.fillRect(0, 0, 800, 32);
            roadGraphics.generateTexture('road', 800, 32);
            roadGraphics.destroy();
            
            // Create column texture (green rectangle)
            let columnGraphics = this.add.graphics();
            columnGraphics.fillStyle(0x228B22);
            columnGraphics.fillRect(0, 0, 64, 200);
            columnGraphics.generateTexture('column', 64, 200);
            columnGraphics.destroy();
        }

        function create() {
            // Create background
            const background = this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
            
            // Create instructions text
            messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { 
                fontFamily: '"Comic Sans MS", Times, serif', 
                fontSize: "20px", 
                color: "white", 
                backgroundColor: "black",
                padding: { x: 10, y: 5 }
            });
            
            // Position instructions at bottom center
            messageToPlayer.setPosition(400 - messageToPlayer.width/2, 550);
            
            // Create roads
            roads = this.physics.add.staticGroup();
            const road = roads.create(400, 584, "road").refreshBody();
            
            // Create columns
            const topColumns = this.physics.add.staticGroup({
                key: "column",
                repeat: 1,
                setXY: { x: 200, y: 100, stepX: 300 },
            });
            
            const bottomColumns = this.physics.add.staticGroup({
                key: "column",
                repeat: 1,
                setXY: { x: 350, y: 450, stepX: 300 },
            });
            
            // Create bird
            bird = this.physics.add.sprite(100, 300, "bird");
            bird.setBounce(0.2);
            bird.setCollideWorldBounds(true);
            
            // Set up physics interactions
            this.physics.add.overlap(bird, topColumns, () => hasBumped = true, null, this);
            this.physics.add.overlap(bird, bottomColumns, () => hasBumped = true, null, this);
            this.physics.add.collider(bird, topColumns);
            this.physics.add.collider(bird, bottomColumns);
            
            this.physics.add.overlap(bird, roads, () => hasLanded = true, null, this);
            this.physics.add.collider(bird, roads);
            
            // Set up input
            cursors = this.input.keyboard.createCursorKeys();
        }

        function update() {
            // Start game when space is pressed
            if (cursors.space.isDown && !isGameStarted) {
                isGameStarted = true;
                messageToPlayer.setText("Use UP arrow to fly!");
            }
            
            // Keep bird floating before game starts
            if (!isGameStarted) {
                bird.setVelocityY(-160);
            }
            
            // Allow bird to move up when up key is pressed (only if game started and bird hasn't landed or bumped)
            if (cursors.up.isDown && !hasLanded && !hasBumped && isGameStarted) {
                bird.setVelocityY(-160);
            }
            
            // Handle horizontal movement
            if (isGameStarted && !hasLanded && !hasBumped) {
                bird.body.velocity.x = 50;
            } else {
                bird.body.velocity.x = 0;
            }
        }
    </script>
</body>
</html>