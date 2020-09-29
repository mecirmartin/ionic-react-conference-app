import { activate, initialize } from 'react-devtools-inline/backend';

initialize(window);

// Wait for the frontend to let us know that it's ready.
const onMessage = ({ data }) => {
    switch (data.type) {
        case 'activate-backend':
            window.removeEventListener('message', onMessage);
            activate(window);
            console.log('Banckend activated')
            break;
        default:
            break;
    }
};

window.addEventListener('message', onMessage);
