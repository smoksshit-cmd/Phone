// /* Приложение */
console.log('=== .../* Приложение */... ===');

console.log('1. ...:');
console.log('   - ParallelEventsApp:', typeof ParallelEventsApp);
console.log('   - parallelEventsManager:', typeof window.parallelEventsManager);
console.log('   - parallelEventsStyles:', typeof window.parallelEventsStyles);
console.log('   - getParallelEventsAppContent:', typeof window.getParallelEventsAppContent);
console.log('   - bindParallelEventsAppEvents:', typeof window.bindParallelEventsAppEvents);

// Статус
if (window.parallelEventsManager) {
    console.log('2. ...Статус:');
    console.log('   - isInitialized:', window.parallelEventsManager.isInitialized);
    console.log('   - isListening:', window.parallelEventsManager.isListening);
    console.log('   - currentSettings:', window.parallelEventsManager.currentSettings);
    console.log('   - eventQueue length:', window.parallelEventsManager.eventQueue?.length);
} else {
    console.log('2. ❌ ...');
}

if (window.parallelEventsStyles) {
    console.log('3. ...Статус:');
    console.log('   - ...:', window.parallelEventsStyles.getAvailableStyles());
    console.log('   - ...:', window.parallelEventsStyles.getCustomPrefix());
} else {
    console.log('3. ❌ ...');
}

console.log('4. ...Статус:');
console.log('   - mobileContextEditor:', typeof window.mobileContextEditor);
console.log('   - mobileCustomAPIConfig:', typeof window.mobileCustomAPIConfig);

console.log('=== ... ===');
