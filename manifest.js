module.exports = ({ version }) => {
    return JSON.stringify({
        name: 'Snapshot',
        description: 'Capture the state of your current browser window.',
        version,
        manifest_version: 3,
        permissions: [
            'tabs',
            'storage'
        ],
        action: {
            default_popup: 'app.html'
        },
        content_scripts: [
            {
                matches: [
                    '<all_urls>'
                ],
                js: [
                    'content.js'
                ]
            }
        ],
        icons: {
            16: 'icons/png/16x16.png',
            48: 'icons/png/48x48.png',
            128: 'icons/png/128x128.png'
        }
    });
};