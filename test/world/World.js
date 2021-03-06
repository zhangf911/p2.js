var World = require(__dirname + '/../../src/world/World')
,   Body = require(__dirname + '/../../src/objects/Body')
,   Circle = require(__dirname + '/../../src/shapes/Circle')
,   Convex = require(__dirname + '/../../src/shapes/Convex');

exports.construct = function(test){
    var world = new World();

    var options = {
        gravity: [123,456]
    };
    world = new World(options);
    test.equal(world.gravity[0], options.gravity[0]);
    test.equal(world.gravity[1], options.gravity[1]);
    test.done();
};

exports.addBody = function(test){
    // STUB
    test.done();
};

exports.addConstraint = function(test){
    // STUB
    test.done();
};

exports.addContactMaterial = function(test){
    // STUB
    test.done();
};

exports.addSpring = function(test){
    // STUB
    test.done();
};

exports.clear = function(test){
    // STUB
    test.done();
};

exports.clone = function(test){
    // STUB
    test.done();
};

exports.disableBodyCollision = function(test){
    var bodyA = new Body({ mass:1 }),
        bodyB = new Body({ mass:1 }),
        world = new World();
    bodyA.addShape(new Circle(1));
    bodyB.addShape(new Circle(1));
    world.addBody(bodyA);
    world.addBody(bodyB);
    world.disableBodyCollision(bodyA,bodyB);
    world.step(1/60);
    test.equal(world.narrowphase.contactEquations.length,0);
    world.enableBodyCollision(bodyA,bodyB);
    world.step(1/60);
    test.equal(world.narrowphase.contactEquations.length,1);
    test.done();
};

exports.getBodyById = function(test){
    // STUB
    test.done();
};

exports.getContactMaterial = function(test){
    // STUB
    test.done();
};

exports.hitTest = function(test){
    var b = new Body(),
        world = new World();
    world.addBody(b);
    test.deepEqual(world.hitTest([0,0],[b]) , [], "Should miss bodies without shapes");

    b.addShape(new Circle(1));
    test.deepEqual(world.hitTest([0,0],[b]) , [b], "Should hit Circle");
    test.deepEqual(world.hitTest([1.1,0],[b]) , [], "Should miss Circle");

    b = new Body();
    b.addShape(new Convex([ [-1,-1],
                            [ 1,-1],
                            [ 1, 1],
                            [-1, 1]]));
    test.deepEqual(world.hitTest([0,0],  [b]) , [b],  "Should hit Convex");
    test.deepEqual(world.hitTest([1.1,0],[b]) , [], "Should miss Convex");
    test.done();
};

exports.integrateBody = function(test){
    // STUB
    test.done();
};

exports.removeBody = function(test){
    // STUB
    test.done();
};

exports.removeConstraint = function(test){
    // STUB
    test.done();
};

exports.removeContactMaterial = function(test){
    // STUB
    test.done();
};

exports.removeSpring = function(test){
    // STUB
    test.done();
};

exports.runNarrowphase = function(test){
    // STUB
    test.done();
};

exports.step = function(test){
    // STUB
    test.done();
};

exports.events = {
    beginContact : function(test){
        var world = new World(),
            bodyA = new Body({ mass:1 }),
            bodyB = new Body({ mass:1 });
        world.addBody(bodyA);
        world.addBody(bodyB);
        var shapeA = new Circle(1),
            shapeB = new Circle(1);
        bodyA.addShape(shapeA);
        bodyB.addShape(shapeB);
        var beginContactHits = 0,
            endContactHits = 0;
        world.on("beginContact",function(evt){
            test.ok( evt.shapeA.id === shapeA.id || evt.shapeA.id === shapeB.id );
            test.ok( evt.shapeB.id === shapeA.id || evt.shapeB.id === shapeB.id );
            test.ok( evt.bodyA.id === bodyA.id || evt.bodyA.id === bodyB.id );
            test.ok( evt.bodyB.id === bodyA.id || evt.bodyB.id === bodyB.id );
            beginContactHits++;
        });
        world.on("endContact",function(evt){
            test.ok( evt.shapeA.id === shapeA.id || evt.shapeA.id === shapeB.id );
            test.ok( evt.shapeB.id === shapeA.id || evt.shapeB.id === shapeB.id );
            test.ok( evt.bodyA.id === bodyA.id || evt.bodyA.id === bodyB.id );
            test.ok( evt.bodyB.id === bodyA.id || evt.bodyB.id === bodyB.id );
            endContactHits++;
        });

        // First overlap - one new beginContact
        world.step(1/60);
        test.equal(beginContactHits, 1);
        test.equal(endContactHits, 0);

        // Still overlapping - should maintain
        world.step(1/60);
        test.equal(beginContactHits, 1);
        test.equal(endContactHits, 0);

        // End the overlap
        bodyA.position[0] = 10;
        world.step(1/60);
        test.equal(beginContactHits, 1);
        test.equal(endContactHits,1);

        test.done();
    },


    beginContact2 : function(test){
        var world = new World(),
            // 3 circles, A overlaps B which overlaps C
            bodyA = new Body({ mass:1, position:[-1.1,0] }),
            bodyB = new Body({ mass:1, position:[0,0] }),
            bodyC = new Body({ mass:1, position:[1.1,0] });
        world.addBody(bodyA);
        world.addBody(bodyB);
        world.addBody(bodyC);
        var shapeA = new Circle(1),
            shapeB = new Circle(1),
            shapeC = new Circle(1);
        bodyA.addShape(shapeA);
        bodyB.addShape(shapeB);
        bodyC.addShape(shapeC);

        var beginContactHits = 0,
            endContactHits = 0;

        world.on("beginContact",function(evt){
            beginContactHits++;
        });

        world.on("endContact",function(evt){
            endContactHits++;
        });

        // First overlap - two new beginContact
        world.step(1/60);
        test.equal(beginContactHits, 2);
        test.equal(endContactHits, 0);

        // Still overlapping - should not report anything
        world.step(1/60);
        test.equal(beginContactHits, 2);
        test.equal(endContactHits, 0);

        // End one overlap
        bodyA.position[1] = 10;
        world.step(1/60);
        test.equal(beginContactHits, 2);
        test.equal(endContactHits,1);

        // End another overlap
        bodyB.position[1] = -10;
        world.step(1/60);
        test.equal(beginContactHits, 2);
        test.equal(endContactHits,2);

        test.done();
    },
};
