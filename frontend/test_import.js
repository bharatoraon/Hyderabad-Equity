try {
    require('react-map-gl');
    console.log('Success: react-map-gl found');
} catch (e) {
    console.error('Error:', e.message);
}
