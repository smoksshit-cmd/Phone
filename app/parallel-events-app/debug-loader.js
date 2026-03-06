// /* Приложение */
console.log('🔍 [Debug Loader] .../* Приложение */......');

console.log('📋 [Debug Loader] ...:');
console.log('  - ...URL:', window.location.href);
console.log('  - Пользователь...:', navigator.userAgent);

const expectedPaths = [
    './scripts/extensions/third-party/mobile/app/parallel-events-app/parallel-events-app.css',
    './scripts/extensions/third-party/mobile/app/parallel-events-app/parallel-events-styles.js',
    './scripts/extensions/third-party/mobile/app/parallel-events-app/parallel-events-app.js'
];

console.log('📁 [Debug Loader] ...:');
expectedPaths.forEach((path, index) => {
    console.log(`  ${index + 1}. ${path}`);
});

async function testFileAccess() {
    console.log('🌐 [Debug Loader] ......');
    
    for (let i = 0; i < expectedPaths.length; i++) {
        const path = expectedPaths[i];
        try {
            const response = await fetch(path);
            console.log(`  ✅ ${path} - Статус: ${response.status}`);
        } catch (error) {
            console.log(`  ❌ ${path} - ...: ${error.message}`);
        }
    }
}

const checkGlobals = () => {
    const globals = {
        'ParallelEventsApp': window.ParallelEventsApp,
        'parallelEventsManager': window.parallelEventsManager,
        'parallelEventsStyles': window.parallelEventsStyles,
        'getParallelEventsAppContent': window.getParallelEventsAppContent,
        'bindParallelEventsAppEvents': window.bindParallelEventsAppEvents
    };
    
    console.log('🔍 [Debug Loader] ...Статус:');
    Object.entries(globals).forEach(([name, value]) => {
        const type = typeof value;
        const exists = value !== undefined;
        console.log(`  - ${name}: ${exists ? '✅' : '❌'} (${type})`);
    });
    
    return globals;
};

checkGlobals();

testFileAccess();

let checkCount = 0;
const maxChecks = 20;
const checkInterval = setInterval(() => {
    checkCount++;
    console.log(`🔄 [Debug Loader] ... ${checkCount}/${maxChecks}:`);
    
    const globals = checkGlobals();
    
    // Если，
    const allExists = Object.values(globals).every(v => v !== undefined);
    if (allExists) {
        console.log('🎉 [Debug Loader] ...！');
        clearInterval(checkInterval);
        
        if (window.debugParallelEventsApp) {
            console.log('🔧 [Debug Loader] ......');
            window.debugParallelEventsApp();
        }
    } else if (checkCount >= maxChecks) {
        console.log('⏰ [Debug Loader] ...，...');
        clearInterval(checkInterval);
    }
}, 1000);

console.log('🔍 [Debug Loader] ...，......');
